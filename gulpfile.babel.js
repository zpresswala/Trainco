import wrench from 'wrench';
import gulp from 'gulp';

const tasks = wrench.readdirSyncRecursive('./straw/tasks/').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./straw/tasks/' + file);
});
