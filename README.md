# ![alt tag](http://i.imgur.com/svWYrBY.png)
# Redux Store
Redux custom store is a redux store with additional features (redux-saga, devTools)...

## Usage :

### Add class Store :

```js
import ConfigureStore from './path/to/ConfigureStore';
```
### Instanciate the store with params :
The store takes an initial state and a sagas list, and it fork all sagas passed in parametre.


`PS` : Normally we must pass to the store only the sagas of initialisations, if one has sagas specific to a domain is better passed by an HOC saga, here an example in the same repository [Redux SAGA HOC](https://www.npmjs.com/package/redux-saga-hoc)


```js

const preloadState = {
  // initial state
};
const sagas = [initSaga_1, initSaga_2]; // initial sagas
const store = new ConfigureStore({preloadState , sagas});
```

### SSR :
For Server Side rendering you can use `initActions` :

```js
function indexClient(context) {
  return new Promise((resolve, reject) => {
    try {
      config.update(context.config);
      const appComponent = require('../app/appComponent').default;
      
      const sagas = [initSaga_1, initSaga_2]; // will run in SSR
      const actions = [initAction_1(), init_Action2_() ...];
      const store = new Store(sagas);

      store.initActions(actions).then (() => {
         const element = (
            <Provider store={store}>
              <appComponent />
            </Provider>
          )
          resolve({
            element,
            state: store.getSate(),
          });
          
      }).catch((err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}

```
