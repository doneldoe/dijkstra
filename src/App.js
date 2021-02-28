import React, { Component } from "react";
import Node from "./components/Node";
import { Dijkstra, getShortestPathOrder } from "./Dijkstra";
import "./App.css";

const START_NODE_ROW = 5;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 15;
const FINISH_NODE_COL = 35;
const ROWS = 20;
const COLS = 50;
let isVisualized = false;

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getStartingGrid = () => {
  const grid = [];
  for (let row = 0; row < ROWS + 1; row++) {
    const currentRow = [];
    for (let col = 0; col < COLS + 1; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const getWalls = (grid, row, col) => {
  const newGrid = [...grid];
  const node = newGrid[row][col];
  newGrid[row][col] = {
    ...node,
    isWall: !node.isWall,
  };
  return newGrid;
};

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      buttonText: "Запустить алгоритм Дейкстры",
      buttonClass: "visualize-btn",
    };
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <div className="content">
        <button className={this.state.buttonClass} onClick={() => this.visualizeDijkstra()}>
          {this.state.buttonText}
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  componentDidMount() {
    const grid = getStartingGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getWalls(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getWalls(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  visualizeDijkstra() {
    this.setState({buttonText: "Очистить", buttonClass: "clear-btn"})
    if (isVisualized) {
      window.location.reload()
    }
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getShortestPathOrder(finishNode);
    console.log(nodesInShortestPathOrder);
    isVisualized = true;
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 10 * i);
    }
  }
}
