import React, {
  lazy,
  Suspense,
  useEffect,
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
import { getQuery, } from './util/url';

import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';
import { increase, decrease, } from './redux/actions/counter';
import { setUser, } from './redux/actions/global';
import store from './redux';

const Board = lazy(() => import('./container/board'));
const Login = lazy(() => import('./container/user/login'));

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
  setUser,
}) {
  const query = getQuery();

  useEffect(() => {
    setUser();
  }, []);

  if (initing) return <ModuleLoading />;

  return (
    <Router>
      {query.mode === 'redux-test' && (
        <div className="redux-test">
          <div>{num}</div>
          <div>
            <button onClick={increase}>add</button>
            <button onClick={decrease}>sub</button>
            <button onClick={() => store.dispatch({ type: 'INCREMENT'})}>add</button>
          </div>
        </div>
      )}
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
    setUser: bindActionCreators(setUser, dispatch),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
