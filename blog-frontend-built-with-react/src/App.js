import React, {
  lazy,
  Suspense,
} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  withRouter,
  useHistory,
  useLocation,
} from "react-router-dom";
import ModuleLoading from './component/base/ModuleLoading';

import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';
import { increase, decrease, } from './redux/actions/counter';
import store from './redux';

const Board = lazy(() => import('./container/board'));
const Login = lazy(() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(import('./container/user/login'));
    }, 5000);
  })
});

const routes = [
  {
    path: '/board',
    component: Board,
  },
  {
    path: '/user/login',
    component: Login,
  },
];

function App({
  initing,
  num,
  increase,
  decrease,
}) {
  return (
    <Router>
      {/* <div className="redux-test">
        <div>{num}</div>
        <div>
          <button onClick={increase}>add</button>
          <button onClick={decrease}>sub</button>
          <button onClick={() => store.dispatch({ type: 'INCREMENT'})}>add</button>
        </div>
      </div> */}
      <Suspense
        fallback={<ModuleLoading />}
      >
        <Switch>
          {routes.map(item => {
            return (
              <Route 
                key={item.path}
                path={item.path}
                component={item.component}
              >
              </Route>    
            );
          })}
        </Switch>
      </Suspense>
    </Router>
  );
}

const mapStateToProps = state => {
  console.log('state: ', state)
  return {
    num: state.counter,
    initing: state.global.initing,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    increase: () => dispatch(increase()),
    decrease: bindActionCreators(decrease, dispatch),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
