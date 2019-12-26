import React from 'react';

import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import Container from 'react-bootstrap/Container';

class User extends React.Component {
  render() {
    const user_id = this.props.cookies.get('user_id');

    if (user_id === undefined) {
      return (<Container className='User'><h1>You are not logged in</h1></Container>);
    }

    return (
      <Container className='User'>
        <h1>User: {user_id}</h1>
        <h2><Link to='/user/purchase_history'>Purchase History</Link></h2>
      </Container>
    );
  }
}

export default withCookies(User);