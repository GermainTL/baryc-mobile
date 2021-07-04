export default function notificationReducer(state = null, action: Object): Object|null {
    switch (action.type) {
        case 'DISPLAY_NOTIFICATION':
            return action.notificationText
        default:
            return state
    }
}