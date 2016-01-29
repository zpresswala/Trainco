import ServerActions from './actions/ServerActions'

export default {
  getAllTweets() {
    $.get('/tweets')
    .success(rawTweets => ServerActions.receivedTweets(rawTweets))
    .error(error => console.log(error));
  },
  createTweet(body){
    $.post('/tweets', { tweet: body })
    .success(rawTweet => ServerActions.receivedOneTweet(rawTweet))
    .error(error => console.log(error));
  },
  makeSearch(location, classTopics) {
    $.post('/api/url/here', { location: location, classTopics: classTopics })
    .success(searchResults => ServerActions.receivedSearch(searchResults))
    .error(error => console.log(error));
  }
}
