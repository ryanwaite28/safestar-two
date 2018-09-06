import * as user_actions from '../actions/user';

export function user(state = {}, action) {
  switch(action.type) {
    case user_actions.USER_STATE_CHANGE:
      return action.data;

    default:
      return state;
  }
}
