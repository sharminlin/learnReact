
const childSymbol = Symbol('children')
class ElementWrapper {
  constructor (type) {
    // this.root = document.createElement(type)
    this.type = type
    this.props = {}
    this[childSymbol] = []
    this.children = []
  }

  setAttribute (name, value) {
    // if (name.match(/^on([\s\S]+)$/)) {
    //   let eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLocaleLowerCase())
    //   this.root.addEventListener(eventName, value)
    // }
    // if (name === 'className') {
    //   name = 'class'
    // }
    // this.root.setAttribute(name, value)
    this.props[name] = value
  }

  appendChild (vchild) {
    // let range = document.createRange()
    // if (this.root.children.length) {
    //   range.setStartAfter(this.root.lastChild)
    //   range.setEndAfter(this.root.lastChild)
    // } else {
    //   range.setStart(this.root, 0)
    //   range.setEnd(this.root, 0)
    // }
    // vchild.mountTo(range)
    this[childSymbol].push(vchild)
    this.children.push(vchild.vdom)
  }

  get vdom () {
    return this
  }
  // get children () {
  //   return this[childSymbol].map(child => child.vdom)
  // }
  mountTo (range) {
    this.range = range

    let placeholder = document.createComment('placeholder')
    let endRange = document.createRange()
    endRange.setStart(range.endContainer, range.endOffset)
    endRange.setEnd(range.endContainer, range.endOffset)
    endRange.insertNode(placeholder)

    range.deleteContents()

    let element = document.createElement(this.type)

    for (let name in this.props) {
      let value = this.props[name]
      if (name.match(/^on([\s\S]+)$/)) {
        let eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLocaleLowerCase())
        element.addEventListener(eventName, value)
      }
      if (name === 'className') {
        name = 'class'
      }
      element.setAttribute(name, value)
    }

    for (let child of this.children) {
      let range = document.createRange()
      if (element.children.length) {
        range.setStartAfter(element.lastChild)
        range.setEndAfter(element.lastChild)
      } else {
        range.setStart(element, 0)
        range.setEnd(element, 0)
      }
      child.mountTo(range)
    }

    range.insertNode(element)
    // parent.appendChild(this.root)
  }
}

class TextWrapper {
  constructor (content) {
    this.text = document.createTextNode(content)
    this.type = '#text'
    this.children = []
    this.props = Object.create(null)
  }
  get vdom () {
    return this
  }
  mountTo (range) {
    this.range = range
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

  get type () {
    return this.constructor.name
  }

  get vdom () {
    return this.render().vdom
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
    // let placeholder = document.createComment('placeholder')
    // let range = document.createRange()
    // range.setStart(this.range.endContainer, this.range.endOffset)
    // range.setEnd(this.range.endContainer, this.range.endOffset)
    // range.insertNode(placeholder)
    // this.range.deleteContents()

    let vdom = this.vdom
    if (this.oldVdom) {
      const isSameNode = (node1, node2) => {
        if (node1.type !== node2.type)  return false

        for (let name in node1.props) {
          // if (typeof node1[name] === 'function' && typeof node2[name] === 'function' &&
          //   node1[name].toString() === node2[name].toString) {
          //   continue
          // }

          if (typeof node1.props[name] === 'object' && typeof node2.props[name] === 'object' &&
            JSON.stringify(node1.props[name]) === JSON.stringify(node2.props[name])) {
            continue
          }
          
          if (node1.props[name] !== node2.props[name]) return false
        }
        if (Object.keys(node1.props).length !== Object.keys(node2.props).length) return false

        return true
      }
      const isSameThree = (node1, node2) => {
        if (!isSameNode(node1, node2)) return false

        if (node1.children.length !== node2.children.length) return false
        for (let i = 0; i < node1.children.length; i++) {
          if (!isSameThree(node1.children[i], node2.children[i])) return false
        }
        return true
      }

      const replace = (newThree, oldThree) => {
        // 组件树未发生变化，直接返回
        if (isSameThree(newThree, oldThree)) {
          console.log('all same')
          return
        }

        if (!isSameNode(newThree, oldThree)) {
          // 根节点已不一致，直接替换
          console.log('all diff')
          newThree.mountTo(oldThree.range)
        } else {
          // 根节点同但子节点有变化，处理子节点
          for (let i = 0; i < newThree.children.length; i++) {
            replace(newThree.children[i], oldThree.children[i])
          }
        }
      }

      replace(vdom, this.oldVdom)
    } else {
      vdom.mountTo(this.range)
    }
    this.oldVdom = vdom

    // placeholder.parentNode.removeChild(placeholder)
  }

  setState (state) {
    const merge = (oldState, newState) => {
      for (let key in newState) {
        // 对象类型递归
        if (typeof newState[key] === 'object' && newState[key] !== null) {
          // 原来的属性值非对象，则初始化重置{}/[]
          if (typeof oldState[key] !== 'object') {
            oldState[key] = newState[key] instanceof Array ? [] : {}
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
          if (child === null || child === void 0) {
            child = ''
          }
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
