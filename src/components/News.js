import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export class News extends Component {

  static defaultProps = {
    country: 'in',
    pageSize: 9,
    category: 'general'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category : PropTypes.string,
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
      loading: false,
      page: 1
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async updateNews() {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0c4a8e73d9b547b29c8d2a8bb9421679&page=1&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({ articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false });
  }

  async componentDidMount() {
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0c4a8e73d9b547b29c8d2a8bb9421679&page=1&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({ articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false });
  }

  handleNextClick = async () => {
      this.setState({page: this.state.page + 1});
      this.updateNews();
    }

  handlePrevClick = async () => {
    this.setState({page: this.state.page - 1});
    this.updateNews();
  }

  render() {
    return (
      <div className='container my-3'>
        <h2 className='text-center my-3'>NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h2>
        {this.state.loading && <Spinner />}
        {!this.state.loading &&
          <div className="row">
            {this.state.articles.map((element) => {
              return <div className="col-md-4" key={element.url}>
                <NewsItem source={element.source.name} author={element.author} date={element.publishedAt} title={element.title ? element.title.slice(0, 45) : ''} description={element.description ? element.description.slice(0, 88) : ''} imageUrl={element.urlToImage ? element.urlToImage : 'https://usrimg-full.fark.net/P/P2/fark_P28rgmW6AxzjikOOVagzaS68L6Q.jpg?AWSAccessKeyId=HBAYEKZHGUB4NAYQBVSQ&Expires=1655092800&Signature=QxFlMiKbADHtgovQC0PFBtXtZYk%3D'} url={element.url} />
              </div>
            })}
          </div>
        }
        <div className="d-flex justify-content-between">
          <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
          <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div>
      </div>
    )
  }
}

export default News
