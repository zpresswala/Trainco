import React from 'react';
import RangeSlider from './RangeSlider';
import InputField from './InputField';
export default () => {
  return (
    <div className="col-md-3" style={{borderRight: '1px solid #ccc'}}>
      <h1>Sidebar</h1>
      <div>
      <InputField />
      <br />
      <RangeSlider />
      </div>
    </div>
  );
}
