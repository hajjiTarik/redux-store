import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import reducer from '../Reducers';

export const defaultOptions = {
  preloadState: {},
  sagas: [],
};

export default class ConfigureStore {
  constructor({
    preloadedState = {},
    sagas = [],
  }) {
    this.promises = [];
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [
      sagaMiddleware,
    ];
    let composeEnhancers = compose;
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || composeEnhancers;
     
    }
    const enhancer = applyMiddleware(...middlewares);
    const store = createStore(
      reducer,
      preloadState,
      composeEnhancers(enhancer),
    );

    this.promises = (!(sagas instanceof Array) ? [sagas] : sagas)
      .map(saga => sagaMiddleware.run(saga).done);

    if (module.hot && process.env.NODE_ENV === 'development') {
      module.hot.accept('../Reducers', () => {
        store.replaceReducer(require('../Reducers')); // eslint-disable-line global-require
      });
    }

    Object.assign(this, store,
      {
        runSaga: sagaMiddleware.run,
      },
    );
  }

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
