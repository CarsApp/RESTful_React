import { Alert, Button, Form, Modal } from 'react-bootstrap';
import React from 'react';
import { getItemById, updateItem } from '../../services/items';
import { DISPLAY_EDITING_ITEM_MODAL, INVALID_ID_ERROR_RESPONSE_CODE, OK_RESPONSE_CODE, UNKNOWN_ERROR_RESPONSE_CODE, WITHOUT_MODAL } from '../../constants';

const initialState = {
    // isEmptyDate: false,
    isUnknownError: false,
    isWaitingForRequest: false,
    isWaitingForResponse: false,
    isInvalidIdError: false,
    title: '',
    description: '',
}

class EditingItemModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    handleTitleChange = ({ target: { value } }) => this.setState({ title: value });
    handleDescriptionChange = ({ target: { value } }) => this.setState({ description: value });

    handleUpdateItem = () => {
        this.setState({ isWaitingForResponse: true });

        const item = {
            title: this.state.title,
            description: this.state.description,
        }

        updateItem(item, this.props.selectedItemId).then(response => {
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
        if (prevProps.displayModalType === WITHOUT_MODAL && this.props.displayModalType === DISPLAY_EDITING_ITEM_MODAL) {
            this.setState({ isWaitingForRequest: true });
            getItemById(this.props.selectedItemId).then(response => {
                switch (response.responseCode) {
                    case OK_RESPONSE_CODE:
                        this.setState({
                            isWaitingForRequest: false,
                            title: response.item.title,
                            description: response.item.description,
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
            <Modal show={displayModalType === DISPLAY_EDITING_ITEM_MODAL} onHide={this.closeModal.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update item</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isInvalidIdError ?
                        <p>Item is not found from server, please refresh browser</p> :
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
                                Item is creating, please wait
                            </Alert>

                            <Alert show={isUnknownError} variant="danger">
                                Unknown error of creating item
                            </Alert>
                        </>
                    }


                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleUpdateItem} disabled={isWaitingForResponse}>Update</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default EditingItemModal;