export default function barsReducer(
  state = null,
  action: Object,
): Object | null {
  let nextState;
  switch (action.type) {
    case 'UPDATE_BARS':
      return action.bars;
    default:
      return state;
  }
}
