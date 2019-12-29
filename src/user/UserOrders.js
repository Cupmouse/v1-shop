import React from 'react';

import { withCookies } from 'react-cookie';

import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import { listorder } from '../utils/api';

class UserOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order_ids: [],
    };
  }

  componentDidMount() {
    const user_id = this.props.cookies.get('user_id');
    const session_id = this.props.cookies.get('session_id');

    listorder(user_id, session_id).then(orders => {
      this.setState({
        order_ids: orders,
      });
    });
  }

  render() {
    return (
      <Container className='UserOrders'>
        <h1>Orders History</h1>
        {this.state.order_ids.map(id => <h3 key={id}><Link to={'/order/' + id}>=> Order: {id}</Link></h3>)}
      </Container>
    );
  }
}

export default withCookies(UserOrders);