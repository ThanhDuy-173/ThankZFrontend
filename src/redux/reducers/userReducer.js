
import {GET_USER, LOGIN} from "../types"


const INIT_STATE = {
    user: {
        ID: null,
        Name: null,
        Email: null,
        DoB: null,
        Avatar: null,
        Type: null,
    },
};

function userReducer(state = INIT_STATE, action) 
{
    switch (action.type) {
        case GET_USER:
            return {
                ...state, 
                user: {
                    ID: action.payload.ID,
                    Name: action.payload.Name,
                    Email: action.payload.Email,
                    DoB: action.payload.DoB,
                    Avatar: action.payload.Avatar,
                    Type: action.payload.Type
                },
            };
        case LOGIN:
            return {
                ...state,
                user: {
                    ID: action.payload.ID,
                    Name: action.payload.Name,
                    Email: action.payload.Email,
                    DoB: action.payload.DoB,
                    Avatar: action.payload.Avatar,
                    Type: action.payload.Type
                },
            };
        default: 
            return state;
    }
}



export default userReducer;