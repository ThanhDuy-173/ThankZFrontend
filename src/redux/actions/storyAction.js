import {GET_STORY, GET_STORY_USER} from "../types"
import {getAllStories_URL, getAllStoriesByUser_URL} from "../apis"

export const getAllStory = () => async dispatch =>{
    try {
        const story = JSON.parse(localStorage.getItem('storyData'));
        // console.log('story action:', story, getAllStories_URL);
        const result = await fetch(getAllStories_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await result.json()
        if (result.status===200)
        {
            dispatch({
                type: GET_STORY,
                payload: data
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const getAllStoryByUser = (IDUser, setLoading) => async dispatch =>{
    try {
        setLoading(true);
        const story = JSON.parse(localStorage.getItem('storyData'));
        // console.log('story action:', story, getAllStoriesByUser_URL);
        const result = await fetch(getAllStoriesByUser_URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                IDUser: IDUser,
            })
        });
        const {storiesList} = await result.json()
        if (result.status===200)
        {
            dispatch({
                type: GET_STORY_USER,
                payload: storiesList
            })
        }
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
}