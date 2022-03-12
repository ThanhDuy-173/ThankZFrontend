import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TiDeleteOutline } from 'react-icons/ti';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { BiUpload } from 'react-icons/bi';
import {getAllMediaByUser} from '../../redux/actions/mediaAction';
import {getAllStoryByUser} from '../../redux/actions/storyAction';
import {getUser} from '../../redux/actions/userAction';
import { AllStories, AllMedia } from '../../redux/selectors';
import { updateDiary, deleteDiary } from '../../redux/actions/diaryAction';
import {firebase} from '../../firebase';
import clsx from 'clsx';
import styles from './DetailStory.module.scss';
import Button from '../../components/Button';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
function DetailStory() {
    const dispatch = useDispatch();
    const stories = useSelector(AllStories);
    const media = useSelector(AllMedia);
    const [dataStory, setDataStory] = useState([]);
    const [content, setContent] = useState("");
    const [dataMedia, setDataMedia] = useState(null);
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [files, setFiles] = useState([]);
    const [newSrc, setNewSrc]= useState([]);
    const [idUser, setIDUser] = useState(() => {
        const data = localStorage.getItem('userData');
        const user = JSON.parse(data);
        if(user !== null) return user.ID;
        return "0";
    });
    const [minWidth, setMinWidth] = useState(() => {
        if(window.innerWidth <= 990) return true;
        return false;
    });
    const [dayTime, setDayTime] = useState(() => {
        const Today = new Date().toLocaleString() + "";
        const currentDate = Today.split(", ");
        const dateArr = currentDate[1].split("/");
        if(dateArr[1].length === 1) dateArr[1] = "0" + dateArr[1];
        if(dateArr[0].length === 1) dateArr[0] = "0" + dateArr[0];
        return{
            day: dateArr[0] + "/" + dateArr[1] + "/" + dateArr[2],
            time: currentDate[0]
        };
    });
    const [progress, setProgress] = useState(0);
    const [disabled, setDisabled] = useState(false);
    useEffect(() => {
        setDisabled(false);
        if(progress !== 100 && progress !== 0) {
            setDisabled(true);
        }
    },[progress])
    useEffect(() => {
        const handleResize = () => {
            setMinWidth(window.innerWidth <= 990);
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);
    useEffect(()=>{
        // setDataStory(stories);
        const uri = window.location.pathname;
        const arrUri = uri.split("/");
        setDataStory(stories.filter(s => {
            if(s.ID === arrUri[2]) {
                setContent(s.Content);
                if(s.Media !== undefined) {
                    setDataMedia(s.Media);
                }
                return true;
            }
            return false
        }));
        // if(diaries.length === 0) 
        //     setLoading(true);
        // else 
        //     setLoading(false);
    },[stories]);
    useEffect(async ()=>{
        const res = await dispatch(getAllMediaByUser(idUser, setLoading));
    },[]);
    useEffect(async ()=>{
        const res = await dispatch(getAllStoryByUser(idUser, setLoading));
    },[]);
    useEffect(async ()=>{
        const data = await localStorage.getItem('userData');
        const user = JSON.parse(data);
        // console.log(user);
        if(user !== null) {
            const res = await dispatch(getUser(user));
        } 
        // localStorage.removeItem('userData');
    },[]);
    const handleEdit = useCallback(async () => {
        if(!edit && dataStory[0]?.Media !== undefined){
            setFiles([])
            setDataMedia(dataStory[0]?.Media)
            setNewSrc([]);
            setContent(dataStory[0]?.Content);
        }
        if(edit) {
            // console.log("Update Content", content);
            // console.log("Update New File", newSrc);
            // console.log("Update Delete File", dataMedia);
            const uri = window.location.pathname;
            const arrUri = uri.split("/");
            let typeUpdate = [];
            let newMedia = [];
            if(content !== dataStory[0]?.Content) typeUpdate = [...typeUpdate, "Content"];
            if(newSrc.length || dataMedia !== dataStory[0]?.Media) {
                newMedia = [...dataMedia.Src, ...newSrc];
                newMedia.length ?
                typeUpdate = [...typeUpdate, "StoryMedia"] :
                typeUpdate = [...typeUpdate, "DeleteStoryMedia"]
            }
            console.log('====================================');
            console.log(arrUri[2]);
            console.log({content, newMedia, typeUpdate});
            console.log('====================================');
            const res = await dispatch(updateDiary(idUser, arrUri[2], content, newMedia, typeUpdate, setLoading));
            if(res.status === 200) {
                const story = await dispatch(getAllStoryByUser(idUser, setLoading));
            }
        }
        setEdit(!edit);
    }, [edit, idUser, dataStory, newSrc, content, dataMedia, dispatch]);
    const handleBack = useCallback(() => {
        if(edit){
            setEdit(!edit);
        } else {
            window.history.back()
        }
    }, [edit])
    const handleDeleteDiary = useCallback(async (onClose) => {
        const uri = window.location.pathname;
        const arrUri = uri.split("/");
        const res = await dispatch(deleteDiary(idUser, arrUri[2], "Story", setLoading));
        if(res.status === 200) {
            // window.href(`/${arrUri[1]}`);
            window.history.back();
            onClose();
        }
    }, [dispatch, idUser])
    const handleDelete = useCallback(() => {
        // window.confirm("Delete post????")
        confirmAlert({
        customUI: ({ onClose }) => {
            return (
            <div className={!minWidth && styles.dialog}>
                <h1>Are you sure?</h1>
                <p>You want to delete this diary?</p>
                <div className={styles.btn}>
                    <Button drop handleClick={() => handleDeleteDiary(onClose)}>Delete</Button>
                </div>
                <div className={styles.btn} onClick={onClose}>
                    <Button light handleClick={() => true}>Cancel</Button>
                </div>
            </div>
            );
        }
        });
    },[minWidth, handleDeleteDiary])
    const handleContent = e => {
        setContent(e.target.value);
    }
    const handleDeleteMedia = (src, type) => {
        // console.log(type);
        if(type === "dataMedia") {
            const newUrl = dataMedia.Src.filter(url => url !== src)
            setDataMedia({
                ...dataMedia,
                Src: newUrl
            })
        } else {
            const newUrl = newSrc.filter(url => url !== src)
            setNewSrc(newUrl)
        }
    }
    const handleDeleteFile = url => {
        const newFiles = files.filter(file => file.preview !== url);
        setFiles(newFiles);
    }
    const handleUploadFile = () => {
        let type = 'images';
        if(dataMedia.Type === "Video"){
            type = "videos"
        }
        if(dataMedia.Type === "Audio"){
            type = "audios"
        }
        for(let i = 0; i < files.length; i++) {
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
                                // console.log("Run add file", url);
                                setNewSrc(pre => [...pre, url]);
                                const newFiles = files.filter(file => file.preview !== files[i].preview);
                                setFiles(newFiles);
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
                                setNewSrc(pre => [...pre, url]);
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
                                setNewSrc(pre => [...pre, url]);
                            })
                    }
                )
            }
        }
    }
    // useEffect(() => {
    //     if(dataMedia !== undefined) {
    //         const type = dataMedia.Type;
    //         const listSrc = [...dataMedia.Src, ...newSrc];
    //         setDataMedia({
    //             Type: type,
    //             Src: listSrc
    //         })
    //         console.log(type, listSrc);
    //     }
        
    // },[newSrc, dataMedia])
    const handleAddMedia = () => {
        console.log('addMedia');
    }
    const handleChange = (e) => {
        // console.log('file', e.target.files);
        // if(e.target.files[0]){
        //     setImage(e.target.files[0]);
        // }
        if(e.target.files[0]){
            for(let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                file.preview = URL.createObjectURL(file);
                setFiles(pre => [...pre, file]);
            }
        }
    }
    // console.log("Content", content);
    // console.log("Media", dataMedia);
    // console.log('File', files);
    // console.log('SRC', newSrc);
    // console.log("progress", progress, disabled);
    const style = { color: "#ff4757", fontSize: "30px" };
    const styleUpload = { color: "#48dbfb", fontSize: "30px" };
    const styleAdd = { color: "#1e90ff", fontSize: "30px" };
    return (
        <>
            <h1 className={clsx(styles.header, {
                [styles.headerResize]: !minWidth
            })}>Detail Story Page</h1>
            {
                dataStory ?
                <>
                    <div className={styles.content}>
                            {dataStory.map((story) => (
                                <div 
                                    key={story.ID} 
                                    className={clsx(
                                        styles.story, {
                                        [styles.storyResize]: !minWidth
                                    })}
                                >
                                    <div 
                                        className={clsx(styles.times, {
                                            [styles.timesNormal]: !minWidth,
                                            [styles.timesMin]: minWidth
                                        })}
                                    >
                                        {story.Date === dayTime.day ? <p>Today</p> : <p>{story.Date}</p>}
                                        <p>{story.Time}</p>
                                    </div>
                                    <p className={styles.name}>{story.UserName}</p>
                                    {
                                        edit ?
                                        <>
                                            <input className={styles.text} type="text" value={content} onChange={e => handleContent(e)} />
                                            {dataMedia !== undefined && Object.keys(dataMedia).length ? (
                                                <div className={styles.media}>
                                                {
                                                    dataMedia.Type === 'Image' ?
                                                    <>
                                                        {
                                                            dataMedia.Src.map((src, index) => (
                                                                <div className={styles.boxMedia} key={index}>
                                                                    <div className={styles.delete} onClick={() => handleDeleteMedia(src, "dataMedia")}>
                                                                        <TiDeleteOutline style={style} />
                                                                    </div>
                                                                    <img src={src} alt={story.Content} className={styles.image}/>
                                                                </div>
                                                            ))
                                                        }
                                                        {
                                                            newSrc && (
                                                                newSrc.map((src, index) => (
                                                                    <div className={styles.boxMedia} key={index}>
                                                                        <div className={styles.delete} onClick={() => handleDeleteMedia(src, "newSrc")}>
                                                                            <TiDeleteOutline style={style} />
                                                                        </div>
                                                                        <img src={src} alt={story.Content} className={styles.image}/>
                                                                    </div>
                                                                ))
                                                            )
                                                        }
                                                        {
                                                            files && !newSrc.length && (
                                                                files.map((file, index) => (
                                                                    <div className={styles.boxMedia} key={index}>
                                                                        <div className={styles.delete} onClick={() => handleDeleteFile(file.preview)}>
                                                                            <TiDeleteOutline style={style} />
                                                                        </div>
                                                                        <div className={styles.update} onClick={handleUploadFile}>
                                                                            <BiUpload style={styleUpload} />
                                                                        </div>
                                                                        <img src={file.preview} alt={story.Content} className={styles.image}/>
                                                                    </div>
                                                                ))
                                                            )
                                                        }
                                                    </> :
                                                    dataMedia.Type === 'Video' ?
                                                    <>
                                                        {
                                                            dataMedia.Src.map((src, index) => (
                                                                <div className={styles.boxMedia} key={index}>
                                                                    <div className={styles.delete} onClick={() => handleDeleteMedia(src, "dataMedia")}>
                                                                        <TiDeleteOutline style={style} />
                                                                    </div>
                                                                    <video height='185' controls>
                                                                        <source src={src} type='video/mp4' />
                                                                    </video>
                                                                </div>
                                                            ))
                                                        }
                                                        {
                                                            newSrc && (
                                                                newSrc.map((src, index) => (
                                                                    <div className={styles.boxMedia} key={index}>
                                                                        <div className={styles.delete} onClick={() => handleDeleteMedia(src, "newSrc")}>
                                                                            <TiDeleteOutline style={style} />
                                                                        </div>
                                                                        <video height='185' controls>
                                                                            <source src={src} type='video/mp4' />
                                                                        </video>
                                                                    </div>
                                                                ))
                                                            )
                                                        }
                                                        {
                                                            files && (
                                                                files.map((file, index) => (
                                                                    <div className={styles.boxMedia} key={index}>
                                                                        <div className={styles.delete} onClick={() => handleDeleteFile(file.preview)}>
                                                                            <TiDeleteOutline style={style} />
                                                                        </div>
                                                                        <video height='185' controls>
                                                                            <source src={file.preview} type='video/mp4' />
                                                                        </video>
                                                                    </div>
                                                                ))
                                                            )
                                                        }
                                                    </> :
                                                    dataMedia.Type === 'Music' ?
                                                    <>
                                                        {
                                                            dataMedia.Src.map((src, index) => (
                                                                <div className={styles.boxMedia} key={index}>
                                                                    <div className={styles.delete} onClick={() => handleDeleteMedia(src, "dataMedia")}>
                                                                        <TiDeleteOutline style={style} />
                                                                    </div>
                                                                    <audio controls>
                                                                        <source src={src} type="audio/mpeg" />
                                                                    </audio>
                                                                </div>
                                                            ))
                                                        }
                                                        {
                                                            newSrc && (
                                                                newSrc.map((src, index) => (
                                                                    <div className={styles.boxMedia} key={index}>
                                                                        <div className={styles.delete} onClick={() => handleDeleteMedia(src, "newSrc")}>
                                                                            <TiDeleteOutline style={style} />
                                                                        </div>
                                                                        <audio controls>
                                                                            <source src={src} type="audio/mpeg" />
                                                                        </audio>
                                                                    </div>
                                                                ))
                                                            )
                                                        }
                                                        {
                                                            files && (
                                                                files.map((file, index) => (
                                                                    <div className={styles.boxMedia} key={index}>
                                                                        <div className={styles.delete} onClick={() => handleDeleteFile(file.preview)}>
                                                                            <TiDeleteOutline style={style} />
                                                                        </div>
                                                                        <audio controls>
                                                                            <source src={file.preview} type="audio/mpeg" />
                                                                        </audio>
                                                                    </div>
                                                                ))
                                                            )
                                                        }
                                                    </> : 
                                                    <></> 
                                                }
                                                    <progress value={progress} max="100" hidden />
                                                    {
                                                        !newSrc.length &&
                                                        <div className={styles.addition}>
                                                            <label htmlFor="file">
                                                                <IoMdAddCircleOutline style={styleAdd} onClick={handleAddMedia} className={styles.icon} />
                                                            </label>
                                                            <input id="file" type="file" onChange={handleChange} multiple className={styles.inputFile} />
                                                        </div>
                                                    }
                                                </div>
                                            ) : <></>
                                            }
                                        </> :
                                        <>
                                            <p className={styles.text}>{story.Content}</p>
                                            {story?.Media !== undefined ? (
                                                <div className={styles.media}>
                                                {
                                                    story?.Media?.Type === 'Image' ?
                                                    <>
                                                        {
                                                            story?.Media?.Src.map((src, index) => (
                                                                <div className={styles.boxMedia} key={index}>
                                                                    <img src={src} alt={story.Content} className={styles.image}/>
                                                                </div>
                                                            ))
                                                        }
                                                    </> :
                                                    story?.Media?.Type === 'Video' ?
                                                    <>
                                                        {
                                                            story?.Media?.Src.map((src, index) => (
                                                                <div className={styles.boxMedia} key={index}>
                                                                    <video height='185' controls>
                                                                        <source src={src} type='video/mp4' />
                                                                    </video>
                                                                </div>
                                                            ))
                                                        }
                                                    </> :
                                                    story?.Media?.Type === 'Music' ?
                                                    <>
                                                        {
                                                            story?.Media?.Src.map((src, index) => (
                                                                <div className={styles.boxMedia} key={index}>
                                                                    <audio controls>
                                                                        <source src={src} type="audio/mpeg" />
                                                                    </audio>
                                                                </div>
                                                            ))
                                                        }
                                                    </> : 
                                                    <></> 
                                                }
                                                </div>
                                            ) : <></>
                                            }
                                        </>
                                    }
                                    <div className={styles.listBtn}>
                                        <div className={styles.btn}>
                                            <Button edit disabled={disabled} handleClick={handleEdit}>{edit ? 'Update' : 'Edit'}</Button>
                                        </div>
                                        <div className={styles.btn}>
                                            <Button light handleClick={handleBack}>Back</Button>
                                        </div>
                                        <div className={styles.btn}>
                                            <Button drop handleClick={handleDelete}>Delete</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                </> :
                <></>
            }
        </>
    );
}

export default DetailStory;