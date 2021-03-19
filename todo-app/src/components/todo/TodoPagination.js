import React from 'react';
import PropTypes from 'prop-types';
import LinkButton from '../LinkButton';

const FIRST_PAGE = 1;

const initialState = {
    previousPageLink: undefined,
    nextPageLink: undefined,
    isFirstTime: true,
    isDisplay: false
};

class TodoPagination extends React.Component {
    constructor() {
        super();
        this.state = initialState;
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

        if (!this.state.isFirstTime && prevCurrentPage === currentPage && prevMaxPagesCount === maxPagesCount)
            return;

        const previousPageLink = currentPage <= FIRST_PAGE ? undefined : getLink(currentPage - 1);
        const nextPageLink = currentPage <= maxPagesCount ? undefined : getLink(currentPage + 1);

        this.setState({
            previousPageLink,
            nextPageLink,
            isFirstTime: false,
            isDisplay: true
        });
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