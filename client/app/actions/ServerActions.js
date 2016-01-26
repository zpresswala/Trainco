import { dispatch } from '../dispatchers/Dispatcher';
import AppDispatcher from '../dispatchers/AppDispatcher';
import ActionTypes from '../constants/Constants';

export default {
  receivedTweets(rawTweets) {
    dispatch({
      actionType: ActionTypes.RECEIVED_TWEETS,
      rawTweets
    })
  },
  receivedOneTweet(rawTweet){
    dispatch({
      actionType: ActionTypes.RECEIVED_ONE_TWEET,
      rawTweet
    })
  },
  receivedSearch(searchResults){
    dispatch({
      actionType: ActionTypes.RECEIVED_SEARCH_RESULTS,
      searchResults
    })
  },
  receiveSearch(response) {
    AppDispatcher.handleServerAction({
      actionType: ActionTypes.RECEIVE_SEARCH_RESULTS,
      response: response
    });
  }

}
