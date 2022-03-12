import {useState, useEffect, useCallback} from 'react';
import {firebase} from '../../firebase';
import { useDispatch } from 'react-redux';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { TiDeleteOutline } from 'react-icons/ti';
import { BiUpload } from 'react-icons/bi';
import { addDiary } from '../../redux/actions/diaryAction';
import clsx from 'clsx';
import styles from './CreateStory.module.scss';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function CreateStory() {
    const dispatch = useDispatch();
    const [files, setFiles] = useState([]);
    // const [url, setURL]= useState("");
    const [arrURL, setArrURL] = useState([]);
    const [progress, setProgress] = useState(0);
    const [typeFile, setTypeFile] = useState('None');
    const [status, setStatus] = useState('');
    const [disableButton, setDisableButton] = useState(true);
    const [loading, setLoading] = useState(false);
    const [minWidth, setMinWidth] = useState(() => {
        if(window.innerWidth <= 990) return true;
        return false;
    });
    useEffect(() => {
        const handleResize = () => {
            setMinWidth(window.innerWidth <= 990);
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);
    const handleAddMedia = () => {
        console.log('addMedia');
    }
    const handleChange = (e) => {
        if(e.target.files[0]){
            for(let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                file.preview = URL.createObjectURL(file);
                setFiles(pre => [...pre, file]);
            }
        }
    }
    const handleDeleteFile = url => {
        // console.log('file delete', url);
        const newFiles = files.filter(item => {
            if(item.preview === url){
                URL.revokeObjectURL(item.preview);
                return false;
            }
            return true;
        });
        setFiles(newFiles);
    }
    // console.log('files', files);
    const handleSubmit = () => {
        let type = 'images';
        for(let i = 0; i < files.length; i++) {
            if(files[i].type.includes("video")){
                type = 'videos'
            }
            if(files[i].type.includes("audio")){
                type = 'audios'
            }
            if(files[i].type.includes("image")){
                type = 'images'
            }
            const uploadTask = firebase.storage().ref(`${type}/${files[i].name}`).put(files[i]);
            if(type === 'images'){
                uploadTask.on(
                    "state_changed",
                    snapshot => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        )
                        setProgress(progress)
                    },
                    error => {
                        console.log(error);
                    }, 
                    () => {
                        firebase.storage()
                            .ref("images")
                            .child(files[i].name)
                            .getDownloadURL()
                            .then(url => {
                                console.log(url);
                                // setURL(url);
                                setArrURL(pre => [...pre, {
                                    type: 'Image',
                                    url: url
                                }]);
                            })
                    }
                )
            }
            if(type === 'videos'){
                uploadTask.on(
                    "state_changed",
                    snapshot => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        )
                        setProgress(progress)
                    },
                    error => {
                        console.log(error);
                    }, 
                    () => {
                        firebase.storage()
                            .ref("videos")
                            .child(files[i].name)
                            .getDownloadURL()
                            .then(url => {
                                console.log(url);
                                // setURL(url);
                                setArrURL(pre => [...pre, {
                                    type: 'Video',
                                    url: url
                                }]);
                            })
                    }
                )
            }
            if(type === 'audios'){
                uploadTask.on(
                    "state_changed",
                    snapshot => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        )
                        setProgress(progress)
                    },
                    error => {
                        console.log(error);
                    }, 
                    () => {
                        firebase.storage()
                            .ref("audios")
                            .child(files[i].name)
                            .getDownloadURL()
                            .then(url => {
                                console.log(url);
                                // setURL(url);
                                setArrURL(pre => [...pre, {
                                    type: 'Audio',
                                    url: url
                                }]);
                            })
                    }
                )
            }
        }
    }
    const handleDeleteURL = url => {
        const newArrURL = arrURL.filter(item => item.url !== url);
        setArrURL(newArrURL);
    }
    const handleChangeType = e => {
        setTypeFile(e.target.value);
    }
    const handleStatus = e => {
        setStatus(e.target.value);
        // if(e.target.value.trim() !== '') setDisableButton(false);
        // else setDisableButton(true);
    }
    const handleUpload = useCallback(async () => {
        const data = localStorage.getItem('userData');
        const user = JSON.parse(data);
        const today = new Date().toLocaleString() + "";
        const currentDate = today.split(", ");
        const arrTime = currentDate[0].split(":");
        const time = arrTime[0] + ":" + arrTime[1];
        const dateArr = currentDate[1].split("/");
        if(dateArr[1].length === 1) dateArr[1] = "0" + dateArr[1];
        if(dateArr[0].length === 1) dateArr[0] = "0" + dateArr[0];
        let newStory = {
            IDUser: user.ID,
            Content: status,
            Date: dateArr[0] + "/" + dateArr[1] + "/" + dateArr[2],
            Time: time
        }
        let typeUpload = 'Story';
        let media = {};
        if(arrURL.length > 0 && typeFile !== 'None') {
            typeUpload = 'StoryMedia';
            let arrURLs = [];
            arrURL.map(url => (
                arrURLs.push(url.url)
            ))
            media = {
                type: typeFile,
                URLs: arrURLs
            }
        }
        const res = await dispatch(addDiary(newStory, media, typeUpload, setLoading));
        if(res.status === 200) {
            const data = localStorage.getItem('URLCreate');
            localStorage.removeItem('URLCreate');
            window.location.href=`/${data}`;
        }
    }, [arrURL, dispatch, status, typeFile])
    const handleBack = useCallback(() => {
        window.history.back()
    }, []);
    const handleNotification = useCallback(() => {
        confirmAlert({
        customUI: ({ onClose }) => {
            return (
            <div className={!minWidth && styles.dialog}>
                <h1>Error</h1>
                <p>You can't post without content!</p>
                <div className={styles.btn} onClick={onClose}>
                    <Button light handleClick={() => true}>OK</Button>
                </div>
            </div>
            );
        }
        });
    }, [minWidth])
    useEffect(() => {
        setDisableButton(true);
        if((progress === 100 || progress === 0) && status.trim() !== '') {
            setDisableButton(false);
        }
    },[progress, status])
    const styleAdd = { color: "#1e90ff", fontSize: "30px" };
    const style = { color: "#ff4757", fontSize: "30px" };
    const styleUpload = { color: "#48dbfb", fontSize: "30px" };
    if(loading) return (
        <>
            <Loading />
        </>
    );
    return(
        <>
            <h1 className={clsx(styles.header, {
                [styles.headerResize]: !minWidth
            })}>Create Story</h1>
            <div className={clsx(styles.box, {
                [styles.boxResize]: !minWidth
            })}>
                <div className={styles.content}>
                    <p>Status</p>
                    <textarea value={status} onChange={e => handleStatus(e)} cols="40" rows="5" placeholder="What are you thinking?..."></textarea>
                </div>
                <div className={styles.media}>
                    <div className={styles.mediaBox}>
                        <p>File (Optional)</p>
                        <select value={typeFile} onChange={e => handleChangeType(e)}>
                            <option value="None">None</option>
                            <option value="Image">Image</option>
                            <option value="Video">Video</option>
                            <option value="Audio">Audio</option>
                        </select>
                    </div>
                    <br />
                    <div className={styles.mediaFile}>
                        {
                            files && !arrURL.length && files.map((file, index) => (
                                typeFile === 'Image' ?
                                <div className={styles.boxMedia} key={index}>
                                    <div className={styles.delete} onClick={() => handleDeleteFile(file.preview)}>
                                        <TiDeleteOutline style={style} />
                                    </div>
                                    <div className={styles.update} onClick={handleSubmit}>
                                        <BiUpload style={styleUpload} />
                                    </div>
                                    <img src={file.preview} alt={file.name} className={styles.image}/>
                                </div> :
                                typeFile === 'Video' ?
                                <div className={styles.boxMedia} key={index}>
                                    <div className={styles.delete} onClick={() => handleDeleteFile(file.preview)}>
                                        <TiDeleteOutline style={style} />
                                    </div>
                                    <div className={styles.update} onClick={handleSubmit}>
                                        <BiUpload style={styleUpload} />
                                    </div>
                                    <video height='185' controls>
                                        <source src={file.preview} type='video/mp4' />
                                    </video>
                                </div> :
                                typeFile === 'Audio' ?
                                <div className={styles.boxMedia} key={index}>
                                    <div className={styles.delete} onClick={() => handleDeleteFile(file.preview)}>
                                        <TiDeleteOutline style={style} />
                                    </div>
                                    <div className={styles.update} onClick={handleSubmit}>
                                        <BiUpload style={styleUpload} />
                                    </div>
                                    <audio controls >
                                        <source src={file.preview} type="audio/mpeg" />
                                    </audio>
                                </div> :
                                <></>
                            ))
                        }
                        {
                            !arrURL.length &&
                            <>
                                <div className={styles.addition}>
                                    <label htmlFor="file">
                                        <IoMdAddCircleOutline style={styleAdd} onClick={handleAddMedia} className={styles.icon} />
                                    </label>
                                    <input id="file" type="file" onChange={e => handleChange(e)} multiple className={styles.inputFile} />
                                </div>
                            </>
                        }
                    </div>
                    {
                        !arrURL.length &&
                        <>
                            <br />
                            <progress value={progress} max="100" />
                            <br />
                        </>
                    }
                    {/* <button onClick={handleSubmit}>Submit</button> */}
                    {/* <img src={url || "http://via.placeholder.com/300"} alt="placeholder" /> */}
                    <div className={styles.mediaFile}>
                        {
                            arrURL && arrURL.map((file, index) => (
                                typeFile === 'Image' ?
                                <div className={styles.boxMedia} key={index}>
                                    <div className={styles.delete} onClick={() => handleDeleteURL(file.url)}>
                                        <TiDeleteOutline style={style} />
                                    </div>
                                    <img src={file.url} alt={file.name} className={styles.image}/>
                                </div> :
                                typeFile === 'Video' ?
                                <div className={styles.boxMedia} key={index}>
                                    <div className={styles.delete} onClick={() => handleDeleteURL(file.url)}>
                                        <TiDeleteOutline style={style} />
                                    </div>
                                    <video height='185' controls>
                                        <source src={file.url} type='video/mp4' />
                                    </video>
                                </div> :
                                typeFile === 'Audio' ?
                                <div className={styles.boxMedia} key={index}>
                                    <div className={styles.delete} onClick={() => handleDeleteURL(file.url)}>
                                        <TiDeleteOutline style={style} />
                                    </div>
                                    <audio controls >
                                        <source src={file.url} type="audio/mpeg" />
                                    </audio>
                                </div> :
                                <></>
                            ))
                        }
                    </div>
                </div>
                <div className={styles.listBtn}>
                    <div className={styles.btn}>
                        <Button edit handleClick={disableButton ? handleNotification : handleUpload}>Upload</Button>
                    </div>
                    <div className={styles.btn}>
                        <Button light handleClick={handleBack}>Back</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateStory;