import AppConstants from '../constants/Constants';
import { dispatch, register } from '../dispatchers/Dispatcher';
import request from 'superagent';

export default {
  addItem(item) {
    dispatch({
      actionType: AppConstants.ADD_ITEM, item
    })
  },
  removeItem(item) {
    dispatch({
      actionType: AppConstants.REMOVE_ITEM, item
    })
  },
  increaseItem(item) {
    dispatch({
      actionType: AppConstants.INCREASE_ITEM, item
    })
  },
  decreaseItem(item) {
    dispatch({
      actionType: AppConstants.DECREASE_ITEM, item
    })
  },
  doSearch(params) {
    dispatch({
      actionType: AppConstants.ACTION_PENDING, params
    });
    request.post('/api/url')
    //.send({ username: username, password: password })
    .send({ params: params })
    .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err) return console.error(err);

        console.log('ACTION_GET_SEARCH');
        Dispatcher.dispatch({
          actionType: AppConstants.ACTION_GET_SEARCH,
          response: res
        });
      });
  }
}
