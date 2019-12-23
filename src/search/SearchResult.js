import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { IoMdCart } from 'react-icons/io';

import Pagination from '../component/Pagination';

class SearchResult extends React.Component {
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
                <td>{entry['pairs']}</td>
                <td>{entry['raw_size']}</td>
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