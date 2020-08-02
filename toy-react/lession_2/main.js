import { ToyReact, ToyReactDom, Component } from './ToyReact'

class Square extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: null
    }
  }
  render () {
    return (
      <button className="square" onClick={() => this.setState({ value: 'X' })}>
        {this.state.value ? this.state.value : ''}
      </button>
    )
  }
}

class Board extends Component {
  renderSquare (i) {
    return <Square value={i} />
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

const App = (
  <Board />
)

ToyReactDom.render(
  App,
  document.getElementById('app')
)


/**
 var App = _ToyReact__WEBPACK_IMPORTED_MODULE_0__["ToyReact"].createElement(
   "div", {
      name: "a",
      id: "id_a"
    },
    _ToyReact__WEBPACK_IMPORTED_MODULE_0__["ToyReact"].createElement("span", null, "hello"),
    _ToyReact__WEBPACK_IMPORTED_MODULE_0__["ToyReact"].createElement("span", null, "word")
  );
 */