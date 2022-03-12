
import {GET_STORY, GET_STORY_USER} from "../types"


const INIT_STATE = {
   stories: [],
};

function storyReducer(state = INIT_STATE, action) 
{
    switch (action.type) {
        case GET_STORY:
            return {
                ...state, 
                stories: action.payload,
            };
        case GET_STORY_USER:
            return {
                ...state, 
                stories: action.payload,
            };
        default: 
            return state;
    }
}



export default storyReducer;