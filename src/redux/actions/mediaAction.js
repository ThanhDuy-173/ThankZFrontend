import {GET_MEDIA, GET_MEDIA_USER} from "../types"
import {getAllMedia_URL, getAllMediaByUser_URL} from "../apis"

export const getAllMedia = () => async dispatch =>{
    try {
        const media = JSON.parse(localStorage.getItem('mediaData'));
        // console.log('media action', media, getAllMedia_URL);
        const result = await fetch(getAllMedia_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await result.json()
        if (result.status===200)
        {
            dispatch({
                type: GET_MEDIA,
                payload: data
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const getAllMediaByUser = (IDUser, setLoading) => async dispatch =>{
    try {
        setLoading(true);
        const media = JSON.parse(localStorage.getItem('mediaData'));
        // console.log('story action:', story, getAllStoriesByUser_URL);
        const result = await fetch(getAllMediaByUser_URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                IDUser: IDUser,
            })
        });
        const {mediaList} = await result.json()
        if (result.status===200)
        {
            dispatch({
                type: GET_MEDIA_USER,
                payload: mediaList
            })
        }
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
}