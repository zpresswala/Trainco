import { Dispatcher } from 'flux';

const flux = new Dispatcher();

export function register(callback) {
  return flux.register(callback);
}

export function dispatch(actionType, action) {
  console.log(actionType);
  flux.dispatch(actionType, action);
}

// class DispatcherClass extends Dispatcher {
//
//   handleViewAction(action) {
//     this.dispatch({
//       source: 'VIEW_ACTION',
//       action: action,
//     });
//   }
//
//   handleServerAction(action) {
//     this.dispatch({
//       source: 'SERVER_ACTION',
//       action: action,
//     });
//   }
// }
//
// const AppDispatcher = new DispatcherClass();
//
// export default AppDispatcher;
