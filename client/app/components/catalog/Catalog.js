import React from 'react';
import AppStore from '../../stores/Store';
import CatalogItem from './CatalogItem';
import StoreWatchMixin from '../../mixins/StoreWatchMixin.js';
import Sidebar from '../sidebar/Sidebar';

function getCatalog(){
  return {items: AppStore.getCatalog()}
}

const Catalog = (props) => {
  let items = props.items.map(item => {
    return <CatalogItem key={item.id} item={item} />
  });
  return (
    <div className="row">
      <Sidebar />
      <div className="col-md-9">
        {items}
      </div>
    </div>
  )
}
export default StoreWatchMixin(Catalog, getCatalog);
