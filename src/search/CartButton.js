import React from 'react';

import { withCookies } from 'react-cookie';

import Button from 'react-bootstrap/Button';
import { IoMdCart } from 'react-icons/io';

class CartButton extends React.Component {
  constructor(props) {
    super(props);
    this.addToCart = this.addToCart.bind(this);
  }

  addToCart() {
    const cookie_cart = this.props.cookies.get('cart');
    const cart_items = new Set(cookie_cart === undefined || !Array.isArray(cookie_cart) ? [] : cookie_cart);
    cart_items.add(this.props.id);
    console.log(cart_items)
    this.props.cookies.set('cart', Array.from(cart_items), { path: '/' });
  }

  render() {
    return (
      <Button onClick={this.addToCart} variant='primary'><IoMdCart />Add to Cart</Button>
    );
  }
}

export default withCookies(CartButton);