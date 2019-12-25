import React from 'react';

import { withCookies } from 'react-cookie';

import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { IoMdPersonAdd } from 'react-icons/io';

class NavUser extends React.Component {
  componentDidMount() {
    // check if a user is logged in
    const user_id = this.props.cookies.get('user_id');
    const session_id = this.props.cookies.get('session_id');

    if (user_id === undefined || session_id === undefined) {
      return;
    }

    const data = {
      user_id,
      session_id,
    };

    window.fetch('/api/isloggedin', {
      method: 'POST',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {'Content-Type': 'application/json'},
      redirect: 'error',
      referrer: 'no-referrer',
      body: JSON.stringify(data),
    }).then(response => response.json())
    .then(response => {
      if (response.error || !response.status)
        return;

      this.setState({
        user_id,
        session_id,
        logged_in: true,
      });
    });
  }

  onLogout() {
    const user_id = this.props.cookies.get('user_id');
    const session_id = this.props.cookies.get('session_id');

    const data = {
      user_id,
      session_id,
    };
    
    window.fetch('/api/logout', {
      method: 'POST',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {'Content-Type': 'application/json'},
      redirect: 'error',
      referrer: 'no-referrer',
      body: JSON.stringify(data),
    }).then(response => response.json())
    .then(response => {
      if (response.error)
        return;

      this.props.cookies.remove('user_id');
      this.props.cookies.remove('session_id');

      this.setState({
        user_id: null,
        session_id: null,
        logged_in: false,
      });
      this.props.history.push('/');
    });
  }

  onLogin(user_id, session_id) {
    this.props.cookies.set('user_id', user_id, { maxAge: 24*60*60, path: '/' });
    this.props.cookies.set('session_id', session_id, { maxAge: 24*60*60, path: '/' });
    
    this.setState({
      user_id,
      session_id,
      logged_in: true,
    });
  }

  render() {
    if (this.props.logged_in) {
      return (
        <Nav>
          <LinkContainer to='/user'><Nav.Link className='mr-2'>{this.state.user_id}</Nav.Link></LinkContainer>
          <Nav.Link className='mr-2' onClick={this.onLogout}>Logout</Nav.Link>
        </Nav>
      );
    } else {
      return (
        <Nav>
          <LinkContainer to='/signup'><Nav.Link className='mr-2'><IoMdPersonAdd />Sign-up</Nav.Link></LinkContainer>
          <LinkContainer to='/login'><Nav.Link className='btn btn-primary mr-2' role='button'>Login</Nav.Link></LinkContainer>
        </Nav>
      )
    }
  }
}

export default withCookies(NavUser);