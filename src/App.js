import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";

// Components
import Sidebar from "./Sidebar";
import Loading from "./Loading";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";
import BookList from "./BookList";

const instance = axios.create({
  baseURL: "https://the-index-api.herokuapp.com"
});

class App extends Component {
  state = {
    authors: [],
    loading: true,
    booksLoading: true,
    books: []
  };

  fetchAuthors = async () => {
    this.setState({
      loading: true
    });
    try {
      const res = await instance.get("/api/authors/");
      let authors = res.data;
      this.setState({
        authors: authors,
        loading: false
      });
    } catch (err) {
      console.error(err);
    }
  };

  fetchBooks = async () => {
    this.setState({
      loading: true
    });
    try {
      const response = await instance.get("/api/books/");
      let books = response.data;
      this.setState({
        books: books,
        loading: false
      });
    } catch (err) {
      console.error(err);
    }
  };
  async componentDidMount() {
    await this.fetchAuthors();
    await this.fetchBooks();
  }

  getView = () => {
    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <Switch>
          <Redirect exact from="/" to="/authors" />
          <Route path="/authors/:authorID" component={AuthorDetail} />
          <Route
            path="/authors"
            render={props => (
              <AuthorsList {...props} authors={this.state.authors} />
            )}
          />
          <Route
            path="/books"
            render={props => <BookList {...props} books={this.state.books} />}
          />
        </Switch>
      );
    }
  };

  render() {
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar />
          </div>
          <div className="content col-10">{this.getView()}</div>
        </div>
      </div>
    );
  }
}

export default App;
