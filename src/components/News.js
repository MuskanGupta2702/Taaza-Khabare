import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {

  static defaultProps = {
    country: 'in',
    pageSize: 9,
    category: 'general'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }

  articles = [];

  capitalizeFirstLetter = (string1) => {
    return string1[0].toUpperCase() + string1.substring(1)
  }


  constructor(props) {
    super(props);
    console.log('This is a constructor from News Component');
    this.state = {
      articles: this.articles,
      loading: true,
      page: 1,
      totalResults: 0
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async updateNews() {
    this.props.setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=1&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({ articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updateNews();
  }

  // handleNextClick = async () => {
  //   this.setState({ page: this.state.page + 1 });
  //   this.updateNews();
  // }

  // handlePrevClick = async () => {
  //   this.setState({ page: this.state.page - 1 });
  //   this.updateNews();
  // }

  fetchMoreData = async() => {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=1&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({ articles: this.state.articles.concat(parsedData.articles), totalResults: parsedData.totalResults});
  };

  render() {
    return (
      <>
        <h2 className='text-center my-3'>NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h2>
        {this.state.loading && <Spinner />}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        >
          <div className='container my-3'>
            <div className="row">
              {this.state.articles.map((element) => {
                return <div className="col-md-4" key={element.url}>
                  <NewsItem source={element.source.name} author={element.author} date={element.publishedAt} title={element.title ? element.title.slice(0, 45) : ''} description={element.description ? element.description.slice(0, 88) : ''} imageUrl={element.urlToImage ? element.urlToImage : 'https://usrimg-full.fark.net/P/P2/fark_P28rgmW6AxzjikOOVagzaS68L6Q.jpg?AWSAccessKeyId=HBAYEKZHGUB4NAYQBVSQ&Expires=1655092800&Signature=QxFlMiKbADHtgovQC0PFBtXtZYk%3D'} url={element.url} />
                </div>
              })}
            </div>
          </div>
        </InfiniteScroll>
        {/* <div className="d-flex justify-content-between">
          <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
          <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div> */}
      </>
    )
  }
}

export default News
