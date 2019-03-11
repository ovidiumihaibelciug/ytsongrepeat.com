import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { canUseDOM } from './functions';

class Portal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    this.el.classList = this.props.className;
    document.body.appendChild(this.el);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.el.classList = nextProps.className;
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  render() {
    if (!canUseDOM) {
      return null;
    }

    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

Portal.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Portal;