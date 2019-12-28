import React from 'react';

import { IoMdCart } from 'react-icons/io';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';

function NavCart(props) {
  const cart = window.localStorage.getItem('cart');
  const cart_length = cart === null ? 0 : cart.split(',').filter(id => Number.isInteger(id)).map(id => parseInt(id)).length;

  return (
    <LinkContainer to='/cart'><Nav.Link><IoMdCart /> Cart <span className="badge badge-success">{cart_length}</span></Nav.Link></LinkContainer>
  );
}

export default NavCart;