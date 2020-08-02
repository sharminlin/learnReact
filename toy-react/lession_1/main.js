import { ToyReact, ToyReactDom, Component } from './ToyReact'

class MyComponent extends Component {
  render () {
    return <div>
      <span>hello</span>
      <span>word</span>
      <div id="child">
        { true }
        { this.children }
      </div>
    </div>
  }
}

const App = (
  <MyComponent name="a" id="id_a">
    <div id="a-child">children</div>
  </MyComponent>
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