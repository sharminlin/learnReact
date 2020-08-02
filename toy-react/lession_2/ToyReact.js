
class ElementWrapper {
  constructor (type) {
    this.root = document.createElement(type)
  }

  setAttribute (name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      let eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLocaleLowerCase())
      this.root.addEventListener(eventName, value)
    }
    if (name === 'className') {
      name = 'class'
    }
    this.root.setAttribute(name, value)
  }

  appendChild (vchild) {
    let range = document.createRange()
    if (this.root.children.length) {
      range.setStartAfter(this.root.lastChild)
      range.setEndAfter(this.root.lastChild)
    } else {
      range.setStart(this.root, 0)
      range.setEnd(this.root, 0)
    }
    vchild.mountTo(range)
  }

  mountTo (range) {
    range.deleteContents()
    range.insertNode(this.root)
    // parent.appendChild(this.root)
  }
}

class TextWrapper {
  constructor (content) {
    this.text = document.createTextNode(content)
  }

  mountTo (range) {
    range.deleteContents()
    range.insertNode(this.text)
    // parent.appendChild(this.text)
  }
}

export class Component {
  constructor () {
    this.children = []
    this.props = Object.create(null)
  }

  setAttribute (name, value) {
    this.props[name] = value
    this[name] = value
  }

  appendChild (vchild) {
    this.children.push(vchild)
  }

  mountTo(range) {
    this.range = range
    this.update()
  }

  update() {
    let placeholder = document.createComment('placeholder')
    let range = document.createRange()
    range.setStart(this.range.endContainer, this.range.endOffset)
    range.setEnd(this.range.endContainer, this.range.endOffset)
    range.insertNode(placeholder)

    this.range.deleteContents()
    let vdom = this.render()
    vdom.mountTo(this.range)

    // placeholder.parentNode.removeChild(placeholder)
  }

  setState (state) {
    const merge = (oldState, newState) => {
      for (let key in newState) {
        if (typeof newState[key] === 'object') {
          if (typeof oldState[key] !== 'object') {
            oldState[key] = {}
          }
          merge(oldState[key], newState[key])
        } else {
          oldState[key] = newState[key]
        }
      }
    }
    if (!this.state && state) {
      this.state = {}
    }
    merge(this.state, state)
    this.update()
  }
}

export const ToyReact = {
  createElement(tag, attrs, ...children) {
    // console.log(arguments)
    let element;
    if (typeof tag === 'string') {
      element = new ElementWrapper(tag)
    } else {
      element = new tag()
    }

    for (let name in attrs) {
      element.setAttribute(name, attrs[name])
    }

    const insertChildren = (children) => {
      for (let child of children) {
        if (typeof child === 'object' && child instanceof Array) {
          insertChildren(child)
        } else {
          // 强转string
          if (!(child instanceof Component) &&
              !(child instanceof ElementWrapper) &&
              !(child instanceof TextWrapper)) {
            child = String(child)
          }
          if (typeof child === 'string') {
            // child = document.createTextNode(child)
            child = new TextWrapper(child)
          }
          element.appendChild(child)
        }
      }
    }
    insertChildren(children)
    return element
  }
}

export const ToyReactDom = {
  render(vdom, parent) {
    let range = document.createRange()
    if (parent.children.length) {
      range.setStartAfter(parent.lastChild)
      range.setEndAfter(parent.lastChild)
    } else {
      range.setStart(parent, 0)
      range.setEnd(parent, 0)
    }

    vdom.mountTo(range)
  }
}
