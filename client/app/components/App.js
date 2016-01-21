import React from 'react';
import Catalog from './catalog/Catalog';
import Cart from './cart/Cart';
import CatalogDetail from './product/CatalogDetail';
import Template from './app-template';
import { hashHistory, Router, Route, IndexRoute } from 'react-router';

export default() => {
  return(
    <Router history={hashHistory}>
      <Route path="/" component={Template}>
        <IndexRoute component={Catalog} />
        <Route path="cart" component={Cart}/>
        <Route path="item/:item" component={CatalogDetail}/>
      </Route>
    </Router>
  )
}
