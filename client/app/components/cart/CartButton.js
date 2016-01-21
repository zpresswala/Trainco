import React from 'react';

export default(props) => {
  return (
    <button
      className="btn-reg btn-blue-hollow add-to-cart"
      onClick={props.handler}>
      {props.txt}
    </button>
  )
}
