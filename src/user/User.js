import React from 'react';

import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import Container from 'react-bootstrap/Container';

class User extends React.Component {
  render() {
    if (this.props.user_id === null) {
      return (<Container className='User'><h1>You are not logged in</h1></Container>);
    }

    return (
      <Container className='User'>
        <h1>User: {this.props.user_id}</h1>
        <h2><Link to='/user/purchase_history'>Purchase History</Link></h2>
      </Container>
    );
  }
}

export default withCookies(User);