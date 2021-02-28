import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
    render() {
        const {
            col,
            row,
            isStart,
            isFinish,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
        } = this.props;
        let addedClass;
        if (isFinish)
            addedClass = 'node-finish';
        else if (isStart)
            addedClass = 'node-start';
        else if (isWall)
            addedClass = 'node-wall';
        else
            addedClass = '';

        return (
            <div
                id={`node-${row}-${col}`}
                className={`node ${addedClass}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}></div>
        );
    }
}