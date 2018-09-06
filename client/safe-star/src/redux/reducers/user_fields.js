import * as user_fields_actions from '../actions/user_fields';

export function user_fields(state = {}, action) {
  let new_state = Object.assign({}, state);
  switch(action.type) {
    case user_fields_actions.USER_FIELD_ADDED:
      new_state[action.field.unique_value] = action.field;
      return new_state;

    case user_fields_actions.USER_FIELD_EDITED:
      new_state[action.field.unique_value] = action.field;
      return new_state;

    case user_fields_actions.USER_FIELD_DELETED:
      if(new_state[action.field.unique_value]) {
        console.log('deleting...', new_state[action.field.unique_value]);
        delete new_state[action.field.unique_value];
      }
      return new_state;

    default:
      return new_state;
  }
}
