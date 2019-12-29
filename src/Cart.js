import React from 'react';

import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BootstrapTable from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';
import { IoMdClose } from 'react-icons/io';
import LoadingOverlay from 'react-loading-overlay';

import { bytes } from './utils/human_readable';
import { HOME_URL } from './utils/variables';
import { cart, purchase, bought, isLoggedin } from './utils/api';


class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      sum_size: 0,
      sum_price: 0,
      processing: false,
      price_right: false,
      logged_in: false,
      agree: false,
    };
    this.removeItem = this.removeItem.bind(this);
    this.getRow = this.getRow.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.onApprove = this.onApprove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onAgree = this.onAgree.bind(this);
  }

  refresh(ids) {
    cart(ids).then((res) => {
      this.setState({
        items: res.items,
        sum_size: res.sum_size,
        sum_price: res.sum_price,
        price_right: res.sum_price >= 500,
      });
    });
  }

  componentDidMount() {
    let cart = window.localStorage.getItem('cart');
    const user_id = this.props.cookies.get('user_id');
    const session_id = this.props.cookies.get('session_id');

    if (cart === null)
      cart = [];
    else
      cart = cart.split(',').map(id => parseInt(id)).filter(id => Number.isInteger(id));

    isLoggedin(user_id, session_id).then(response => {
      if (response.error || !response.status) {
        this.refresh(cart);
        this.setState({ logged_in: false });
        return;
      }

      return bought(user_id, session_id).then((bids) => {
        // update the cart. you don't want items you already bought, so remove duplicates
        cart = new Set(cart);
        bids.forEach(bid => cart.delete(bid));
        cart = Array.from(cart.values());

        window.localStorage.setItem('cart', cart.join(','));
        this.props.navcart();
        
        this.refresh(cart);
        this.setState({ logged_in: true });
      });
    });

    window.paypal.Buttons({
      onClick: this.onClick,
      createOrder: this.createOrder,
      onApprove: this.onApprove,
    }).render('#paypal-button-container');
  }

  removeItem(id) {
    const new_items = this.state.items.map(item => item.id).filter(item_id => item_id !== id);
    window.localStorage.setItem('cart', new_items.join(','));
    this.props.navcart();

    this.refresh(new_items);
  }

  getRow(elem, i) {
    return (
      <tr key={i}>
        <td>{elem.name}</td>
        <td>{bytes(elem.raw_size)}</td>
        <td><Button onClick={() => this.removeItem(elem.id)} variant='outline-danger'><IoMdClose />Delete</Button></td>
      </tr>
    )
  }

  onApprove(data, actions) {
    this.setState({ processing: true });

    const user_id = this.props.cookies.get('user_id');
    const session_id = this.props.cookies.get('session_id');
    const ids = this.state.items.map(item => item.id);

    return actions.order.capture().then((details) => {
      return purchase(user_id, session_id, data.orderID, ids);
    }).then(res => {
      if (res.error) {
        this.setState({ processing: false });
        alert(res.error);
        return actions.restart();
      }
      this.props.history.push('/user/orders');
    }).catch(err => {
      this.setState({ processing: false });
      alert('Transaction could not be completed. Please check your paypal account or credit card.');
      return actions.restart();
    });
  }

  onClick(data, actions) {
    const user_id = this.props.cookies.get('user_id');
    const session_id = this.props.cookies.get('session_id');

    return isLoggedin(user_id, session_id).then(data => {
      if (data.error) {
        alert('Please login');
        return actions.reject();
      } else {
        return actions.resolve();
      }
    });
  }

  createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: (this.state.sum_price / 100).toString(),
        }
      }],
    });
  }

  onAgree(event) {
    this.setState({
      agree: !this.state.agree,
    });
  }

  render() {
    return (
      <LoadingOverlay
        active={this.state.processing}
        spinner
        text='Processing...'
      >
        <BootstrapTable striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.items.map(this.getRow)}
            <tr>
              <td>Total</td>
              <td>{bytes(this.state.sum_size)}</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>${this.state.sum_price/100}</td>
              <td>
                <h4>Checkout:</h4>
                <Form.Check type='checkbox'>
                  <Form.Check.Input type='checkbox' onClick={this.onAgree} checked={this.agree} />
                  <Form.Check.Label>I agree to <a href={HOME_URL + '/termsofservice'} target='_blank' rel='noopener noreferrer'>the Terms of Service</a>.</Form.Check.Label>
                </Form.Check>
                {
                  !this.state.price_right ?
                    <p>Minimum checkout amount is $5. You need to add more items.</p> : ''
                }
                {
                  !this.state.logged_in ?
                    <p>You must be logged in to purchase.</p> : ''
                }
                <Collapse in={this.state.agree && this.state.logged_in && this.state.price_right}>
                  <div id="paypal-button-container"></div>
                </Collapse>
              </td>
            </tr>
          </tbody>
        </BootstrapTable>
      </LoadingOverlay>
    );
  }
}

Table = withRouter(withCookies(Table));

function Cart(props) {
  return (
    <Container className='Cart'>
      <Row><Col><h1>Cart</h1></Col></Row>
      <Row>
        <Col>
          <Table navcart={props.navcart} />
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;