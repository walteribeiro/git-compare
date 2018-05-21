import React, { Component } from 'react';
import moment from 'moment';
import { Container, Form } from './styles';
import CompareList from '../../components/CompareList';
import api from '../../services/api';

import logo from '../../assets/logo.png';

export default class Main extends Component {
  state = {
    repositoryInput: '',
    repositoryError: false,
    loading: false,
    repositories: [],
  };

  handleAddRepository = async (evt) => {
    evt.preventDefault();
    this.setState({ loading: true });

    try {
      const { data: repository } = await api.get(`/repos/${this.state.repositoryInput}`);
      repository.lastCommit = moment(repository.pushed_at).fromNow();

      this.setState({
        repositoryInput: '',
        repositoryError: false,
        repositories: [...this.state.repositories, repository],
      });
    } catch (err) {
      this.setState({
        repositoryError: true,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Container>
        <img src={logo} alt="Github Compare" />
        <Form hasError={this.state.repositoryError} onSubmit={this.handleAddRepository}>
          <input
            aria-label="user/repository"
            type="text"
            placeholder="user/repository"
            value={this.state.repositoryInput}
            onChange={evt => this.setState({ repositoryInput: evt.target.value })}
          />
          <button type="submit">
            {this.state.loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}
          </button>
        </Form>

        <CompareList repositories={this.state.repositories} />
      </Container>
    );
  }
}
