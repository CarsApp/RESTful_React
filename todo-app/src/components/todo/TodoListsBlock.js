import React, { useContext } from 'react';
import { DISPLAY_CREATING_ITEM_MODAL, DISPLAY_EDITING_LIST_MODAL } from '../../constants';
import { deleteList } from '../../services/lists';
import { getItems, itemChanged, updateItem } from '../../services/items';
import { AccordionContext, Button, Container, Row, useAccordionToggle, Col, Card, Accordion, ListGroup } from 'react-bootstrap';
import { FaAngleDown, FaAngleUp, FaEdit, FaTrashAlt } from 'react-icons/fa';
import TodoItem from './TodoItem';
import PropTypes from 'prop-types';
import './TodoListsBlock.scss';


const initialState = {
    isError: false,
    isDisplayItems: false,
    items: []
};

function CustomToggle({ onDisplayModalTypeChanged, listModel }) {
    const currentEventKey = useContext(AccordionContext);
    const decoratedOnClick = useAccordionToggle(listModel.id);

    const isCurrentEventKey = currentEventKey === listModel.id;

    const modalParams = {
        displayModalType: DISPLAY_EDITING_LIST_MODAL,
        selectedListId: listModel.id
    }

    function deletedOnClick() {
        deleteList(listModel.id);
    }

    return (
        <Container>
            <Row>
                <Col>
                    <div>{listModel.title}</div>
                    <div>{listModel.description}</div>
                </Col>
                <Col className='todo_lists_block_buttons text-right'>
                    <Button variant='light' onClick={decoratedOnClick}>{isCurrentEventKey ? <FaAngleUp /> : <FaAngleDown />}</Button>
                    <Button variant='info' onClick={() => onDisplayModalTypeChanged(modalParams)}><FaEdit /></Button>
                    <Button variant='danger' onClick={deletedOnClick}><FaTrashAlt /></Button>
                </Col>
            </Row>
        </Container>
    );
}

class TodoListBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);

        this.handleChangeDoneItem = this.handleChangeDoneItem.bind(this);
        this.updateItems();
    }

    componentDidMount() {
        this.itemChangedSubscriber = itemChanged.subscribe(() => this.updateItems());
    }

    componentWillUnmount() {
        this.itemChangedSubscriber.unsubscribe();
    }

    updateItems() {
        getItems(this.props.element.id).then(items => {
            if (items !== null) {
                this.setState({ items });
            }
        });
    }

    handleChangeDoneItem(id, isDone) {
        const items = this.state.items;
        for (let itemId = 0; itemId < items.length; itemId++) {
            if (items[itemId].id === id) {
                items[itemId].done = isDone;
                updateItem(items[itemId], items[itemId].id);
                break;
            }
        }

        this.setState({ items });
    }

    handleAddingNewItem(listId) {
        this.props.onDisplayModalTypeChanged({
            displayModalType: DISPLAY_CREATING_ITEM_MODAL,
            selectedListId: listId
        });
    }

    render() {
        const {
            isDisplayItems,
            items
        } = this.state;

        const {
            id,
        } = this.props.element;

        const onDisplayModalTypeChanged = this.props.onDisplayModalTypeChanged;

        const blockItemClassNames = ['container_lists'];

        if (isDisplayItems)
            blockItemClassNames.push('container_lists_active');

        return (
            <Card>
                <Card.Header>
                    <CustomToggle listModel={this.props.element} onDisplayModalTypeChanged={onDisplayModalTypeChanged} />
                    <Accordion.Collapse eventKey={id}>
                        <Card.Body>
                            <Button variant='primary' block onClick={() => this.handleAddingNewItem(id)}>Add a new Item</Button>
                            <ListGroup className='list_items'>
                                {items.map(item =>
                                    <TodoItem key={item.id} item={item} onDoneChanged={this.handleChangeDoneItem} onDisplayModalTypeChanged={onDisplayModalTypeChanged} />
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card.Header>
            </Card>
        );
    }
}

TodoListBlock.propTypes = {
    element: PropTypes.object.isRequired,
    onDisplayModalTypeChanged: PropTypes.func
}

export default TodoListBlock;