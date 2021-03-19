import React from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { DISPLAY_CREATING_LIST_MODAL, UNKNOWN_ERROR_RESPONSE_CODE } from "../../constants";
import { createList } from "../../services/lists";

const initialState = {
    isEmptyDate: false,
    isUnknownError: false,
    isWaitingForResponse: false,
    title: '',
    description: '',
};

class CreatingListModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    handleTitleChange = ({ target: { value } }) => this.setState({ title: value });
    handleDescriptionChange = ({ target: { value } }) => this.setState({ description: value });

    handleCreateList = () => {
        if (this.state.title.length === 0 || this.state.description.length === 0) { //надо исправить
            this.setState({ isEmptyData: true });
            return;
        }

        this.setState({ isWaitingForResponse: true });

        const list = {
            title: this.state.title,
            description: this.state.description,
        };

        // create service
        createList(list).then(response => {
            if (response.responseCode === UNKNOWN_ERROR_RESPONSE_CODE) {
                this.setState({ isUnknownError: true });
            } else {
                this.closeModal();
                this.setState(initialState);
            }
        });
    };

    closeModal() {
        this.props.onModalClose();
    }


    render() {
        const {
            isEmptyData,
            isUnknownError,
            isWaitingForResponse,
            title,
            description
        } = this.state;

        const {
            displayModalType
        } = this.props;

        return (
            <Modal show={displayModalType === DISPLAY_CREATING_LIST_MODAL} onHide={this.closeModal.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new list</Modal.Title>
                </Modal.Header>

                <Modal.Body>
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

                    <Alert show={isEmptyData} variant="danger">
                        Empty values
                    </Alert>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleCreateList} disabled={isWaitingForResponse}>Create</Button>
                </Modal.Footer>
            </Modal>
        )
    }

}

export default CreatingListModal;