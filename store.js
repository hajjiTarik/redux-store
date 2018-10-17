import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import reducer from '../Reducers';

export default class ConfigureStore {
  constructor(
    preloadState = {},
    sagas = [],
  ) {
      // to load initial sagas
    this.promises = [];
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [
      sagaMiddleware,
    ];
    let composeEnhancers = compose;
      // when the store will be instantiated in the server, 
      // you must be sure that the window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      // will not crash the application
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || composeEnhancers;
    }
    const enhancer = applyMiddleware(...middlewares);
      
      // create store
    const store = createStore(
      reducer,
      preloadState,
      composeEnhancers(enhancer),
    );
    
      // run the sagas sequentially and map it with the 'this.promises'
    this.promises = (!(sagas instanceof Array) ? [sagas] : sagas)
      .map(saga => sagaMiddleware.run(saga).done);
    
    this.hmrReducers();
    
      // create new store with redux store and the functions we want to expose
    this = {...this, store,
        {
          runSaga: sagaMiddleware.run,
        },
       };
  }

  hmrReducers = () => {
    if (module.hot && process.env.NODE_ENV === 'development') {
      module.hot.accept('../Reducers', () => {
        this.replaceReducer(require('../Reducers')); // eslint-disable-line global-require
      });
    }
  }
  
  // when receive SAGA INIT ACTION (redux action)
  // we make sur that all actions are dispatched
  // after that we stop the loop with ( END )
  // and we resolve all promises
  initActions = actions => new Promise((resolve, reject) => {
    actions.forEach((action) => {
      this.dispatch(action);
    });
    this.dispatch(END);
    Promise.all(this.promises).then(() => {
      resolve();
    }).catch(() => {
      reject();
    });
  });
}
