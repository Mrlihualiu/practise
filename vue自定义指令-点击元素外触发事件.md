# Vue自定义指令-点击元素外触发事件
## directives-注册自定义指令
#### 钩子函数
  - **bind**: 只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作。
  - **inserted**: 被绑定元素插入父节点时调用（仅保证父节点存在，但不一定已被插入文档种）。
  - **update**:所在组件的VNode更新时调用，**但可能发生在其子VNode更新之前**。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新。
  - **componentUpdated**:指令所在组件的VNode**及其子VNode**全部更新后调用。
  - **unbind**: 只调用一次，指令与元素解绑时调用
#### 钩子函数参数
- **el**: 指令所绑定元素，可以用来直接操作DOM。
- **binding**: 一个对象，包含一下property:
  - **name**: 指令名，不包括v-前缀。
  - **value**: 指令的绑定值。例如：`v-my-directive="1 + 1" `中，绑定值为 2。
  - **oldValue**: 指令绑定的前一个值，仅在**update**和**componentUpdated**钩子中可用。无论值是否改变都可用。
  - **expression**: 字符串形式的指令表达式。例如 `v-my-directive="1 + 1" `中，表达式为 "1 + 1"。
  - **arg**: 传给指令的参数，可选。例如 `v-my-directive:foo `中，参数为 "foo"。
  - **modifiers**: 一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。
- **vnode**: Vue编译生成的虚拟节点。
- **oldVnode**: 上一个虚拟节点，仅在**update**和**componentUpdated**钩子中可用

## clickoutside代码
```javascript
import  Vue from 'vue'
import { on } from 'element-ui/src/utils/dom'

// 监听的vnode节点
const nodeList = []
const ctx = '@@clickoutsideContext'

let startClick
let seed = 0

// 服务端渲染不添加监听事件
// 把当前点击的dom节点存入 startClick
!Vue.prototype.$isServer && on(document, 'mousedown', e => (startClick = e))


!Vue.prototype.$isServer && on(document, 'mouseup', e => {
  nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
})

function createDocumentHandler(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    /**
     * 拦截
     *  el.contains(dom) 返回一个布尔值，表示传入的节点是否为该节点的后代节点
     */
    if (
      !vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(!mousedown.target) ||
      el === mouseup ||
      (vnode.context.popperElm &&
        (vnode.context.popperElm.contains(mouseup.target) ||
        vnode.context.popperElm.contains(mousedown.target)
        )
      )
    ) return

    // 自定义指令：表达式有值、  vue实例上是否有methodName方法
    if (
      binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]
    ) {
       vnode.context[el[ctx].methodName]()
    } else {
      // 自定义指令 绑定的常量
      el[ctx].bindingFn && el[ctx].bindingFn()
    }
  }
}

export default {
  bind(el, binding, vnode) {
    // 当前节点 加入监听的节点数组
    nodeList.push(el)
    const id = seed ++
    // 当前节点添加'@@clickoutsideContext'对象，并初始化值
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode)
      methodName: binding.expression,
      bindingFn: binding.value
    }
  },

  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
    el[ctx].methodName = binding.expression
    el[ctx].binding = binding.value
  },

  unbind(el) {
    let len = nodeList.length

    // 解绑时删除当前节点
    for (let i=0; i<len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
    // 删除当前节点dom的'@@clickoutsideContext' 属性
    delete el[ctx]
  }
}
```

