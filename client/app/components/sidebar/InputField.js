import React from 'react';
import { initSearch, searchCourses } from '../../actions/SearchActions'

export default class InputField extends React.Component {
  constructor(props) {
  super(props);
      this._onChange = this._onChange.bind(this);
      this._clickSearchButton = this._clickSearchButton.bind(this);
      this._catchEnter = this._catchEnter.bind(this);
      this.state = {
        location: '',
      };
    }

    _onChange(event) {
      this.setState({
        location: event.target.value,
        classTopics: event.target.value,
      });
    }
    //
    // _search() {
    //   searchCourses(this.state.location);
    // }

    _catchEnter(event) {
      if (event.keyCode === 13) {
        this._clickSearchButton();
      }
    }

    _clickSearchButton() {
    let form = document.getElementById('form-course-search');
    let location = form.querySelector('#location').value;
    let classTopics = form.querySelector('#classTopics').value;
    // let color = form.querySelector('#color').value;
    // let size = form.querySelector('#size').value;
    // let price = form.querySelector('#price').value;
    // let category = form.querySelector('#category').value;
    let dateInfo = {

    }
    let courseSearch = {
      location,
      classTopics:['electrical'],
      dates: {
        min: {
          minMonthVal: 1,
          minYearVal: 2016
        },
        max: {
          maxMonthVal: 4,
          maxYearVal: 2016
        }
      }
    };
    searchCourses(courseSearch);
  }

  render() {
    return (
      <div>
      <form id="form-course-search" className="note">
          <label htmlFor="location">Location</label>
          <input type="text" id="location" />
          <label htmlFor="classTopics">classTopics</label>
          <input type="text" id="classTopics" />
          <input type="button" onClick={this._clickSearchButton} value="Search" />
          </form>
        </div>
    );
  }
}
