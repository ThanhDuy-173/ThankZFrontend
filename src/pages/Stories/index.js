import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { AiOutlineFileAdd } from 'react-icons/ai';
import { BsArrowDownCircle, BsArrowUpCircle, BsArrowUpCircleFill, BsArrowDownCircleFill } from 'react-icons/bs';
import TextField from '@material-ui/core/TextField';
import { AllStories } from '../../redux/selectors';
import {getAllStoryByUser} from '../../redux/actions/storyAction';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import clsx from 'clsx';
import styles from './Stories.module.scss';
// Link to={`/stories/abc`}
// story?.Media?.Type === 'Video' ? 
// <video width='200' height='200' controls>
//     <source src={story?.Media?.Src[0]} type='video/mp4' />
// </video> :
// <audio controls>
//     <source src={story?.Media?.Src[0]} type="audio/mpeg" />
// </audio>
function Stories() {
    const dispatch = useDispatch();
    const stories = useSelector(AllStories);
    const [dataStory, setDataStory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idUser, setIDUser] = useState(() => {
        const data = localStorage.getItem('userData');
        const user = JSON.parse(data);
        if(user !== null) return user.ID;
        return "0";
    });
    // useEffect(() => {
    //     if (performance.navigation.type === 1) {
    //         window.location.href='/';
    //     }
    // });
    useEffect(()=>{
        // setDataStory(stories);
        setDataStory(stories.sort((a,b) => b.ID - a.ID));
        // if(stories.length === 0) 
        //     setLoading(true);
        // else 
        //     setLoading(false);
    },[stories]);
    useEffect(async ()=>{
        const res = await dispatch(getAllStoryByUser(idUser, setLoading));
    },[]);
    const [min, setMin] = useState(() => {
        if(window.innerWidth*0.16 <= 100) return true;
        return false;
    });
    const [minWidth, setMinWidth] = useState(() => {
        if(window.innerWidth <= 990) return true;
        return false;
    });
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
    // console.log(minWidth, window.innerWidth);
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
    const handleCS = useCallback(() => {
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
        setDataStory(dataStory.sort((a,b) => b.ID - a.ID));
    }
    const handleDESC = () => {
        setIconSort({
            ASC: false,
            DESC: true
        })
        setDataStory(dataStory.sort((a,b) => a.ID - b.ID));
    }
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
        let newData = stories.filter(story => {
            return story.Date === date
        })
        if(sortDate) {
            setDataStory(newData);
        } else {
            if(iconSort.ASC){
                setDataStory(stories.sort((a,b) => b.ID - a.ID));
            } else {
                setDataStory(stories.sort((a,b) => a.ID - b.ID));
            }
        }
    }, [date, sortDate, stories, iconSort]);
    //get current date-time
    // const Today = new Date().toLocaleString() + "";
    // const currentDate = Today.split(", ");
    // const day = currentDate[1];
    // const time = date[0];
    // const cm = "17/03/2000";
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
                    Stories Diary
                </span>
                <div className={styles.create}>
                    <Link to="/createStory">
                        <Button create handleClick={handleCS}>
                            {
                                min ? 
                                <AiOutlineFileAdd style={styleMin} /> :
                                <AiOutlineFileAdd style={style} />
                            }
                        </Button>
                    </Link>
                </div>
                {
                    !stories.length ?
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
                            {dataStory.map((story) => (
                                <div key={story.ID} className={styles.story}>
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
                                    <p className={styles.text}>{story.Content}</p>
                                    {story?.Media !== undefined ? (
                                        <div className={styles.media}>
                                        {
                                            story?.Media?.Type === 'Image' ?
                                            <div className={styles.img}>
                                                <img src={ story?.Media?.Src[0]} alt={story.Content} className={styles.image}/>
                                            </div> :
                                            story?.Media?.Type === 'Video' ?
                                            <video height='185' controls>
                                                <source src={story?.Media?.Src[0]} type='video/mp4' />
                                            </video> :
                                            story?.Media?.Type === 'Music' ?
                                            <audio controls>
                                                <source src={story?.Media?.Src[0]} type="audio/mpeg" />
                                            </audio> : 
                                            <></> 
                                        }
                                        {
                                            story?.Media?.Src?.length > 1 ?
                                            <div className={styles.addition}>
                                                <p>+{story?.Media?.Src?.length - 1}</p>
                                            </div> :
                                            <></>
                                        }
                                        </div>
                                    ) : <></>
                                    }
                                    <Link to={`/stories/${story.ID}`}>See more</Link>
                                </div>
                            ))}
                        </div>
                </>
                }
            </div>
        </>
    );
}

export default Stories;