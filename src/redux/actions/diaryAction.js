import {GET_DIARY, GET_DIARY_USER} from "../types"
import {getAllDiaries_URL, getAllDiariesByUser_URL, addDiary_URL, updateDiary_URL, deleteDiary_URL} from "../apis"

export const getAllDiary = () => async dispatch =>{
    try {
        const diary = JSON.parse(localStorage.getItem('diaryData'));
        // console.log('diary action', diary, getAllDiaries_URL);
        const result = await fetch(getAllDiaries_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await result.json()
        if (result.status===200)
        {
            dispatch({
                type: GET_DIARY,
                payload: data
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const getAllDiaryByUser = (IDUser, setLoading) => async dispatch =>{
    try {
        setLoading(true);
        const diary = JSON.parse(localStorage.getItem('diaryData'));
        // console.log('story action:', story, getAllStoriesByUser_URL);
        const result = await fetch(getAllDiariesByUser_URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                IDUser: IDUser,
            })
        });
        const {diariesList} = await result.json()
        if (result.status===200)
        {
            dispatch({
                type: GET_DIARY_USER,
                payload: diariesList
            })
        }
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
}

export const addDiary = (newStory, newMedia, typeUpload, setLoading) => async dispatch =>{
    try {
        setLoading(true);
        const result = await fetch(addDiary_URL, 
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Story: newStory,
                    Media: newMedia,
                    Type: typeUpload,
                })
            }
        );
        const data = await result.json();
        setLoading(false);
        return {status: result.status, data: data};
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
}

export const updateDiary = (idUser, idDiary, newContent, newMedia, typeUpdate, setLoading) => async dispatch =>{
    try {
        // setLoading(true);
        // console.log({idDiary, newContent, newMedia, typeUpdate})
        // setLoading(false);
        // return 0;
        const result = await fetch(updateDiary_URL, 
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    IDUser: idUser,
                    IDDiary: idDiary,
                    Content: newContent,
                    Media: newMedia,
                    Type: typeUpdate
                })
            }
        );
        const data = await result.json();
        setLoading(false);
        return {status: result.status, data: data};
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
}

export const deleteDiary = (idUser, idDiary, type, setLoading) => async dispatch =>{
    try {
        // setLoading(true);
        // console.log({idDiary, newContent, newMedia, typeUpdate})
        // setLoading(false);
        // return 0;
        const result = await fetch(deleteDiary_URL, 
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    IDUser: idUser,
                    IDDiary: idDiary,
                    Type: type
                })
            }
        );
        const data = await result.json();
        setLoading(false);
        return {status: result.status, data: data};
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
}