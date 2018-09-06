import { createStore, combineReducers } from 'redux';

import * as user_actions from './redux/actions/user';
import * as user_fields_actions from './redux/actions/user_fields';

import { user } from './redux/reducers/user';
import { user_fields } from './redux/reducers/user_fields';


const All_Reducers = combineReducers({
  user,
  user_fields
});

/* --- */

export const store = createStore(All_Reducers);


// user actions
export function user_state_change(data) {
  store.dispatch(user_actions.user_state_change(data));
}


// user_field actions
export function user_field_added(data) {
  store.dispatch(user_fields_actions.user_field_added(data));
}

export function user_field_edited(data) {
  store.dispatch(user_fields_actions.user_field_edited(data));
}

export function user_field_deleted(data) {
  store.dispatch(user_fields_actions.user_field_deleted(data));
}
