import React from 'react';

import moment from 'moment';
import { withCookies } from 'react-cookie';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { bytes } from './utils/human_readable';
import { order } from './utils/api';
import { API_URL } from './utils/variables';

function URLModal(props) {
  return (
    <Modal
      show={props.show}
      size='lg'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          URLs
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control as='textarea' rows={15} value={props.text} readOnly />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: null,
      modal_show: false,
    };
    this.onHide = this.onHide.bind(this);
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

  onHide() {
    this.setState({
      modal_show: false,
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
              <td>
                <a href={API_URL + '/get?code=' + item.code}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn btn-outline-primary'
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td>${this.state.order.total}</td>
            <td></td>
            <td><Button onClick={() => this.setState({ modal_show: true })} variant='primary'>List URLs</Button></td>
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
          <h1>Order {this.props.match.params.order_id}</h1>
          <h2>Date: {moment.unix(this.state.order.date).toString()}</h2>
          <h2>Items</h2>
          <p>You can use 'List URLs' button to show download URLs for all items in this order.</p>
          <p style={{
            fontSize: '2em',
            fontStyle: 'bold',
            color: 'red',
          }}>Warning: You can only download item for 3 times.</p>
          {this.getTable()}
          <URLModal
            show={this.state.modal_show}
            onHide={this.onHide}
            text={this.state.order.items.map(item => API_URL + '/get?code=' + item.code).join('\n')}
          />
        </Container>
      );
    }
  }
}

export default withCookies(Order);