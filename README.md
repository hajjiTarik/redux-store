# Redux Custom Store
### Redux custom store is a redux store with additional features (redux-saga, devTools)...

### Usage :

#### 1 - add class Store :

```js
import Store from './path/to/Store';
```
#### 2 - instanciate the store with params :

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
