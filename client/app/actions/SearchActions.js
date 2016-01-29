import AppDispatcher from '../dispatchers/AppDispatcher';
import ActionTypes from '../constants/Constants';
import { performSearch } from '../api/SearchAPI';

export function initSearch() {
  AppDispatcher.handleViewAction({
    actionType: ActionTypes.INIT_SEARCH,
  });
}

export function searchCourses(courseSearch) {
  AppDispatcher.handleViewAction({
    actionType: ActionTypes.PERFORM_SEARCH,
    courseSearch: courseSearch,
  });
}
