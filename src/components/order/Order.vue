<!-- 组件说明 -->
<template>
  <div class=''>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList"
                border
                stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号"
                         prop="order_number"></el-table-column>
        <el-table-column label="订单价格"
                         prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot:default="scope">
            <el-tag v-if="scope.row.pay_status==='0'"
                    type="warning">未付款</el-tag>
            <el-tag v-if="scope.row.pay_status==='1'"
                    type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货"
                         prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot:default="scope">
            {{scope.row.create_time|dataFormat}}
          </template></el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditDialog"></el-button>
            <el-button type="success"
                       icon="el-icon-location"
                       size="mini"
                       @click="showProgress"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 对话框 -->
    <el-dialog title="修改地址"
               :visible.sync="editDialogVisible"
               width="50%"
               @close="addressDialogClosed">
      <el-form :model="addressForm"
               :rules="addressFormRules"
               ref="addressFormRef"
               label-width="100px">
        <el-form-item label="省市区/县"
                      prop="address1">
          <el-cascader :options="cityData"
                       v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="物流进度"
               :visible.sync="checkDialogVisible"
               width="50%">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(item, index) in progressInfo"
                          :key="index"
                          :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>

    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
//import x from ''
export default {
  components: {

  },
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      editDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区/县' }],
        address2: [{ required: true, message: '请输入详细地址', trrigle: ' blur' }]
      },
      cityData,
      checkDialogVisible: false,
      progressInfo: []
    };
  },
  computed: {

  },
  methods: {
    //获取订单列表
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败！')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    //监听pagesize改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听pagenum改变
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    //点击编辑按钮
    showEditDialog () {
      this.editDialogVisible = true
    },
    //关闭编辑对话框
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    //点击查看物流按钮
    async showProgress () {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error('获取物流进度失败！')
      this.progressInfo = res.data
      this.checkDialogVisible = true
    }
  },
  created () {
    this.getOrderList()
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>