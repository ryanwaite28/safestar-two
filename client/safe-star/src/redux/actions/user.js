export const USER_STATE_CHANGE = "USER_STATE_CHANGE";

export function user_state_change(data) {
  return {
    type: USER_STATE_CHANGE,
    data
  }
}
