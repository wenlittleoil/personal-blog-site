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
// import Board from './container/board';
// import User from './container/user';
const Board = lazy(() => import('./container/board'));
const User = lazy(() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(import('./container/user'));
    }, 5000);
  })
});

const routes = [
  {
    path: '/board',
    component: Board,
  },
  {
    path: '/user',
    component: User,
  }
];

function App() {

  return (
    <Router>
      <Suspense
        fallback={<div>loading......</div>}
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

export default App;
