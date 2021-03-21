import React from 'react';
import PropTypes from 'prop-types';
import LinkButton from '../LinkButton';
import './TodoPagination.scss';

const FIRST_PAGE = 1;

class TodoPagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getUpdatedState(props);
    }

    getUpdatedState(props) {
        const {
            currentPage,
            maxPagesCount,
        } = props;

        const previousPageLink = currentPage <= FIRST_PAGE ? undefined : getLink(currentPage - 1);
        const nextPageLink = currentPage <= maxPagesCount ? undefined : getLink(currentPage + 1);

        return {
            previousPageLink,
            nextPageLink,
        };
    }

    componentDidUpdate(prevProps) {
        const {
            currentPage: prevCurrentPage,
            maxPagesCount: prevMaxPagesCount,
        } = prevProps;

        const {
            currentPage,
            maxPagesCount,
        } = this.props;

        if (prevCurrentPage === currentPage && prevMaxPagesCount === maxPagesCount)
            return;

        this.setState(this.getUpdatedState(this.props));
    }

    render() {
        const {
            previousPageLink,
            nextPageLink,
            isDisplay
        } = this.state;

        const {
            currentPage,
            maxPagesCount,
        } = this.props;

        return (
            <div>
                {isDisplay &&
                    <div className='todo_pagination'>
                        <LinkButton link={previousPageLink} title='Previous' />
                        <span>{currentPage} of {maxPagesCount}</span>
                        <LinkButton link={nextPageLink} title='Next' />
                    </div>
                }
            </div>
        )
    }
}

const getLink = page => `/page/${page}`;

TodoPagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    maxPageCount: PropTypes.number.isRequired
}

export default TodoPagination;