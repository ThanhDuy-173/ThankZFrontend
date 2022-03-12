import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {AllUsers, AllStories, AllMedia, AllDiaries} from '../redux/selectors';
import {getAllUser} from '../redux/actions/userAction'
import {getAllStory} from '../redux/actions/storyAction'
import {getAllMedia} from '../redux/actions/mediaAction'
import {getAllDiary} from '../redux/actions/diaryAction'

function Data() {
  const dispatch = useDispatch();
  const users = useSelector(AllUsers);
  const stories = useSelector(AllStories);
  const media = useSelector(AllMedia);
  const diaries = useSelector(AllDiaries);
  const [dataUser, setDataUser] = useState([]);
  const [dataStory, setDataStory] = useState([]);
  const [dataMedia, setDataMedia] = useState([]);
  const [dataDiary, setDataDiary] = useState([]);
  useEffect(()=>{
        setDataUser(users);
        console.log('user',dataUser, users);
    },[users])
  useEffect(async ()=>{
        await dispatch(getAllUser())
    },[])
    useEffect(()=>{
        setDataStory(stories);
        console.log('story',dataStory, stories);
    },[stories])
  useEffect(async ()=>{
        await dispatch(getAllStory())
    },[])
    useEffect(()=>{
        setDataMedia(media);
        console.log('media',dataMedia, media);
    },[media])
  useEffect(async ()=>{
        await dispatch(getAllMedia())
    },[])
    useEffect(()=>{
        setDataDiary(diaries);
        console.log('diary',dataDiary, diaries);
    },[diaries])
  useEffect(async ()=>{
        await dispatch(getAllDiary())
    },[])
  return (
    <div className="App">
      <h1>Welcome ThankZ Project</h1>
      {dataDiary.map((story) => (
        <p key={story.ID}>Hi {story.Type}</p>
      ))}
    </div>
  );
}

export default Data;
