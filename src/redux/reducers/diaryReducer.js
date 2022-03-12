
import {GET_DIARY, GET_DIARY_USER} from "../types"


const INIT_STATE = {
   diaries: [],
};

function diaryReducer(state = INIT_STATE, action) 
{
    switch (action.type) {
        case GET_DIARY:
            return {
                ...state, 
                diaries: action.payload,
            };
        case GET_DIARY_USER:
            return {
                ...state, 
                diaries: action.payload,
            };
        default: 
            return state;
    }
}



export default diaryReducer;