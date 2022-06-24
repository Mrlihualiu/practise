<!-- Created by chenzhe on 2021-11-10. 表单基础控件 -->
<script>
import { basic } from './BASIC'

const getBasicTagName = tag => basic[tag]?.component || 'el-input'
// 创建子虚拟节点 (VNodes)
const createChildElement = (props, children, createElement) => {
  const { tag, optionList } = props
  // 如果没有传入optionList配置列表
  if (!optionList?.length) {
    return children
  }
  const childTagName = basic[tag]?.childTagName || 'el-option'
  let childItemElement
  if (childTagName === 'el-option') {
    childItemElement = optionList.map(option => {
      return createElement(childTagName, {
        props: {
          value: option.value,
          lable: option.label,
          key: option.value
        }
      })
    })
  } else {
    childItemElement = optionList.map(option => {
      return createElement(
        childTagName,
        {
          props: {
            value: option.value
          }
        },
        option.label
      )
    })
  }

  return childItemElement
}
export default {
  name: 'z-form-item',
  functional: true,
  render: function(createElement, context) {
    // context代表Vue实例
    const { props, data, attrs, children } = context
    // console.log('props', props)
    // console.log('data', data)
    // console.log('attrs', attrs)
    // console.log('children', children)
    // 通过basic映射完整的tagName
    const tagName = getBasicTagName(props.tag)
    // 创建子虚拟节点
    const childElement = createChildElement(props, children, createElement)

    // 删除通过props接收的tag、optionList
    delete props.optionList
    delete props.tag

    // 为HTML模板的attrs属性添加attrs、props、筛选属性、清除属性
    data.attrs = Object.assign({ filterable: true, clearable: true }, props, attrs)

    // 创建名为tagName的VNodes节点
    // 模板中 attribute 对应的数据对象内容为data
    // 子虚拟节点为childElement  (VNodes)
    console.log('data.attrs', data.attrs)
    return createElement(tagName, data, childElement)
  },
  props: {
    tag: {
      type: String,
      require: true
    },
    optionList: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    }
  }
}
</script>
