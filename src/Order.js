import React from 'react';

import moment from 'moment';
import { withCookies } from 'react-cookie';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

import { bytes } from './utils/human_readable';
import { order } from './utils/api';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { API_URL } from './utils/variables';

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: null,
    };
  }
  componentDidMount() {
    const user_id = this.props.cookies.get('user_id');
    const session_id = this.props.cookies.get('session_id');

    order(user_id, session_id, this.props.match.params.order_id).then(order => {
      if (!order.error) {
        this.setState({
          order,
        });
      }
    });
  }

  getTable() {
    return (
      <Table bordered striped hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Raw Size</th>
            <th>Count</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {this.state.order.items.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{bytes(item.raw_size)}</td>
              <td>{item.count}</td>
              <td><a href={API_URL + '/get?code=' + item.code} target='_blank' className='btn btn-outline-primary'>Download</a></td>
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td>${this.state.order.total}</td>
            <td></td>
            <td>List URLs</td>
          </tr>
        </tbody>
      </Table>
    );
  }

  render() {
    if (this.state.order === null) {
      return (<Container className='Order'><h1>Loading...</h1></Container>);
    } else {
      return (
        <Container className='Order'>
          <h1>Order {this.props.order_id}</h1>
          <h2>Items</h2>
          <p>You can use "List URLs" button to show download URLs for all items in this order.</p>
          <p style={{
            fontSize: '2em',
            fontStyle: 'bold',
            color: 'red',
          }}>Warning: You only have 3 chance to download for each item.</p>
          <h2>{moment.unix(this.state.order.date).toString()}</h2>
          {this.getTable()}
        </Container>
      );
    }
  }
}

export default withCookies(Order);