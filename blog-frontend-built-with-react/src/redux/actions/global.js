export const setIniting = () => {
  return {
    type: 'SET_INITING',
  }
}

export const setUser = user => {
  if (user) {
    return {
      type: 'SET_USER',
      logined: true,
      user,
    }
  }
  return {
    type: 'SET_USER',
    logined: false,
    user: null,
  } 
}
