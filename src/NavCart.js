import React from 'react';

import { useCookies } from 'react-cookie';

import { IoMdCart } from 'react-icons/io';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';

function NavCart(props) {
  const [ cookies ] = useCookies();

  const cart_length = cookies.cart === undefined ? 0 : cookies.cart.length;

  return (
    <LinkContainer to='/cart'><Nav.Link><IoMdCart /> Cart <span className="badge badge-success">{cart_length}</span></Nav.Link></LinkContainer>
  );
}

export default NavCart;