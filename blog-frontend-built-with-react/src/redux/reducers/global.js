const initialState = {
  initing: true,
  logined: false,
  user: null,
}

export default global = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_USER': {
      return {
        ...state,
        initing: false,
        logined: action.logined,
        user: action.user,
      }
    }
    default:
      return state;
  }
}