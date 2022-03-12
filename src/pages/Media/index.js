import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { BiImageAdd } from 'react-icons/bi';
import { BsArrowDownCircle, BsArrowUpCircle, BsArrowUpCircleFill, BsArrowDownCircleFill } from 'react-icons/bs';
import TextField from '@material-ui/core/TextField';
import { AllMedia } from '../../redux/selectors';
import {getAllMediaByUser} from '../../redux/actions/mediaAction';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import clsx from 'clsx';
import styles from './Media.module.scss';
function Media() {
    const dispatch = useDispatch();
    const media = useSelector(AllMedia);
    const [dataMedia, setDataMedia] = useState([]);
    const [idUser, setIDUser] = useState(() => {
        const data = localStorage.getItem('userData');
        const user = JSON.parse(data);
        if(user !== null) return user.ID;
        return "0";
    });
    const [loading, setLoading] = useState(false);
    const [min, setMin] = useState(() => {
        if(window.innerWidth*0.16 <= 100) return true;
        return false;
    });
    const [minWidth, setMinWidth] = useState(() => {
        if(window.innerWidth <= 990) return true;
        return false;
    });
    useEffect(()=>{
        // setDataStory(stories);
        setDataMedia(media.sort((a,b) => b.ID - a.ID));
        // if(media.length === 0) 
        //     setLoading(true);
        // else 
        //     setLoading(false);
    },[media]);
    useEffect(async ()=>{
        const res = await dispatch(getAllMediaByUser(idUser, setLoading));
    },[]);
    const style = { color: "#FBFF20", fontSize: "30px" };
    const styleMin = { color: "#FBFF20", fontSize: "20px" };
    const styleSort = { color: "#FF6D1F", fontSize: "30px" };
    const styleSortSelected = { color: "#FF1F43", fontSize: "30px" };
    useEffect(() => {
        const handleResize = () => {
            setMin(window.innerWidth*0.16 <= 100);
            setMinWidth(window.innerWidth <= 990);
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);
    const handleCM = useCallback(() => {
        const uri = window.location.pathname;
        const arrUri = uri.split("/");
        localStorage.setItem('URLCreate', arrUri[1]);
    }, []);
    const [iconSort, setIconSort] = useState({
        ASC: true,
        DESC: false
    });
    const handleASC = () => {
        setIconSort({
            ASC: true,
            DESC: false
        });
        setDataMedia(dataMedia.sort((a,b) => b.ID - a.ID));
    }
    const handleDESC = () => {
        setIconSort({
            ASC: false,
            DESC: true
        })
        setDataMedia(dataMedia.sort((a,b) => a.ID - b.ID));
    }
    const [dayTime, setDayTime] = useState({
        day: "",
        time: ""
    });
    const [dateDefaults, setDateDefaults] = useState(() => {
        const Today = new Date().toLocaleString() + "";
        const currentDate = Today.split(", ");
        const dateArr = currentDate[1].split("/");
        if(dateArr[1].length === 1) dateArr[1] = "0" + dateArr[1];
        if(dateArr[0].length === 1) dateArr[0] = "0" + dateArr[0];
        setDayTime({
            day: dateArr[0] + "/" + dateArr[1] + "/" + dateArr[2],
            time: currentDate[0]
        });
        return dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
    });
    const [date, setDate] = useState("");
    const [sortDate, setSortDate] = useState(false);
    const handleChangeDate = (e) => {
        let dCur = e.target.value;
        let dArr = dCur.split("-");
        let dSort = dArr[2] + "/" + dArr[1] + "/" + dArr[0];
        setDate(dSort);
    }
    const handleSortDate = () => {
        setSortDate(!sortDate);
    }
    useEffect(() => {
        let newData = media.filter(item => {
            return item.Date === date
        })
        if(sortDate) {
            setDataMedia(newData);
        } else {
            if(iconSort.ASC){
                setDataMedia(media.sort((a,b) => b.ID - a.ID));
            } else {
                setDataMedia(media.sort((a,b) => a.ID - b.ID));
            }
        }
    }, [date, sortDate, media, iconSort]);
    if(loading) return (
        <>
            <Loading />
        </>
    );
    return (
        <>
            <div 
                className={clsx(styles.container,{
                    [styles.containerNormal]: minWidth
                })}
            >
                <span  
                    className={clsx(styles.bigTitle, styles.titleNormal)}
                >
                    Media Diary
                </span>
                <div className={styles.create}>
                    <Link to="/createMedia">
                        <Button create handleClick={handleCM}>
                            {
                                min ? 
                                <BiImageAdd style={styleMin} /> :
                                <BiImageAdd style={style} />
                            }
                        </Button>
                    </Link>
                </div>
                {
                    !media.length ?
                    (
                        <p>No data</p>
                    ) :
                    <>
                        <div 
                            className={clsx(styles.sort, {
                                [styles.sortNormal]: !min
                            })}
                        >
                            <div className={styles.date}>
                                <span><b>Date </b></span>
                                <TextField
                                        className={styles.datePicker}
                                        id="date"
                                        label=""
                                        type="date"
                                        defaultValue={dateDefaults}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleChangeDate}
                                    />
                                <button 
                                    onClick={handleSortDate} 
                                    className={styles.btnSort}
                                >
                                    {sortDate ? <b>UnSort</b> : <b>Sort</b>}
                                </button>
                            </div>
                            <div className={styles.sortID}>
                                <span><b>Sort </b></span>
                                <div className={styles.icon} onClick={handleASC}>
                                    {
                                        iconSort.ASC ? 
                                        <BsArrowUpCircleFill style={styleSortSelected} /> :
                                        <BsArrowUpCircle style={styleSort} />
                                    }
                                </div>
                                <div className={styles.icon} onClick={handleDESC}>
                                    {
                                        iconSort.DESC ?
                                        <BsArrowDownCircleFill style={styleSortSelected} /> :
                                        <BsArrowDownCircle style={styleSort} />
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={styles.content}>
                            {dataMedia.map(media => (
                                <div key={media.ID} className={styles.mediaContent}>
                                    <div 
                                        className={clsx(styles.times, {
                                            [styles.timesNormal]: !minWidth,
                                            [styles.timesMin]: minWidth
                                        })}
                                    >
                                        {media.Date === dayTime.day ? <p>Today</p> : <p>{media.Date}</p>}
                                        <p>{media.Time}</p>
                                    </div>
                                    <p className={styles.name}>{media.UserName}</p>
                                    <div className={styles.media}>
                                    {
                                        media.Type === 'Image' ? 
                                        media.Src.map(img => (
                                            <img key={img} src={img} alt="Diary" className={styles.item}/>
                                        )) :
                                        media.Type === 'Video' ?
                                        media.Src.map(video => (
                                            <video height='200' controls key={video} className={styles.item}>
                                                <source src={video} type='video/mp4' />
                                            </video>
                                        )) :
                                        media.Type === 'Music' ?
                                        media.Src.map(music => (
                                            <audio controls key={music} className={styles.item}>
                                                <source src={music} type="audio/mpeg" />
                                            </audio>
                                        )) :
                                        <></>
                                    }
                                    </div>
                                    <Link to={`/media/${media.ID}`}>See more</Link>
                                </div>
                            ))}
                        </div>
                </>
                }
            </div>
        </>
    );
}

export default Media;