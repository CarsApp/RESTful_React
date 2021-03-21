import React from 'react';
import { DISPLAY_EDITING_ITEM_MODAL, UNKNOWN_ERROR_RESPONSE_CODE } from '../../constants';
import { deleteItem } from '../../services/items';
import { Button, Col, Container, ListGroupItem, Row } from 'react-bootstrap';
import { FaCheck, FaEdit, FaReply, FaTrashAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './TodoItem.scss';

class TodoItem extends React.Component {
    constructor() {
        super();
        this.state = { isUnknownError: false };
        this.handleDeletingItem = this.handleDeletingItem.bind(this);
    }

    handleDeletingItem() {
        deleteItem(this.props.item.id).then(response => {
            if (response.responseCode === UNKNOWN_ERROR_RESPONSE_CODE) {
                this.setState({ isUnknownError: true });
            }
        });
    }

    render() {
        const {
            onDoneChanged,
            onDisplayModalTypeChanged
        } = this.props;

        const {
            id,
            title,
            description,
            done
        } = this.props.item;

        const modalParams = {
            displayModalType: DISPLAY_EDITING_ITEM_MODAL,
            selectedItemId: id
        }

        return (
            <ListGroupItem className="block_item" variant={done ? 'succes' : 'light'}>
                <Container>
                    <Row>
                        <Col className={done ? 'block_item_done' : ''}>
                            <div className='block_item_title'>{title}</div>
                            <div className='block_item_description'>{description}</div>
                        </Col>
                        <Col className='block_item_buttons text-right'>
                            {done ?
                                <Button variant='secondary' onClick={() => onDoneChanged(id, false)}><FaReply /></Button> :
                                <Button variant='success' onClick={() => onDoneChanged(id, true)}><FaCheck /></Button>
                            }
                            <Button variant='info' onClick={() => onDisplayModalTypeChanged(modalParams)}><FaEdit /></Button>
                            <Button variant='danger' onClick={() => this.handleDeletingItem()}><FaTrashAlt /></Button>
                        </Col>
                    </Row>
                </Container>
            </ListGroupItem>
        )
    }
}

TodoItem.propTypes = {
    item: PropTypes.object.isRequired,
    onDoneChanged: PropTypes.func,
    onDisplayModalTypeChanged: PropTypes.func
}

export default TodoItem;