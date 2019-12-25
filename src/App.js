import React from 'react';

import 'react-dates/initialize';

import { withCookies } from 'react-cookie';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { IoMdPersonAdd, IoMdHome, IoMdSearch } from 'react-icons/io';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';

import Home from './Home';
import Signup from './user/Signup';
import Login from './user/Login';
import Search from './search/Search';
import User from './user/User';
import PurchaseHistory from './user/PurchaseHistory';
import NotFound from './NotFound';

const exchanges = {
  'bitmex': 'Bitmex',
  'bitfinex': 'Bitfinex',
  'bitflyer': 'Bitflyer'
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: null,
      session_id: null,
      logged_in: false,
    }

    // this.componentDidMount = this.componentDidMount.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

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

  getUserPrompt() {
    if (this.state.logged_in) {
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

  render() {
    return (
      <div className='App'>
        <BrowserRouter>
          <header className='App-Header mb-3'>
            <Navbar bg='light' expand='lg'>
              <LinkContainer to='/'><Navbar.Brand>Exchange Dataset</Navbar.Brand></LinkContainer>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='mr-auto'>
                  <LinkContainer to='/'><Nav.Link><IoMdHome />Home</Nav.Link></LinkContainer>
                  <LinkContainer to='/search'><Nav.Link><IoMdSearch />Search</Nav.Link></LinkContainer>
                </Nav>
                {this.getUserPrompt()}
              </Navbar.Collapse>
            </Navbar>
          </header>
          <Switch>
            <Route exact path='/' component={(props) => <Home exchanges={exchanges} {...props} />} />
            <Route exact path='/search' component={(props) => <Search exchanges={exchanges} {...props} />} />
            <Route exact path='/signup' component={(props) => <Signup onLogin={this.onLogin} {...props} />} />
            <Route exact path='/login' component={(props) => <Login onLogin={this.onLogin} {...props} />} />
            <Route exact path='/user' component={(props) => <User user_id={this.state.user_id} {...props} />} />
            <Route exact path='/user/purchase_history' component={PurchaseHistory} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default withCookies(App);
