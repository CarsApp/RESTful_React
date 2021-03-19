import { Alert, Button, Form, Modal } from 'react-bootstrap';
import React from 'react';
import { getListById, updateList } from '../../services/lists';
import { DISPLAY_EDITING_LIST_MODAL, INVALID_ID_ERROR_RESPONSE_CODE, OK_RESPONSE_CODE, UNKNOWN_ERROR_RESPONSE_CODE, WITHOUT_MODAL } from '../../constants';

const initialState = {
    isUnknownError: false,
    isWaitingForRequest: false,
    isWaitingForResponse: false,
    isInvalidIdError: false,
    title: '',
    description: '',
}

class EditingListModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    handleTitleChange = ({ target: { value } }) => this.setState({ title: value });
    handleDescriptionChange = ({ target: { value } }) => this.setState({ description: value });

    handleUpdateList = () => {
        this.setState({ isWaitingForResponse: true });

        const list = {
            title: this.state.title,
            description: this.state.description,
        }

        updateList(list, this.props.selectedListId).then(response => {
            if (response.responseCode === UNKNOWN_ERROR_RESPONSE_CODE) {
                this.setState({ isUnknownError: true });
            } else {
                this.closeModal();
                this.setState(initialState);
            }
        })
    };


    closeModal() {
        this.props.onModalClose();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.displayModalType === WITHOUT_MODAL && this.props.displayModalType === DISPLAY_EDITING_LIST_MODAL) {
            this.setState({
                isWaitingForRequest: true,
                isWaitingForResponse: false,
                isInvalidIdError: false,
                isUnknownError: false
            });
            getListById(this.props.selectedListId).then(response => {
                switch (response.responseCode) {
                    case OK_RESPONSE_CODE:
                        this.setState({
                            isWaitingForRequest: false,
                            title: response.list.title,
                            description: response.list.description,
                        });
                        break;
                    case INVALID_ID_ERROR_RESPONSE_CODE:
                        this.setState({
                            isWaitingForRequest: false,
                            isInvalidIdError: true
                        });
                        break;
                    default:
                        break;
                }
            });
        }
    }


    render() {
        const {
            isUnknownError,
            isWaitingForResponse,
            isInvalidIdError,
            title,
            description,
        } = this.state;

        const {
            displayModalType
        } = this.props;

        return (
            <Modal show={displayModalType === DISPLAY_EDITING_LIST_MODAL} onHide={this.closeModal.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update list</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isInvalidIdError ?
                        <p>List is not found from server, please refresh browser</p> :
                        <>
                            <Form>
                                <Form.Group controlId="title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" value={title} onChange={this.handleTitleChange} />
                                </Form.Group>

                                <Form.Group controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" value={description} onChange={this.handleDescriptionChange} rows={3} />
                                </Form.Group>
                            </Form>

                            <Alert show={isWaitingForResponse} variant="primary">
                                List is creating, please wait
                            </Alert>

                            <Alert show={isUnknownError} variant="danger">
                                Unknown error of creating list
                            </Alert>
                        </>
                    }


                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleUpdateList} disabled={isWaitingForResponse}>Update</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default EditingListModal;