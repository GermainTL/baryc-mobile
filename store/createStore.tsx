import { createStore } from 'redux';
import displayNotification from './NotificationReducer.tsx'

export default createStore(displayNotification)