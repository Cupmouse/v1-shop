import React from 'react';
import BootstrapPagination from 'react-bootstrap/Pagination';

class Pagination extends React.Component {
  render() {
    const page = this.props.page;
    const num_page = this.props.num_page;
    const amount = 7;
    const half = Math.floor(amount/2);

    const newItem = i => {
      return <BootstrapPagination.Item key={i} active={page === i}
        onClick={() => {
          if (page !== i)
            this.props.pagecb(i);
        }}>{i}</BootstrapPagination.Item>
    };

    let pagin = [];
    
    pagin.push(newItem(1));
    if (num_page <= amount) {
      for (let i = 2; i <= num_page; i++)
        pagin.push(newItem(i));
    } else {
      if (page > half + 2)
        pagin.push(<BootstrapPagination.Ellipsis key='e1' />);
  
      const min = Math.min(Math.max(2, page-half), num_page - half - 1);
      const max = Math.max(Math.min(num_page-1, page+half-1), half + 2);
      for (let i = min; i <= max; i++)
        pagin.push(newItem(i));
  
      if (page < num_page-half) {
        pagin.push(<BootstrapPagination.Ellipsis key='e2' />);
      }
      pagin.push(newItem(num_page));
    }

    return (
      <BootstrapPagination className='justify-content-center'>
        <BootstrapPagination.First onClick={() => this.props.pagecb(1)} disabled={page === 1} />
        <BootstrapPagination.Prev onClick={() => this.props.pagecb(page-1)} disabled={page === 1} />
        {pagin}
        <BootstrapPagination.Next onClick={() => this.props.pagecb(page+1)} disabled={page === num_page} />
        <BootstrapPagination.Last onClick={() => this.props.pagecb(num_page)} disabled={page === num_page} />
      </BootstrapPagination>
    );
  }
}

export default Pagination;