import React from 'react';

export default class SubItem extends React.Component {
    constructor() {
        super();
        this.state = {
            active: null
        }
    }

    render() {
        return this.props.children;
    }
}
