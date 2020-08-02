
class ElementWrapper {
  constructor (type) {
    this.root = document.createElement(type)
  }

  setAttribute (name, value) {
    this.root.setAttribute(name, value)
  }

  appendChild (vchild) {
    vchild.mountTo(this.root)
  }

  mountTo (parent) {
    parent.appendChild(this.root)
  }
}

class TextWrapper {
  constructor (content) {
    this.text = document.createTextNode(content)
  }

  mountTo (parent) {
    parent.appendChild(this.text)
  }
}

export class Component {
  constructor () {
    this.children = []
  }
  setAttribute (name, value) {
    this[name] = value
  }

  appendChild (vchild) {
    this.children.push(vchild)
  }
  mountTo(parent) {
    let vdom = this.render()
    vdom.mountTo(parent)
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

    for (let attr in attrs) {
      element.setAttribute(attr, attrs[attr])
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
    // parent.appendChild(vdom)
    vdom.mountTo(parent)
  }
}
