import React from 'react';

import { withCookies } from 'react-cookie';

import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { IoMdPersonAdd } from 'react-icons/io';

import { isLoggedin, logout } from '../utils/api';
import { withRouter } from 'react-router-dom';

class NavUser extends React.Component {
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
  }

  componentDidMount() {
    // check if a user is logged in
    const user_id = this.props.cookies.get('user_id');
    const session_id = this.props.cookies.get('session_id');

    if (user_id === undefined || session_id === undefined) {
      return;
    }

    isLoggedin(user_id, session_id).then(response => {
      if (response.error || !response.status)
        return;
    });
  }

  onLogout() {
    const user_id = this.props.cookies.get('user_id');
    const session_id = this.props.cookies.get('session_id');

    this.props.cookies.remove('user_id');
    this.props.cookies.remove('session_id');

    logout(user_id, session_id).then(response => {
      if (response.error)
        return;

      this.props.history.push('/');
    });
  }
  
  render() {
    const user_id = this.props.cookies.get('user_id');
    if (user_id === undefined) {
      return (
        <>
          <LinkContainer to='/signup'><Nav.Link className='mr-2'><IoMdPersonAdd /> Sign-up</Nav.Link></LinkContainer>
          <LinkContainer to='/login'><Nav.Link className='btn btn-primary mr-2' role='button'>Login</Nav.Link></LinkContainer>
        </>
      )
    } else {
      return (
        <>
          <LinkContainer to='/user'><Nav.Link className='mr-2'>{user_id}</Nav.Link></LinkContainer>
          <Nav.Link className='mr-2' onClick={this.onLogout}>Logout</Nav.Link>
        </>
      );
    }
  }
}

export default withCookies(withRouter(NavUser));