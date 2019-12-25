import React from 'react';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import CardDeck from 'react-bootstrap/CardDeck';

class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this.jumpTo = this.jumpTo.bind(this);
    this.getCards = this.getCards.bind(this);
  }

  jumpTo(exchange) {
    return () => { this.props.history.push('/search?exchanges=' + exchange) };
  }

  getCards() {
    return Object.keys(this.props.exchanges).map((key, i) => (
      <Card key={i}>
        <Card.Img variant="top" src={'/exc_logos/' + key + '.svg'} />
        <Card.Body>
        <Card.Title>{this.props.exchanges[key]}</Card.Title>
        <Button onClick={this.jumpTo(key)} variant="primary">View</Button>
        </Card.Body>
      </Card>
    ));
  }

  render() {
    return (
      <Container className="Home">
        <h1>Datasets from Exchanges</h1>
        <CardDeck>{this.getCards()}</CardDeck>
      </Container>
    );
  }
}

export default Home;