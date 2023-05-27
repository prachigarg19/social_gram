//create actions
// Create action functions that update the login state type and set useful info
export const LoginStart = () => ({
  type: "LOGIN_START",
});

export const LoginSuccess = ({ userCredentials }) => ({
  type: "LOGIN_SUCCESSFUL",
  payload: userCredentials,
});

export const LoginFailure = ({ error }) => ({
  type: "LOGIN_ERROR",
  payload: error,
});
export const Follow = (userId) => ({
  type: "FOLLOW",
  payload: userId,
});

export const Unfollow = (userId) => ({
  type: "UNFOLLOW",
  payload: userId,
});
