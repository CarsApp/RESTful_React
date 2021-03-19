import React from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { AUTHENTICATION_ERROR_RESPONSE_CODE, DISPLAY_SIGN_IN_MODAL, OK_RESPONSE_CODE } from "../../constants";
import { signIn } from "../../services/accounts";


const initialState = {
    isWaitingForResponse: false,
    isError: false,
    username: '',
    password: ''
};

class SignInModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    handleUsernameChange = ({ target: { value } }) => this.setState({ username: value });
    handlePasswordChange = ({ target: { value } }) => this.setState({ password: value });

    handleSignIn = () => {
        if (this.state.username.length === 0 || this.state.password.length === 0) {
            this.setState({ isError: true });
            return;
        }

        this.setState({ isWaitingForResponse: true });

        // sign in service
        signIn(this.state.username, this.state.password).then(({ responseCode }) => {
            switch (responseCode) {
                case OK_RESPONSE_CODE:
                    this.closeModal();
                    break;
                case AUTHENTICATION_ERROR_RESPONSE_CODE:
                    this.setState({ isError: true, isWaitingForResponse: false });
                    break;
                default:
                    break;
            }
        });
    }

    closeModal() {
        this.props.onModalClose();
        this.setState(initialState);
    }

    render() {
        const {
            isWaitingForResponse,
            isError
        } = this.state;

        const {
            displayModalType
        } = this.props;

        return (
            <Modal show={displayModalType === DISPLAY_SIGN_IN_MODAL} onHide={this.closeModal.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" onChange={this.handleUsernameChange} />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" onChange={this.handlePasswordChange} />
                        </Form.Group>
                    </Form>

                    <Alert show={isWaitingForResponse} variant="primary">
                        Account is log in, please wait
                    </Alert>

                    <Alert show={isError} variant="danger">
                        Username or/and password is wrong
                    </Alert>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleSignIn} disabled={isWaitingForResponse}>Sign In</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default SignInModal;