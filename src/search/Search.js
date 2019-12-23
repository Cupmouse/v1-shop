import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';

import queryString from 'query-string';
import moment from 'moment';

import SearchResult from './SearchResult';
import SearchParams from './SearchParams';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.makeQueryFromLocation(props.location),
      num_page: 0,
      items: null,
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
      } else {
        query.exchanges = parsed.exchanges;
      }
    }
    if (typeof parsed.pairs !== 'undefined') {
      if (typeof parsed.pairs === 'string') {
        query.pairs = [ parsed.pairs ];
      } else {
        query.pairs = parsed.pairs;
      }
    }
    if (typeof parsed.date_start !== 'undefined') {
      query.date_start = moment(parsed.date_start*1000);
    }
    if (typeof parsed.date_end !== 'undefined') {
      query.date_end = moment(parsed.date_end*1000);
    }
    if (typeof parsed.page !== 'undefined') {
      query.page = parseInt(parsed.page);
    }

    return query;
  }

  transition(location) {
    const query = this.makeQueryFromLocation(location);

    let new_state = {
      exchanges: undefined,
      pairs: undefined,
      date_start: undefined,
      date_end: undefined,
      page: undefined,
    }

    new_state = {
      ...query,
    }

    this.setState({
      ...new_state,
      items: null,
    });

    window.fetch('/api/search', {
      method: 'POST',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {'Content-Type': 'application/json'},
      redirect: 'error',
      referrer: 'no-referrer',
      body: JSON.stringify(query),
    }).then((res) => res.json())
    .then((res) => {
      this.setState({
        items: res.items,
        num_page: res.num_page,
      });
    });
  }

  componentDidMount() {
    if (typeof this.unlisten === 'undefined')
      this.transition(this.props.location);

    this.unlisten = this.props.history.listen((location) => {
      if (location.pathname === '/search') {
        // back button is pressed
        this.transition(location);
      }
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  convertFromQuery(query) {
    const obj = {};

    if (typeof query.exchanges !== 'undefined') {
      obj.exchanges = query.exchanges;
    }
    if (typeof query.pairs !== 'undefined') {
      obj.pairs = query.pairs;
    }
    if (typeof query.date_start !== 'undefined') {
      obj.date_start = query.date_start.unix();
    }
    if (typeof query.date_end !== 'undefined') {
      obj.date_end = query.date_end.unix();
    }
    if (typeof query.page !== 'undefined') {
      obj.page = query.page;
    }
    
    return obj;
  }

  searchCallback(query) {
    this.props.history.push('/search?' + queryString.stringify(this.convertFromQuery(query)));
  }

  changePage(page) {
    const new_query = this.makeQueryFromLocation(this.props.location);
    new_query.page = page;
    this.props.history.push('/search?' + queryString.stringify(this.convertFromQuery(new_query)));
  }

  render() {
    return (
      <div className='Search'>
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
              />
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default Search;