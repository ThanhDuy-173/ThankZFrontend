import {GET_USER, LOGIN} from "../types"
import {getAllUsers_URL, login_URL, register_URL, updateUser_URL, resetUser_URL} from "../apis"

export const getAllUser = () => async dispatch =>{
    try {
        const user = JSON.parse(localStorage.getItem('userData'));
        // console.log('user action:', user, getAllUsers_URL);
        const result = await fetch(getAllUsers_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await result.json()
        if (result.status===200)
        {
            dispatch({
                type: GET_USER,
                payload: data
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const loginUser = (Email, Password, Type, setLoading) => async (dispatch) => {
  try{
    setLoading(true);
    const result = await fetch(login_URL,{
      method: 'POST',
      headers: 
      {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Email: Email,
        Password: Password,
        Type: Type,
      })
    });

    const data = await result.json();
    if (result.status===200) {
      dispatch({
        type: LOGIN,
        payload: data.data,
      });
    }
    setLoading(false);
    // localStorage.setItem('isLogin', true);
    localStorage.setItem('userData', JSON.stringify(data.data));
    return {status: result.status, data: data};
  }
  catch(err){
    setLoading(false);
    return err;
  }
}

export const getUser = (user) => async (dispatch) => {
    dispatch({
        type: GET_USER,
        payload: user,
    })
    return user;
}

export const registerUser = (user, type, setLoading) => async (dispatch) => {
      try {
        setLoading(true);
        const result = await fetch(register_URL, 
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  User: user,
                  Type: type,
                })
            }
        );
        const data = await result.json();
        console.log(data);
        setLoading(false);
        localStorage.setItem('userData', JSON.stringify(data.user));
        return {status: result.status, data: data};
      }
      catch(err){
        setLoading(false);
        return err;
      }
};

export const updateUser = (ID, Name, Avatar, Password, setLoading) => async dispatch =>{
    try {
        setLoading(true);
        const result = await fetch(updateUser_URL, 
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ID: ID,
                    Name: Name,
                    Avatar: Avatar,
                    Password: Password
                })
            }
        );
        const data = await result.json();
        localStorage.setItem('userData', JSON.stringify(data.data));
        setLoading(false);
        return {status: result.status, data: data};
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
}

export const resetUser = (Email, setLoading) => async dispatch =>{
    try {
        setLoading(true);
        const result = await fetch(resetUser_URL, 
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Email: Email
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