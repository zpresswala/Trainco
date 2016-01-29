import AppDispatcher from '../dispatchers/AppDispatcher';
import ActionTypes from '../constants/Constants';
import { EventEmitter } from 'events';
import assign from 'object-assign';
import request from 'superagent';
const CHANGE_EVENT = 'change';

// Define the store as an empty array
let _store = {
  list: [],
  editing: false
};

/**
 * Define the public event listeners and getters that
 * the views will use to listen for changes and retrieve
 * the store
 */

class SearchStoreClass extends EventEmitter {

  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }


doASearch(courseSearch) {
$.ajax({
  type: 'POST',
  url: 'http://trainco-dev.imulus-client.com/api/seminars/search',
  dataType: 'application/json',
  data: JSON.stringify(courseSearch)
})

  }
  getList() {
    return _store;
  }
}

/**
 * Initialize the singleton to register with the
 * dispatcher and export for React components
 */
const SearchStore = new SearchStoreClass();

/**
 * Register each of the actions with the dispatcher
 * by changing the store's data and emitting a change
 */

AppDispatcher.register((payload) => {
  const action = payload.action;

  switch (action.actionType) {
    case ActionTypes.INIT_SEARCH:
/**
 *  Add the data defined in the Actions
 *  which the View will pass as a payload
 * @type {Boolean}
 */
    _store.editing = true;
    SearchStore.emit(CHANGE_EVENT);
    break;

    case ActionTypes.PERFORM_SEARCH:
  /**
   *  Add the data defined in the Actions
   *  which the View will pass as a payload
   * @type {Boolean}
   */
    _store.list.push(action.text);
    _store.editing = false;
    SearchStore.doASearch(action.courseSearch)
    SearchStore.emit(CHANGE_EVENT);
    break;

  default:
    return true;
  }
});

export default SearchStore;
