import React from 'react';
import ReactDOM from 'react-dom';
import Square from './square'
import Row from './row'
import './index.css';
import GameController from './gameController'
/** TODO
1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
5. When someone wins, highlight the three squares that caused the win.
*/


const ResetButton = (props) => <button onClick={props.onClick}>Reset The Game</button>

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={Number.isInteger(this.props.squares[i]) ? '' : this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRows(){
    let currentSquares = [],
        rows = [];

    for (let x = 0; x < 9; x++){
      currentSquares.push(x);
      if ( (x + 1) % 3 === 0){
        rows.push( currentSquares.map( (x) => this.renderSquare(x)))
        currentSquares = [];
      }
    }
    return rows.map( (row, index) => <Row key={index}>{row}</Row>)
  }

  render() {
    return (
      <div>
        {this.renderRows()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: ['X', 'O', 'X', 'O', 'X', 'O', 6, 7, 8],
        nextMove: 'X'
      }],
      nextMove: 'X',
      stepNumber: 0,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      nextMove: this.state.history[step].nextMove
    });
  }

  testing(){
    const selectedState = this.state.history[this.state.stepNumber].squares;
    alert('Empty squares' + this.findEmptySquares(selectedState).join().toString())
    console.log('findEmptySquares()', this.findEmptySquares(selectedState));
  }

  findEmptySquares(board=[]){
    return board.filter( square => Number.isInteger(square))
  }

  selectSquare(i) {
    const history = this.state.history;
    const currentState = history[history.length - 1];
    const squares = currentState.squares.slice();
    if (GameController.calculateWinner(squares) || !squares[i] === null) {
      return;
    }
    let nextMove = this.state.nextMove === 'X' ? 'O' : 'X';

    squares[i] = this.state.nextMove
    this.setState({
      history: history.concat([{
        squares: squares,
        nextMove: nextMove
      }]),
      stepNumber: history.length,
      nextMove: nextMove
    });
  }

  resetGame(){
    this.setState({
      history: [{
        squares: Array(9).fill(0).map( (val, index) => index),
        nextMove: 'X'
      }],
      nextMove: 'X',
      stepNumber: 0,
    }, () => console.log('board', this.state.history[0].squares) )
  }

  render() {
    const history = this.state.history;
    const selectedState = history[this.state.stepNumber];
    const isWinner = GameController.calculateWinner(selectedState.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status = isWinner ? 'Winner is ' + (this.state.nextMove === 'X' ? 'O' : 'X') : 'Next move: ' + (this.state.nextMove)

    return (
      <div className='game'>
        <div className='game-board'>
          <Board squares={selectedState.squares} onClick={(i) => this.selectSquare(i)}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <ResetButton onClick={() => this.resetGame()} />
          <button onClick={() => this.testing()}>Test</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
