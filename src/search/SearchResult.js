import React from 'react';
import moment from 'moment';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { IoMdCart, IoMdArrowDropright } from 'react-icons/io';

import Pagination from '../component/Pagination';

const SI_SUFFIX = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
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

  human_readable(raw_size) {
    let hr = raw_size;
    let i = 0;

    for (; i < SI_SUFFIX.length; i++) {
      if (hr < 1024)
        break;
      hr /= 1024;
    }
    return Math.round(hr*100)/100 + SI_SUFFIX[i];
  }

  pairs(pairs, i) {
    pairs = pairs.split(',');

    return (
      <span style={{whiteSpace: 'break-spaces'}}>
        {
          <>
            {pairs.slice(0, 3).map(pair => pair + '\n')}
            <Button onClick={() => {
              this.setState({ open: this.state.open })
              this.state.open[i] = !this.state.open[i];
            }} >
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
        <td>{this.human_readable(entry['raw_size'])}</td>
        <td>${}</td>
        <td><Button><IoMdCart /></Button></td>
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
      </>
    );
  }
}

export default SearchResult;