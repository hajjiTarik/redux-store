# Redux Custom Store
Redux custom store is a redux store with additional features (redux-saga, devTools)...

### Usage :

#### 1 - add class Store :

```js
import Store from './path/to/Store';
```
#### 2 - instanciate the store with params :
The store takes an initial state and a sagas list, and it fork all sagas passed in parametre.


`PS` : Normally we must pass to the store only the sagas of initialisations, if one has sagas specific to a domain is better passed by an HOC saga, here an example in the same repository [Redux SAGA HOC](https://www.npmjs.com/package/redux-saga-hoc)


```js

const preloadState = {
  // initial state
};
const sagas = [initSaga_1, initSaga_2]; // initial sagas
const store = new Store({preloadState , sagas});
```

#### 3 - SSR :
For Server Side rendering you can use `dispatchInitActions` :

```js
const actions = [initAction_1(), init_Action2_() ...];
Store.dispatchInitActions(actions).then (() => {
 // put your render here
});
```
