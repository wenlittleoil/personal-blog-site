
export const setUser = user => {
  return async (dispatch, getState, { request, api, }) => {
    const { data } = await request.get({
      url: api.userInfoApi,
    });
    if (data.login_status) {
      dispatch({
        type: 'SET_USER',
        logined: true,
        user: data.user,
      });
    } else {
      dispatch({
        type: 'SET_USER',
        logined: false,
        user: null,
      });
    }
  }
}
