<!-- 组件说明 -->
<template>
  <div class>
    <el-button type="info" @click="out">退出</el-button>
  </div>
</template>

<script>
//import x from ''
export default {
  components: {},
  data() {
    return {}
  },
  computed: {},
  methods: {
    out() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped></style>
