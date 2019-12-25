import React from 'react';
import moment from 'moment';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Modal from 'react-bootstrap/Modal';
import { IoMdArrowDropright } from 'react-icons/io';

import { bytes } from '../utils/human_readable';

import Pagination from '../component/Pagination';
import CartButton from './CartButton';

const DATE_FORMAT = 'YYYY/M/D HH:mm:ss';
const NUM_ROWS = 10;

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
              const new_open = this.state.open.splice(0, -1);
              this.new_open[i] = !this.new_open[i];
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
    const date_start = moment.unix(entry['date_start']).utc();
    const date_end = moment.unix(entry['date_end']).utc();
    return (
      <tr key={i}>
        <td>{entry['exchange']}</td>
        <td>
          {date_start.format(DATE_FORMAT)}<br />
          <IoMdArrowDropright /><br />
          {date_end.format(DATE_FORMAT)}<br />
          About {Math.round(moment.duration(date_end.diff(date_start)).asHours())} Hours
        </td>
        <td>{this.pairs(entry['pairs'], i)}</td>
        <td><Button variant='outline-info'>Show sample</Button></td>
        <td>{bytes(entry['raw_size'])}</td>
        <td>${entry['price']/100}</td>
        <td><CartButton id={entry['id']} /></td>
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
              <th></th>
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