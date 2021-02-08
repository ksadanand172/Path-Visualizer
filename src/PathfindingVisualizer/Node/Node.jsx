import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
  constructor(props) {
      super(props);
      this.state = {};
  }

  render() {
    const {
      row,  
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      isWeight,
    } = this.props;

    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : isWeight
      ? 'node-weight'
      : '';

    return (
      <td
        id={`node-${row}-${col}`}                 // td to create the proper grid (td--> tabular data) 
        className={`node ${extraClassName}`}     //all these three mouse events are made for creating wall
        onMouseDown={() => onMouseDown(row, col)}    //when you press your mouse button
        onMouseEnter={() => onMouseEnter(row, col)}  //hovering above the element while onMouseDown
        onMouseUp={() => onMouseUp()}               //when you release the button
        ></td>  
    );
  }
}