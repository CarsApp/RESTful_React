import React from 'react';
import { DISPLAY_CREATING_LIST_MODAL, LIMIT_LISTS_IN_PAGE } from '../../constants';
import { getListsByPage, listChanged } from '../../services/lists';
import { Accordion, Button } from 'react-bootstrap';
import TodoPagination from './TodoPagination';
import TodoListBlock from './TodoListsBlock';
import { withRouter } from 'react-router-dom';

const FIRST_PAGE = 1;

class TodoLists extends React.Component {
    constructor(props) {
        super(props);

        const page = props.match.params.page ? +props.match.params.page : FIRST_PAGE;

        this.state = {
            page: page,
            maxPage: page,
            lists: []
        };

        if (this.props.isLoggedIn)
            this.updateLists();
    }


    componentDidMount() {
        this.listsChangedSubscriber = listChanged.subscribe(() => this.updateLists());
    }

    componentWillUnmount() {
        this.listsChangedSubscriber.unsubscribe();
    }

    componentDidUpdate(prevProps) {
        const {
            isLoggedIn,
            location
        } = this.props;

        const {
            isLoggedIn: prevIsLoggedIn,
            location: prevLocation
        } = prevProps;

        if (isLoggedIn && prevIsLoggedIn !== isLoggedIn) {
            this.updateLists();
        }

        if (location.pathname !== prevLocation.pathname) {
            const page = this.props.match.params.page ? +this.props.match.params.page : FIRST_PAGE;
            this.setState({ page });
            this.updateLists();
        }
    }

    updateLists() {
        const page = this.props.match.params.page ? +this.props.match.params.page : FIRST_PAGE;
        getListsByPage(page).then(response => {
            if (response.data === undefined && response.count === undefined)
                return;
            const maxPage = Math.ceil(response.count / LIMIT_LISTS_IN_PAGE);
            this.setState({ lists: response.data, maxPage });
        })
    }

    render() {
        const {
            page,
            maxPage,
            lists
        } = this.state;

        const {
            isLoggedIn,
            onDisplayModalTypeChanged
        } = this.props;

        return (
            <div className='todo_lists'>
                {isLoggedIn &&
                    <div>
                        <Button variant='primary' block onClick={() => onDisplayModalTypeChanged({ displayModalType: DISPLAY_CREATING_LIST_MODAL })}>Add a new list</Button>
                        <Accordion defaultActiveKey='0'>
                            {lists.map(element => <TodoListBlock key={element.id} element={element} onDisplayModalTypeChanged={onDisplayModalTypeChanged} />)}
                        </Accordion>
                        <TodoPagination currentPage={page} maxPagesCount={maxPage} />
                    </div>}
            </div>
        )
    }
}

export default withRouter(TodoLists);