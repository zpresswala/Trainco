import React from 'react';
import AppActions from '../../actions/Actions';
import CartButton from '../cart/CartButton';
import {Link} from 'react-router';

export default(props) => {
  let itemStyle = {
    borderBottom: '1px solid #ccc',
    paddingBottom: 15
  }
  return(
    <div className="col-xs-6 col-sm-4 col-md-3" style={itemStyle}>
      <h4>{props.item.title}</h4>
      <img src="http://placehold.it/250x250" width="100%" className="img-responsive"/>
      <p>{props.item.summary}</p>
      <p>${props.item.cost} <span
        className="text-success">
        {props.item.qty && `(${props.item.qty} in cart)`}
      </span>
      </p>
      <div className="btn-group">
        <Link to={`/item/${props.item.id}`} className="btn-reg btn-blue-hollow add-to-cart">Learn More</Link>
        <CartButton
          handler={
            AppActions.addItem.bind(null, props.item)
          }
          txt="Add To Cart"
          />
      </div>
    </div>
  )
}
