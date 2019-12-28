import React from 'react';
import moment from 'moment';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { IoMdArrowDropright } from 'react-icons/io';

import Pagination from '../component/Pagination';
import AddCartButton from './AddCartButton';

import { bytes } from '../utils/human_readable';
import { sample } from '../utils/api';

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
    this.onCartChange = this.onCartChange.bind(this);
  }

  onCartChange() {
    this.setState({ forcererender: Math.random() });
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
        <td>
          <Button
            onClick={() => sample(entry.id, entry.name)}
            variant='outline-info'
          >
            Show sample
          </Button>
        </td>
        <td>{bytes(entry.raw_size)}</td>
        <td>${entry.price/100}</td>
        <td><AddCartButton ids={[ entry.id ]} onChange={this.onCartChange} variant='primary'>Add to Cart</AddCartButton></td>
      </tr>
    );
  }

  render() {
    return (
      <>
        <h1>
          Search Result (New to Old)
          <AddCartButton ids={this.props.ids} onChange={this.onCartChange} className='ml-3' variant='danger'>All in Result</AddCartButton>
        </h1>
        
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Exchange</th>
              <th>Date (Duration)</th>
              <th>Pairs</th>
              <th>Sample</th>
              <th>Size</th>
              <th>Price</th>
              <th><AddCartButton ids={this.props.items.map(item => item.id)} onChange={this.onCartChange} variant='primary'>All in Page</AddCartButton></th>
            </tr>
          </thead>
          <tbody>
            {this.props.items.map(this.getTableRow)}
          </tbody>
        </Table>
        <Pagination
          pagecb={this.props.pagecb}
          page={this.props.page === null ? 1 : this.props.page}
          num_page={this.props.num_page}
        />
      </>
    );
  }
}

export default SearchResult;