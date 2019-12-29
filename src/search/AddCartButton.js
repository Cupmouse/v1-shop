import React from 'react';

import { IoMdCart, IoMdClose } from 'react-icons/io';
import Button from 'react-bootstrap/Button';

function AddCartButton(props) {
  const addToCart = () => {
    let cart = window.localStorage.getItem('cart');
    
    if (cart === null)
      cart = [];
    else
      cart = cart.split(',').map(id => parseInt(id)).filter(id => Number.isInteger(id));
    cart = cart.concat(props.ids);
    window.localStorage.setItem('cart', Array.from(new Set(cart)).join(','));

    props.onChange();
  }

  const removeFromCart = () => {
    // sustain every ids that is not included in props.ids
    const new_cart = window.localStorage.getItem('cart').split(',')
      .map(id => parseInt(id))
      .filter(id => Number.isInteger(id))
      .filter(id => !props.ids.some(b => id === b));
    window.localStorage.setItem('cart', new_cart.join(','));

    props.onChange();
  }

  let cart = window.localStorage.getItem('cart');

  if (cart === null)
    cart = [];
  else
    cart = cart.split(',').map(id => parseInt(id));
  
  if (props.ids === null) {
    return (
      <Button variant={props.variant || 'primary'} disabled><IoMdCart /> {props.children}</Button>
    );
  } else if (props.ids.every(id => cart.some(b => id === b))) {
    // if every props.ids is included in cart, delete button
    return (
      <Button onClick={removeFromCart} variant='outline-danger'><IoMdClose />Delete</Button>
    );
  } else {
    return (
      <Button onClick={addToCart} variant={props.variant || 'outline-danger'}><IoMdCart /> {props.children}</Button>
    );
  }
}

export default AddCartButton;