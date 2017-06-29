import React from 'react';

export default class Item extends React.Component {
    constructor() {
        super();
    }

    render() {
        return this.props.children;
    }
}
