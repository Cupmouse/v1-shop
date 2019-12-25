import React from 'react';

import Container from 'react-bootstrap/Container';

class NotFound extends React.Component {
  render() {
    return (
      <Container className='NotFound'>
        <h1>404 Not Found</h1>
      </Container>
    );
  }
}

export default NotFound;