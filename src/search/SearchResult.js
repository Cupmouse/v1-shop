import React from 'react';
import moment from 'moment';

import { useCookies } from 'react-cookie';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Modal from 'react-bootstrap/Modal';
import { IoMdArrowDropright, IoMdCart, IoMdClose } from 'react-icons/io';

import { bytes } from '../utils/human_readable';

import Pagination from '../component/Pagination';

const DATE_FORMAT = 'YYYY/M/D HH:mm:ss';
const NUM_ROWS = 10;

function AddButton(props) {
  const [ cookies, setCookie ] = useCookies();

  const addToCart = () => {
    let cart = cookies.cart;
    
    if (cart === undefined || !Array.isArray(cart))
      cart = [];
    
    cart = cart.concat(props.ids);

    setCookie('cart', Array.from(new Set(cart)), { path: '/' });
  }

  const removeFromCart = () => {
    // sustain every ids that is not included in props.ids
    const new_cart = cookies.cart.filter(id => !props.ids.some(b => id === b));
    setCookie('cart', new_cart, { path: '/' });
  }

  const cart = cookies.cart;

  // if every props.ids is included in cart, delete button
  if (cart !== undefined && props.ids.every(id => cart.some(b => id === b))) {
    return (
      <Button onClick={removeFromCart} variant='outline-danger'><IoMdClose />Delete</Button>
    );
  } else {
    return (
      <Button onClick={addToCart} variant='primary'><IoMdCart /> {props.children}</Button>
    );
  }
}

function AddSearch(props) {
  const [ cookies, setCookie ] = useCookies();

  
}

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open: Array(NUM_ROWS).fill(false),
    };

    this.pairs = this.pairs.bind(this);
    this.getTableRow = this.getTableRow.bind(this);
  }

  pairs(pairs, i) {
    pairs = pairs.split(',');

    return (
      <span style={{whiteSpace: 'break-spaces'}}>
        {
          <>
            {pairs.slice(0, 3).map(pair => pair + '\n')}
            <Button onClick={() => {
              const new_open = this.state.open;
              new_open[i] = !new_open[i];
              this.setState({ open: new_open })
            }} variant='outline-secondary' >
              Show more pairs
            </Button>
            <Collapse in={this.state.open[i]}>
              <div>
                {pairs.slice(3, -1).map(pair => pair + '\n')}
              </div>
            </Collapse>
          </>
        }
      </span>
    );
  }

  getTableRow(entry, i) {
    const date_start = moment.unix(entry.date_start).utc();
    const date_end = moment.unix(entry.date_end).utc();
    return (
      <tr key={i}>
        <td>{entry.exchange}</td>
        <td>
          {date_start.format(DATE_FORMAT)}<br />
          <IoMdArrowDropright /><br />
          {date_end.format(DATE_FORMAT)}<br />
          About {Math.round(moment.duration(date_end.diff(date_start)).asHours())} Hours
        </td>
        <td>{this.pairs(entry.pairs, i)}</td>
        <td><Button variant='outline-info'>Show sample</Button></td>
        <td>{bytes(entry.raw_size)}</td>
        <td>${entry.price/100}</td>
        <td><AddButton ids={[ entry.id ]}>Add to Cart</AddButton></td>
      </tr>
    );
  }

  render() {
    return (
      <>
        <h1>Search Result (New to Old)</h1>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Exchange</th>
              <th>Date (Duration)</th>
              <th>Pairs</th>
              <th>Sample</th>
              <th>Size</th>
              <th>Price</th>
              <th><AddButton ids={this.props.items.map(item => item.id)}>All in Page</AddButton></th>
            </tr>
          </thead>
          <tbody>
            {this.props.items.map(this.getTableRow)}
          </tbody>
        </Table>
        <Pagination
          pagecb={this.props.pagecb}
          page={typeof this.props.page === 'undefined' ? 1 : this.props.page}
          num_page={this.props.num_page}
        />
        <Modal.Dialog>
          <Modal.Header closeButton>
          <Modal.Title>{this.state.sample_title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.state.sample_text}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary">Close</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </>
    );
  }
}

export default SearchResult;