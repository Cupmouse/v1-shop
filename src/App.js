import React from 'react';

import 'react-dates/initialize';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { IoMdHome, IoMdSearch } from 'react-icons/io';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';

import Home from './Home';
import NavCart from './NavCart';
import NavUser from './user/NavUser'
import Signup from './user/Signup';
import Login from './user/Login';
import Search from './search/Search';
import User from './user/User';
import UserOrders from './user/UserOrders';
import Cart from './Cart';
import Order from './Order';
import NotFound from './NotFound';

const exchanges = {
  'bitmex': 'Bitmex',
  'bitfinex': 'Bitfinex',
  'bitflyer': 'Bitflyer'
};

class App extends React.Component {
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
                  <LinkContainer to='/'><Nav.Link><IoMdHome /> Home</Nav.Link></LinkContainer>
                  <LinkContainer to='/search'><Nav.Link><IoMdSearch /> Search</Nav.Link></LinkContainer>
                </Nav>
                <Nav>
                  <NavCart />
                  <NavUser />
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </header>
          <Switch>
            <Route exact path='/' component={(props) => <Home exchanges={exchanges} {...props} />} />
            <Route exact path='/search' component={(props) => <Search exchanges={exchanges} {...props} />} />
            <Route exact path='/cart' component={Cart} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/user' component={User} />
            <Route exact path='/user/orders' component={UserOrders} />
            <Route path='/order/:order_id' component={Order} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
