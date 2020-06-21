const initialState = {
  initing: true,
  logined: false,
  user: null,
}

export default global = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_INITING':
      return {
        ...state,
        initing: false,
      };
    case 'SET_USER': {
      return {
        ...state,
        logined: action.logined,
        user: action.user,
      }
    }
    default:
      return state;
  }
}