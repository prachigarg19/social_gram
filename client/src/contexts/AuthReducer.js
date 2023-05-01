//create reducers
//Create a reducer function to handle changes to the login state.
//The reducer function takes two arguments:
//the current state and an action object that describes the state change.

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { user: null, isFetching: true, error: false };
    case "LOGIN_SUCCESSFUL":
      return { user: action.payload, isFetching: false, error: false };
    case "LOGIN_ERROR":
      return { user: null, isFetching: false, error: action.payload };
    default:
      return state;
  }
};

export default AuthReducer;
