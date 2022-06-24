<template>
  <div class="base-form">
    <div class="wrap-item" flex-box="1" v-for="component in filterList" :key="component.key">
      <ItemWrap :title="component.label">
        <z-form-item
          :tag="component.type"
          v-bind="component.props"
          v-model="form[component.key]"
          @input="emit === 'sync' || handlerEmit"
          @keyup.enter.native="handlerEmit"
        />
      </ItemWrap>
    </div>
    <div class="wrap-item" flex-box="1" flex="box:last cross:center">
      <ItemWrap :title="itemWithBtn.label">
        <z-form-item
          :tag="itemWithBtn.type"
          v-bind="itemWithBtn.props"
          v-model="form[itemWithBtn.key]"
          @input="emit === 'sync' || handlerEmit"
          @keyup.enter.native="handlerEmit"
        />
      </ItemWrap>
      <div class="wrap-btn" flex>
        <div class="search-wrap" :class="{ lastBtn: !isShowMore }" @click="handlerEmit"><i class="iconfont iconsearch1"></i> 搜索</div>
        <el-button v-if="isShowMore" class="btn-item btn-ele" size="small" type="primary" plain @click="expand = !expand">
          {{ expand ? '收起' : '展开' }}筛选
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { throttle, clone } from 'xe-utils'
import ItemWrap from '@lib/modules/itemWrap/index'

export default {
  name: 'base-form',
  components: { ItemWrap },
  props: {
    // 渲染的列表
    list: {
      type: Array,
      default: () => []
    },
    // emit时机
    emit: {
      type: String,
      default: 'click'
    }
  },
  computed: {
    filterList() {
      // 此处需要属性穿透,使用原引用
      const list = this.list
      const lastIndex = list.length - 1
      if (this.expand) {
        // 展开
        return list.slice(0, lastIndex)
      } else {
        // 收起
        return list.slice(0, 2)
      }
    },
    itemWithBtn() {
      return this.expand ? this.list[this.list.length - 1] : this.list[2]
    },
    // 是否展示筛选
    isShowMore() {
      return this.list.length > 3
    }
  },
  data() {
    return {
      form: {},
      expand: false
    }
  },
  methods: {
    handlerEmit: throttle(function() {
      this.$emit('handlerSearch', clone(this.form, true))
    }, 300),
    init() {
      this.list.forEach(item => {
        this.$set(this.form, item.key, item.initValue)
      })

      this.$emit('handlerSearch', clone(this.form, true))
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.$on('reset', function() {
      this.init()
    })
  }
}
</script>

<style lang="scss" scoped>
$iconWidth: 30px;

.base-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  margin-left: -8px;
  margin-top: -8px;
  .wrap-item {
    margin-top: 8px;
    margin-left: 8px;
    width: 30%;
    overflow: hidden;
  }
  .wrap-btn {
    margin-left: 8px;
    border-radius: 4px;
    overflow: hidden;
    background: #e8f0ff;
  }
  .search-wrap {
    cursor: pointer;

    color: #2368f2;
    font-size: 14px;
    padding: 8px 7px 8px 15px;
    .iconfont {
      font-size: 12px;
    }
    &.lastBtn {
      padding-right: 15px;
    }
    &:hover {
      background: #2368f2;
      color: #fff;
    }
  }
  .btn-item {
    padding: 8px 15px 8px 7px;
    &:hover {
      background: #2368f2;
      color: #fff;
    }
    &.btn-ele {
      position: relative;
      border: 0;
      border-radius: 0;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      font-size: 14px;
      margin-left: 1px;
      &:before {
        content: '';
        position: absolute;
        left: -1px;
        top: 50%;
        transform: translateY(-50%);
        width: 0.5px;
        height: 14px;
        line-height: 14px;
        background: #2368f2;
      }
    }
  }

  /deep/ {
    .el-select {
      width: 100%;
    }
  }
}
</style>
