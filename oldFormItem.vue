<!-- Created by chenzhe on 2021-11-10. 表单基础控件 -->
<script>
const getItemTag = (tag = 'input') => {
  return `el-${tag}`
}

// 获取slots
const getSlots = (tag, props, children, createElement) => {
  let slots
  if (!props?.optionList?.length) {
    slots = children
  } else {
    let itemTag, valueKey, labelKey

    switch (tag) {
      case 'radio-group': {
        itemTag = 'el-radio-button'
        valueKey = 'label'
        break
      }
      case 'checkbox-group': {
        itemTag = 'el-checkbox-button'
        valueKey = 'label'
        break
      }
      default: {
        itemTag = 'el-option'
        valueKey = 'value'
        labelKey = 'label'
        break
      }
    }

    if (labelKey) {
      slots = props.optionList.map(option => {
        return createElement(itemTag, {
          props: {
            [valueKey]: option.value,
            [labelKey]: option.label,
            key: option.value
          }
        })
      })
    } else {
      slots = props.optionList.map(option => {
        return createElement(
          itemTag,
          {
            props: { [valueKey]: option.value }
          },
          option.label
        )
      })
    }
  }
  return slots
}
export default {
  name: 'z-form-item',
  functional: true,
  render: function(createElement, context) {
    const { props, data } = context
    const tagName = props.tag
    const tag = getItemTag(tagName)
    const slots = getSlots(tagName, props, context.children, createElement)
    const attrs = data.attrs

    delete props.optionList
    delete props.tag

    data.attrs = Object.assign({ filterable: true, clearable: true }, props, attrs)

    return createElement(tag, data, slots)
  },
  props: ['tag', 'optionList']
}
</script>
