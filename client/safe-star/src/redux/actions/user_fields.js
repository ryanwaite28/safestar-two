export const USER_FIELD_ADDED = "USER_FIELD_ADDED";
export const USER_FIELD_EDITED = "USER_FIELD_EDITED";
export const USER_FIELD_DELETED = "USER_FIELD_DELETED";

export function user_field_added(field) {
  return {
    type: USER_FIELD_ADDED,
    field
  }
}

export function user_field_edited(field) {
  return {
    type: USER_FIELD_EDITED,
    field
  }
}

export function user_field_deleted(field) {
  return {
    type: USER_FIELD_DELETED,
    field
  }
}
