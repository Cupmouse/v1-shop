import React from 'react';

import { withCookies } from 'react-cookie';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';
import { IoMdClose } from 'react-icons/io';
import LoadingOverlay from 'react-loading-overlay';

import { bytes } from './utils/human_readable';
import { cart, purchase, bought, isLoggedin } from './utils/fetch';


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
    };
    this.removeItem = this.removeItem.bind(this);
    this.getRow = this.getRow.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.onApprove = this.onApprove.bind(this);
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
    let cart = this.props.cookies.get('cart');
    const user_id = this.props.cookies.get('user_id');
    const session_id = this.props.cookies.get('session_id');

    if (cart === undefined)
      cart = [];

    isLoggedin(user_id, session_id).then(response => {
      if (response.error || !response.status) {
        this.refresh(cart);
        this.setState({ logged_in: false });
        return;
      }

      return bought(user_id, session_id).then((bids) => {
        // update the cart. you don't want items you already bought, so remove duplicates
        console.log(cart)
        if (cart === undefined || !Array.isArray(cart) || cart.some(id => typeof id !== 'number' || !Number.isInteger(id))) {
          this.props.cookies.set('cart', []);
          return;
        }
        
        cart = new Set(cart);
        bids.forEach(bid => cart.delete(bid));
        cart = Array.from(cart.values());

        this.props.cookies.set('cart', cart, { path: '/' });
        
        this.refresh(cart);
        this.setState({ logged_in: true })
      });
    });

    window.paypal.Buttons({
      createOrder: this.createOrder,
      onApprove: this.onApprove,
    }).render('#paypal-button-container');
  }

  removeItem(id) {
    const new_items = this.state.items.map(item => item.id).filter(item_id => item_id !== id);
    this.props.cookies.set('cart', new_items, { path: '/' });

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

    return actions.order.capture().then((details) => {
      return purchase(data.orderId, this.state.items.map(item => item.id));
    }).then(res => {
      console.log(res);
      if (res.error) {
        return actions.restart();
      }
    }).catch(() => {
      return actions.restart();
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
                {
                  !this.state.price_right ?
                    <p>Minimum checkout amount is $5. You need to add more items.</p> : ''
                }
                {
                  !this.state.logged_in ?
                    <p>You must be logged in to purchase.</p> : ''
                }
                <Collapse in={this.state.logged_in && this.state.price_right}>
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

Table = withCookies(Table);

function Cart(props) {
  return (
    <Container className='Cart'>
      <Row><Col><h1>Cart</h1></Col></Row>
      <Row>
        <Col>
          <Table />
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;