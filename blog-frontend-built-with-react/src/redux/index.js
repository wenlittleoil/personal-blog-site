import { createStore, applyMiddleware, } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import api from '../config/api';
import request from '../util/request';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk.withExtraArgument({ request, api, })),
);

export default store;
