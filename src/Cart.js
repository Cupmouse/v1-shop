import React from 'react';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap/Table';

import { bytes } from './utils/human_readable';
import { getItem } from './utils/fetch';
import { withCookies } from 'react-cookie';
import { IoMdClose } from 'react-icons/io';

class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      sum_size: 0,
      sum_price: 0,
    };
    this.removeItem = this.removeItem.bind(this);
    this.getRow = this.getRow.bind(this);
  }

  refresh(ids) {
    getItem(ids).then((res) => {
      this.setState({
        items: res.items,
        sum_size: res.sum_size,
        sum_price: res.sum_price,
      });
    });
  }

  componentDidMount() {
    let cart_ids = this.props.cookies.get('cart');

    if (cart_ids === undefined)
      cart_ids = [];
      
    this.refresh(cart_ids);
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
        <td><Button onClick={() => this.removeItem(elem.id)}><IoMdClose />Delete</Button></td>
      </tr>
    )
  }

  render() {
    return (
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
            <td></td>
          </tr>
        </tbody>
      </BootstrapTable>
    );
  }
}

Table = withCookies(Table);

function Cart() {
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