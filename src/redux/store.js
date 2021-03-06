import { createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { createLogger} from 'redux-logger';
import {reducer} from './reducers/index';
const middleware = [thunk]
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger())
}
export const Store = createStore(reducer, applyMiddleware(...middleware));      