import React from 'react';
import queryString from 'query-string';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';

import SearchResult from './SearchResult';
import SearchParams from './SearchParams';
import { search } from '../utils/api';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exchanges: null,
      pairs: null,
      date_start: null,
      date_end: null,
      page: null,
      num_page: 0,
      items: null,
      ids: null,
    };

    this.changePage = this.changePage.bind(this);
    this.searchCallback = this.searchCallback.bind(this);
  }

  makeQueryFromLocation(location) {
    const parsed = queryString.parse(location.search);
    const query = {};

    if (typeof parsed.exchanges !== 'undefined') {
      if (typeof parsed.exchanges === 'string') {
        query.exchanges = [ parsed.exchanges ];
      } else if (Array.isArray(parsed.exchanges)
        && parsed.exchanges.every(elem => typeof elem === 'string')) {
        query.exchanges = parsed.exchanges;
      }
    }
    if (typeof parsed.pairs !== 'undefined') {
      if (typeof parsed.pairs === 'string') {
        query.pairs = [ parsed.pairs ];
      } else if (Array.isArray(parsed.exchanges)
        && parsed.exchanges.every(elem => typeof elem === 'string')) {
        query.pairs = parsed.pairs;
      }
    }
    if (typeof parsed.date_start === 'string') {
      query.date_start = parseInt(parsed.date_start);
    }
    if (typeof parsed.date_end === 'string') {
      query.date_end = parseInt(parsed.date_end);
    }
    if (typeof parsed.page === 'string') {
      query.page = parseInt(parsed.page);
    }

    return query;
  }

  transition(location) {
    const query = this.makeQueryFromLocation(location);

    let new_state = {
      exchanges: null,
      pairs: null,
      date_start: null,
      date_end: null,
      page: null,
    }

    new_state = {
      ...query,
    }

    this.setState({
      ...new_state,
      items: null,
    });

    search(query).then((res) => {
      this.setState({
        items: res.items,
        num_page: res.num_page,
        ids: res.ids,
      });
    });
  }

  componentDidMount() {
    if (typeof this.unlisten === 'undefined') {
    this.transition(this.props.location);

      this.unlisten = this.props.history.listen((location) => {
        if (location.pathname === '/search') {
          // back button is pressed
          this.transition(location);
        }
      });
    }
  }

  componentWillUnmount() {
    this.unlisten();
  }

  searchCallback(query) {
    this.props.history.push('/search?' + queryString.stringify(query));
  }

  changePage(page) {
    const new_query = this.makeQueryFromLocation(this.props.location);
    new_query.page = page;
    this.props.history.push('/search?' + queryString.stringify(new_query));
  }

  render() {
    return (
      <Container className='Search' fluid={true}>
        <Row>
          <Col lg={{order: 2, span: 'auto'}}>
            <SearchParams
              searchcb={this.searchCallback}
              exchanges={this.props.exchanges}
              query_exchanges={this.state.exchanges}
              pairs={this.state.pairs}
              date_start={this.state.date_start}
              date_end={this.state.date_end}
            />
          </Col>
          <Col lg={{order: 1}}>
            {
              this.state.items === null ? <ProgressBar animated now={100} /> :
              <SearchResult
                pagecb={this.changePage}
                items={this.state.items}
                page={this.state.page}
                num_page={this.state.num_page}
                ids={this.state.ids}
              />
            }
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Search;