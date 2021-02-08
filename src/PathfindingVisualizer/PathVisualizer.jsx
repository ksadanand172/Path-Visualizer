import React, { Component } from 'react';
import Node from './Node/Node.jsx';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathVisualizer.css'

//defining grid size
const max_row_length=20;
const max_col_length=40;

//defining default source and destination points
let START_NODE_ROW = 10;
let START_NODE_COL = 9;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 30;

export default class PathVisualizer extends Component{
    constructor(props) {
        super(props);
        this.state = {
          grid: [],
          mouseIsPressed: false,
          topMessage: "Dijkstra Algorithm",
          rate: 1,     //algorithm speed-rate variable
          weight: 1,
          changeWeight: false,
          distanceToBeTraveled: 0,
        };
    }
      
    componentDidMount() {    //creating grid
        const grid = getInitialGrid();
        this.setState({grid});
    }
    
    //on pressing the mouse button down
    handleMouseDown(row, col) { 
        if(this.state.topMessage !== "Dijkstra Algorithm") return;

        let newGrid = [];
        if(this.state.changeWeight){
            newGrid = getNewGridWithWeightToggled(
                this.state.grid,
                row,
                col, 
                this.state.weight
            );
        }
        else{
            newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        }

        this.setState({grid: newGrid, mouseIsPressed: true});
    }
    
    //useful only when hovering above an element while mouse-down
     handleMouseEnter(row, col) {
        if(this.state.topMessage !== "Dijkstra Algorithm") return;
        if (!this.state.mouseIsPressed) return;

        let newGrid = [];
        if(this.state.changeWeight){
            newGrid = getNewGridWithWeightToggled(
                this.state.grid,
                row,
                col, 
                this.state.weight,
            );
        }
        else{
            newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        }

        this.setState({grid: newGrid, mouseIsPressed: true});
    }
    
    //after releasing the mouse button
    handleMouseUp() { 
        if(this.state.topMessage !=="Dijkstra Algorithm") return;
        this.setState({ mouseIsPressed: false });
    }
    
