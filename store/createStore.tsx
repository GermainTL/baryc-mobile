import { createStore, combineReducers } from 'redux';
import notificationReducer from './reducers/NotificationReducer.tsx'
import barsReducer from "./reducers/BarsReducer.tsx";

export default createStore(combineReducers({ notificationText: notificationReducer, bars: barsReducer }))