const initialState = { notificationText: null }

export default function displayNotification(state = initialState, action: Object): Object {
    let nextState
    switch (action.type) {
        case 'DISPLAY_NOTIFICATION':
            nextState =  {
                notificationText: action.notificationText
            }
            return nextState || state
        default:
            return state
    }
}