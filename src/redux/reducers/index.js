import { combineReducers } from 'redux';
import userReducer from './userReducer'
import storyReducer from './storyReducer'
import mediaReducer from './mediaReducer'
import diaryReducer from './diaryReducer'


export const reducer = combineReducers({userReducer, storyReducer, mediaReducer, diaryReducer});