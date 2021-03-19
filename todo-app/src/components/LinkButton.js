import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class LinkButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
    }

    render() {
        const {
            title,
            link
        } = this.props;

        const isDisabled = link === undefined;
        const button = <Button variant='primary' disabled={isDisabled} onClick={this.handleClick}>{title}</Button>

        return !isDisabled ? <Link to={link} className='btn btn-primary'>{title}</Link> : button;
    }
}

LinkButton.propTypes = {
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
}

export default LinkButton;