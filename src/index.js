import React from 'react';
import ReactDOM from 'react-dom';
import Square from './square'
import Row from './row'
import './index.css';

/** TODO
1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
5. When someone wins, highlight the three squares that caused the win.
*/


class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
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
        squares: Array(9).fill(null),
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

  squareIsEmpty(square){
    return square === null
  }

  handleClick(i) {
    const history = this.state.history;
    const currentState = history[history.length - 1];
    const squares = currentState.squares.slice();
    if (calculateWinner(squares) || !this.squareIsEmpty(squares[i])) {
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
        squares: Array(9).fill(null),
        nextMove: 'X'
      }],
      nextMove: 'X',
      stepNumber: 0,
    })
  }

  renderResetButton(){
    return <button onClick={(e) => this.resetGame()}>Reset The Game</button>
  }

  render() {
    const history = this.state.history;
    const selectedState = history[this.state.stepNumber];
    const isWinner = calculateWinner(selectedState.squares);
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
          <Board
            squares={selectedState.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <div>{this.renderResetButton()}</div>
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

function calculateWinner(squares) {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return true
    }
  }
  return null;
}
