import React from 'react';

import { IoMdCart } from 'react-icons/io';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';

class NavCart extends React.Component {
  onCartChange() {
    this.setState({ forcererender: Math.random() });
  }

  render() {
    const cart = window.localStorage.getItem('cart');
    const cart_length = cart === null ? 0 : cart.split(',').map(id => parseInt(id)).filter(id => Number.isInteger(id)).length;
  
    return (
      <LinkContainer to='/cart'><Nav.Link><IoMdCart /> Cart <span className="badge badge-success">{cart_length}</span></Nav.Link></LinkContainer>
    );
  }
}

export default NavCart;