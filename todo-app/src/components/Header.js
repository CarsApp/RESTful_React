import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import React from 'react';
import { DISPLAY_SIGN_IN_MODAL, DISPLAY_SIGN_UP_MODAL } from '../constants';
import { logout, usernameChanged } from '../services/accounts';
import './Header.scss';

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            username: localStorage.getItem('Username') || ''
        }
    }

    componentDidMount() {
        this.usernameChangedSubscriber = usernameChanged.subscribe(username => this.setState({ username }));
    }

    componentWillUnmount() {
        this.usernameChangedSubscriber.unsubscribe();
    }

    handleLogOut() {
        logout();
    }

    render() {
        const {
            isLoggedIn,
            onDisplayModalTypeChanged
        } = this.props;

        return (
            <Navbar bg='dark' variant='dark'>
                <Container>
                    <Navbar.Brand>ToDo App</Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav className='mr-auto'></Nav>
                        <Nav>
                            {isLoggedIn ?
                                <>
                                    <h1>Hello {this.state.username}</h1>
                                    <Button variant='danger' className='mr-sm-2' onClick={this.handleLogOut}>Log Out</Button>
                                </> :
                                <>
                                    <Button variant='primary' className='mr-sm-2' onClick={() => onDisplayModalTypeChanged(DISPLAY_SIGN_UP_MODAL)}>Sign Up</Button>
                                    <Button variant='primary' className='mr-sm-2' onClick={() => onDisplayModalTypeChanged(DISPLAY_SIGN_IN_MODAL)}>Sign In</Button>
                                </>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default Header;