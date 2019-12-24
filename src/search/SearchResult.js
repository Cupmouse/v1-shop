import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { IoMdCart } from 'react-icons/io';

import Pagination from '../component/Pagination';

const SI_SUFFIX = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

class SearchResult extends React.Component {
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

  pairs(pairs) {
    return (
      <span>
        <Button eventKey='0'>
          click
        </Button>
        <Collapse eventKey='0'>
          <div>
            {pairs}
          </div>
        </Collapse>
      </span>
    );
  }

  render() {
    return (
      <div>
        <h1>Search Result</h1>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Exchange</th>
              <th>Pairs</th>
              <th>Size</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.items.map((entry, i) => 
              <tr key={i}>
                <td>{entry['name']}</td>
                <td>{entry['exchange']}</td>
                <td>{this.pairs()}</td>
                <td>{this.human_readable(entry['raw_size'])}</td>
                <td>{100}</td>
                <td><Button><IoMdCart /></Button></td>
              </tr>
            )}
          </tbody>
        </Table>
        <Pagination
          pagecb={this.props.pagecb}
          page={typeof this.props.page === 'undefined' ? 1 : this.props.page}
          num_page={this.props.num_page}
        />
      </div>
    );
  }
}

export default SearchResult;