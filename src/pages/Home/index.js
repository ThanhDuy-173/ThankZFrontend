import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Link } from "react-router-dom";
import { AiOutlineFileAdd } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import { BsArrowDownCircle, BsArrowUpCircle, BsArrowUpCircleFill, BsArrowDownCircleFill } from 'react-icons/bs';
import TextField from '@material-ui/core/TextField';
import { AllDiaries } from '../../redux/selectors';
import {getAllDiaryByUser} from '../../redux/actions/diaryAction';
import {getAllMediaByUser} from '../../redux/actions/mediaAction';
import {getAllStoryByUser} from '../../redux/actions/storyAction';
import {getUser} from '../../redux/actions/userAction';
import styles from './Home.module.scss';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
//className={clsx(styles.btn, styles.active)}
//className={`${styles.btn} ${styles.active}`}
//className={clsx(styles.btn, {
//     [styles.active]: false
// })}
// const classes = clsx(styles.btn, 'd-flex' ,{
//     [styles.primary] = primary,
//     'd-flex2': true
// })
function Home() {
    const dispatch = useDispatch();
    const diaries = useSelector(AllDiaries);
    // const media = useSelector(AllMedia);
    // const stories = useSelector(AllStories);
    // const user = useSelector(AllUsers);
    const [dataDiary, setDataDiary] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idUser, setIDUser] = useState(() => {
        const data = localStorage.getItem('userData');
        const user = JSON.parse(data);
        if(user !== null) return user.ID;
        return "0";
    });
    const [min, setMin] = useState(() => {
        if(window.innerWidth*0.16 <= 100) return true;
        return false;
    });
    const [minWidth, setMinWidth] = useState(() => {
        if(window.innerWidth <= 990) return true;
        return false;
    });
    useEffect(() => {
        const data = localStorage.getItem('userData');
        const user = JSON.parse(data);
        if(user === null) 
            window.location.href='/login';
    })
    useEffect(()=>{
        // setDataStory(stories);
        setDataDiary(diaries.sort((a,b) => b.ID - a.ID));
        // if(diaries.length === 0) 
        //     setLoading(true);
        // else 
        //     setLoading(false);
    },[diaries]);
    useEffect(async ()=>{
        // console.log("run");
        const res = await dispatch(getAllDiaryByUser(idUser, setLoading));
    },[]);
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
    const handleCS = useCallback(() => {
        const uri = window.location.pathname;
        const arrUri = uri.split("/");
        localStorage.setItem('URLCreate', arrUri[1]);
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
        setDataDiary(dataDiary.sort((a,b) => b.ID - a.ID));
    }
    const handleDESC = () => {
        setIconSort({
            ASC: false,
            DESC: true
        })
        setDataDiary(dataDiary.sort((a,b) => a.ID - b.ID));
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
        let newData = diaries.filter(diary => {
            return diary.Date === date
        })
        if(sortDate) {
            setDataDiary(newData);
        } else {
            if(iconSort.ASC){
                setDataDiary(diaries.sort((a,b) => b.ID - a.ID));
            } else {
                setDataDiary(diaries.sort((a,b) => a.ID - b.ID));
            }
        }
    }, [date, sortDate, diaries, iconSort]);
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
                    className={clsx(styles.bigTitle, {
                        [styles.titleNormal]: !minWidth,
                        [styles.titleMin]: minWidth
                    })}
                >
                    Diary
                </span>
                <div 
                    className={clsx(styles.create, {
                        [styles.createMin]: minWidth,
                        [styles.createNormal]: !minWidth
                    })}
                >
                    <Link to="/createStory">
                        <Button create handleClick={handleCS}>
                            {
                                min ? 
                                <AiOutlineFileAdd style={styleMin} /> :
                                <AiOutlineFileAdd style={style} />
                            }
                        </Button>
                    </Link>
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
                    !diaries.length ? 
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
                            {dataDiary.map(diary => (
                                <div key={diary.ID} className={styles.diary}>
                                    <div 
                                        className={clsx(styles.times, {
                                            [styles.timesNormal]: !minWidth,
                                            [styles.timesMin]: minWidth
                                        })}
                                    >
                                        {diary.Date === dayTime.day ? <p>Today</p> : <p>{diary.Date}</p>}
                                        <p>{diary.Content.Time}</p>
                                    </div>
                                    <p className={styles.name}>{diary.UserName}</p>
                                    {
                                        diary.Type === 'story' ?
                                        <>
                                            <p className={styles.text}>{diary.Content.Content}</p>
                                            {diary?.Content?.Media !== undefined ? (
                                                <div className={styles.mediaStory}>
                                                {
                                                    diary?.Content?.Media?.Type === 'Image' ?
                                                    <div className={styles.img}>
                                                        <img src={ diary?.Content?.Media?.Src[0]} alt={diary?.Content.Content} className={styles.image}/>
                                                    </div> :
                                                    diary?.Content?.Media?.Type === 'Video' ?
                                                    <video height='185' controls>
                                                        <source src={diary?.Content?.Media?.Src[0]} type='video/mp4' />
                                                    </video> :
                                                    diary?.Content?.Media?.Type === 'Music' ?
                                                    <audio controls>
                                                        <source src={diary?.Content?.Media?.Src[0]} type="audio/mpeg" />
                                                    </audio> : 
                                                    <></> 
                                                }
                                                {
                                                    diary?.Content?.Media?.Src?.length > 1 ?
                                                    <div className={styles.addition}>
                                                        <p>+{diary?.Content?.Media?.Src?.length - 1}</p>
                                                    </div> :
                                                    <></>
                                                }
                                                </div>
                                            ) : <></>
                                            }
                                            <Link to={`/stories/${diary.Content.ID}`}>See more</Link>
                                        </> :
                                        diary.Type === 'media' ?
                                        <>
                                            <div className={styles.media}>
                                            {
                                                diary.Content.Type === 'Image' ? 
                                                diary.Content.Src.map(img => (
                                                    <img key={img} src={img} alt="Diary" className={styles.item}/>
                                                )) :
                                                diary.Content.Type === 'Video' ?
                                                diary.Content.Src.map(video => (
                                                    <video height='200' controls key={video} className={styles.item}>
                                                        <source src={video} type='video/mp4' />
                                                    </video>
                                                )) :
                                                diary.Content.Type === 'Music' ?
                                                diary.Content.Src.map(music => (
                                                    <audio controls key={music} className={styles.item}>
                                                        <source src={music} type="audio/mpeg" />
                                                    </audio>
                                                )) :
                                                <></>
                                            }
                                            </div>
                                            <Link to={`/media/${diary.Content.ID}`}>See more</Link>
                                        </> :
                                        <></>
                                    }
                                </div>
                            ))}
                        </div>
                    </> 
                }
            </div>
        </>
    );
}

export default Home;