import request from 'superagent';

export function performSearch() {
  request.post('http://')
  .set('Accept', 'application/json')
  .end((err, response) => {
    if (err) return console.error(err);
      //ACTIONFROMACTION(response.body);
    });
}