    //visualizing of animation call starts here after click
    visualizeDijkstra() {
        this.setState({ topMessage: "Creator : K. Sadanand"});
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);  //get all visited nodes from Algo
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode); //get all shortest path node
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, this.state.rate); //to animate
    }

    //animation of visited nodes by dijkstra algo
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, rate) {
        for (let i = 1; i <= visitedNodesInOrder.length; i++) {
            //fixing the rate of the algo
            let r= parseInt(rate);

            //if we reached at the destination
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.setState({ topMessage: "Shortest Path"});
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, Math.pow(2, r - 1) * 10 * i); 
                return;
            }
            
            //to leave the exact destination point
            if( i === visitedNodesInOrder.length -1) continue;

            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if(node.isWeight) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visitedWeight';
                }
                else {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
                }
            }, Math.pow(2, r - 1) * 10 * i);
        }
    }

    //animation of shortest path b/w start and end point
    animateShortestPath(nodesInShortestPathOrder) {
        let timeTaken = 0;
        for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                if(nodesInShortestPathOrder[i].isWeight) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-pathWeight';
                }
                else {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
                }
            }, 50 * i);
        }

        //assuming 1 unit distance === 1 unit time
        timeTaken = nodesInShortestPathOrder[nodesInShortestPathOrder.length - 1].distance; 
        this.setState({ distanceToBeTraveled: timeTaken});
    }
    
    //weight changer button
    weightChangeHandler = (event) => {
        this.setState({ weight: event.target.value });
    }; 

    //handling rate of speed 
    rateChangeHandler = (event) => {
        this.setState({ rate: event.target.value });
    };

    //source and destination point changer button
    pointChangeHandler = () => {
        if(this.notCorrect()) return; //to check input is valid or not

        document.getElementById(
            `node-${START_NODE_ROW}-${START_NODE_COL}`
        ).className = "node";
        document.getElementById(
            `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
        ).className = "node";
        
        START_NODE_ROW = parseInt(document.getElementById("start_row").value);
        START_NODE_COL = parseInt(document.getElementById("start_col").value);
        FINISH_NODE_ROW = parseInt(document.getElementById("end_row").value);
        FINISH_NODE_COL = parseInt(document.getElementById("end_col").value);

        document.getElementById(
            `node-${START_NODE_ROW}-${START_NODE_COL}`
        ).className = 'node node-start';
        document.getElementById(
            `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
        ).className = 'node node-finish';
    };
    
    //wrong input possiblities
    notCorrect = () => {
        if(
            isNaN(parseInt(document.getElementById("start_row").value)) ||
            isNaN(parseInt(document.getElementById("start_col").value)) ||
            isNaN(parseInt(document.getElementById("end_row").value))  ||
            isNaN(parseInt(document.getElementById("end_col").value))
        )
        return true;

        if(
            parseInt(document.getElementById("start_row").value) > max_row_length ||
            parseInt(document.getElementById("start_col").value) > max_col_length
        )
        return true;

        if(
            parseInt(document.getElementById("start_row").value) < 0 ||
            parseInt(document.getElementById("start_col").value) < 0
        )
        return true;

        if(
            parseInt(document.getElementById("end_row").value) > max_row_length ||
            parseInt(document.getElementById("end_col").value) > max_col_length
        )
        return true;

        if(
            parseInt(document.getElementById("end_row").value) < 0 ||
            parseInt(document.getElementById("end_col").value) < 0
        )
        return true;

       return false;
    };

    toggleWeight = () => {
        const temp = this.state.changeWeight;
        this.setState({ changeWeight: !temp});
    };

    render() {
        const {
            grid, 
            mouseIsPressed, 
            topMessage, 
            distanceToBeTraveled,
        } = this.state;
    
        let button_task = (
            <p className = "btn" onClick={() => this.visualizeDijkstra()}>
                Start Path Visualizer
            </p>
        );

        //after visualizing the shortest path
        if( topMessage === "Shortest Path"){  
            button_task = (
                <h2 
                    className = "btn"
                    href = "#"  //to hyperlink the top link of the window
                    onClick = {() => window.location.reload(false)} 
                >
                    Reset to Default <br/>
                    Distance : {distanceToBeTraveled}
                    <small> [1 Block = 1 Weight = 1 Time] </small>
                </h2>
            );
        }
        else if (topMessage === "Creator : K. Sadanand") { 
            button_task = <h3  className = "running">
                Running...
            </h3>
        }

        let changeWeightText = "OFF";
        if(this.state.changeWeight) changeWeightText = "ON";

        let textBox = (
            <div className = "textBox">
                
                <div className = "weightContainer">
                    <label htmlFor = "quantity"> Set Weight : </label>

                    <input 
                       type = "number"
                       id = "quantity"
                       name = "quantity"
                       min = "1"
                       max = "5"
                       onChange = {this.weightChangeHandler}
                       defaultValue = "1"
                    />

                    <button onClick = {this.toggleWeight}> {changeWeightText} </button>
                </div>

                <div className = "rateChangeContainer">
                    <label htmlFor = "speed"> Algo Speed : </label>
                    <input 
                       type = "number"
                       name = "speed"
                       id = "speed"
                       min = "1"
                       max = "5"
                       onChange = {this.rateChangeHandler}
                       defaultValue = "1"
                    />
                </div>

                <div className = "buttonContainer"> {button_task} </div>

                <div className = "startPointContainer">
                    <label htmlFor = "point"> Start Point : </label>

                    <input 
                       type = "number"
                       name = "point"
                       id = "start_row"
                       min = "0"
                       max = {max_row_length - 1}
                       onChange = {this.pointChangeHandler}
                       defaultValue = "10"
                    ></input>
                    <input 
                       type = "number"
                       name = "point"
                       id = "start_col"
                       min = "0"
                       max = {max_col_length - 1}
                       onChange = {this.pointChangeHandler}
                       defaultValue = "9"
                    ></input>
                </div>

                <div className = "endPointContainer">
                    <label htmlFor = "point"> End Point : </label>

                    <input 
                       type = "number"
                       name = "point"
                       id = "end_row"
                       min = "0"
                       max = {max_row_length - 1}
                       onChange = {this.pointChangeHandler}
                       defaultValue = "10"
                    ></input>
                    <input 
                       type = "number"
                       name = "point"
                       id = "end_col"
                       min = '0'
                       max = {max_col_length - 1}
                       onChange = {this.pointChangeHandler}
                       defaultValue = '30'
                    ></input>
                </div>

            </div>
        );

        if(topMessage === "Creator : K. Sadanand") {
            textBox = null;
        }
        else if (topMessage === "Shortest Path") {
            textBox = (
                <div 
                   className = "buttonContainer"
                   style = {{ width: "30%", margin: "0 auto" }}
                >
                    {button_task}
                </div>
            );
        }

        return (
            <div className = "pathfindingVisualizer">
                <div className = "container">
                    <div className = "heading">
                        {/* <h2 onClick = {showPopUp}> Help? </h2> */}
                        <h2> {topMessage} </h2>
                    </div>

                    {/* to show the header on the page */}
                    {textBox}

                    <p>
                        Dijkstra's Algorithm is <i>weighted</i> and <i>guarantees</i> the shortest path! {" "}
                        <span className = "ref"></span>
                    </p>
                </div>

                <div className = "visualGridContainer">
                    <div className = "gridBox">
                        <table className = "grid" style = {{borderSpacing: '0px'}}>
                            <tbody>
                                {grid.map((row, rowIdx) => {
                                    return (
                                        <tr key = {rowIdx}>
                                            {row.map((node, nodeIdx) => {
                                                const { isStart, isFinish, isWall, isWeight} = node;
                                                return (
                                                    <Node
                                                       row = {rowIdx}
                                                       col = {nodeIdx}
                                                       key = {rowIdx + "-" +nodeIdx}
                                                       isStart = {isStart}
                                                       isFinish = {isFinish}
                                                       isWeight = {isWeight}
                                                       isWall = {isWall}
                                                       mouseIsPressed = {mouseIsPressed}
                                                       onMouseDown = {(row, col) =>
                                                        this.handleMouseDown(row, col)
                                                       }
                                                       onMouseEnter = {(row, col) =>
                                                        this.handleMouseEnter(row, col)
                                                       }
                                                       onMouseUp = {() => this.handleMouseUp()}
                                                    ></Node>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}


const getInitialGrid = () => {    //creating 2D grid 
    const grid=[];
    for(let row=0; row < max_row_length; row++){
        const currRow = [];
        for(let col=0; col < max_col_length; col++){
            currRow.push(createNode(row, col));
        }
        grid.push(currRow);
    }
    return grid;
};

const createNode = (row, col) => {  //defines properties of every node (like struct)
    return {
        row,
        col,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        isWeight: false,
        previousNode: null,
        weight: 0,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = [...grid];      //wall and not wall two regions seperated
    const node= newGrid[row][col];
    const newNode = {
        ...node,    //copying other properties of node
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithWeightToggled = (grid, row, col, weight) => {
    const newGrid = [...grid];    
    const node= newGrid[row][col];
    const newNode = {
        ...node,    //copying other properties of node
        isWeight: !node.isWeight,
        weight: parseInt(weight),   //parseInt parses input in form of string 
                                     //and returns int of (input) or NaN
    };
    newGrid[row][col] = newNode;
    return newGrid;
};