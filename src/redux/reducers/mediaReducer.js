
import {GET_MEDIA, GET_MEDIA_USER} from "../types"


const INIT_STATE = {
   media: [],
};

function mediaReducer(state = INIT_STATE, action) 
{
    switch (action.type) {
        case GET_MEDIA:
            return {
                ...state, 
                media: action.payload,
            };
        case GET_MEDIA_USER:
            return {
                ...state, 
                media: action.payload,
            };
        default: 
            return state;
    }
}



export default mediaReducer;