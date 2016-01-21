import React from 'react';
import InputRange from 'react-input-range';

class Range extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: {
        min: 5,
        max: 10,
      }
    };
  }

  handleValuesChange(component, values) {
    this.setState({
      values: values,
    });
  }

  render() {
    return (
      <form className="form">
                <div className="formField">
          <InputRange
            maxValue={20}
            minValue={0}
            value={this.state.values}
            onChange={this.handleValuesChange.bind(this)}
          />
        </div>
      </form>
    );
  }
}

export default Range;
