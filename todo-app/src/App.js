import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import TodoLists from './components/todo/TodoLists';
import { WITHOUT_MODAL } from './constants';
import { isLoggedInChanged } from './services/accounts';
import SignInModal from './components/modals/SignInModal';
import SignUpModal from './components/modals/SignUpModal';
import CreatingItemModal from './components/modals/CreatingItemModal';
import CreatingListModal from './components/modals/CreatingListModal';
import EditingItemModal from './components/modals/EditingItemModal';
import EditingListModal from './components/modals/EditingListModal';


class App extends React.Component {
  constructor() {
    super();

    const accountToken = localStorage.getItem('Authorization');

    this.state = {
      isLoggedIn: accountToken !== null,
      displayModalType: WITHOUT_MODAL
    };
  }


  handleDisplayModalTypeChanged = displayModalType => this.setState({ displayModalType });
  handleDisplayModalTypeWithParamsChanged = params => {
    const newState = {};

    if (params.displayModalType !== undefined)
      newState.displayModalType = params.displayModalType;

    if (params.selectedListId !== undefined)
      newState.selectedListId = params.selectedListId;

    if (params.selectedItemId !== undefined)
      newState.selectedItemId = params.selectedItemId;

    this.setState(newState);
  };

  handleModalClose = () => this.setState({ displayModalType: WITHOUT_MODAL });

  componentDidMount() {
    this.isLoggedInChangedSubscriber = isLoggedInChanged.subscribe(isLoggedIn => this.setState({ isLoggedIn }));
  }

  componentWillUnmount() {
    this.isLoggedInChangedSubscriber.unsubscribe();
  }

  render() {
    const {
      isLoggedIn,
      displayModalType,
      selectedListId,
      selectedItemId
    } = this.state;

    return (
      <Router>
        <Header isLoggedIn={isLoggedIn} onDisplayModalTypeChanged={this.handleDisplayModalTypeChanged} />
        <Container>
          <Switch>
            <Route path="/page/:page">
              <TodoLists isLoggedIn={isLoggedIn} onDisplayModalTypeChanged={this.handleDisplayModalTypeWithParamsChanged} />
            </Route>
            <Route path="/">
              <TodoLists isLoggedIn={isLoggedIn} onDisplayModalTypeChanged={this.handleDisplayModalTypeWithParamsChanged} />
            </Route>
          </Switch>
        </Container>

        <SignInModal displayModalType={displayModalType} onModalClose={this.handleModalClose} />
        <SignUpModal displayModalType={displayModalType} onModalClose={this.handleModalClose} />
        <CreatingListModal displayModalType={displayModalType} onModalClose={this.handleModalClose} />
        <EditingListModal displayModalType={displayModalType} onModalClose={this.handleModalClose} selectedListId={selectedListId} />
        <CreatingItemModal displayModalType={displayModalType} onModalClose={this.handleModalClose} selectedListId={selectedListId} />
        <EditingItemModal displayModalType={displayModalType} onModalClose={this.handleModalClose} selectedItemId={selectedItemId} />
      </Router>
    );
  }
}

export default App;
