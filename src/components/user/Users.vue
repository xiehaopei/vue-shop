<!-- 组件说明 -->
<template>
  <div class>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogShow">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot:default="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state"
              @change="userStateChanged(slotProps.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot:default="slotProps">
            <!-- 修改按钮 -->
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(slotProps.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(slotProps.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(slotProps.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 对话框区域 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClosed"
    >
      <!-- 对话框主体 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="SettingRoleVisible"
      width="50%"
      @close="setRoleClose"
    >
      <div>
        <p>当前用户： {{ userInfo.username }}</p>
        <p>当前角色： {{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SettingRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//import x from ''
export default {
  components: {},
  data() {
    //自定义校验规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]))+/
      if (regEmail.test(value)) return callback()
      return callback(new Error('请输入合法邮箱'))
    }

    let checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17954)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) return callback()
      return callback(new Error('请输入合法手机号'))
    }
    return {
      queryInfo: {
        query: '',
        //页码
        pagenum: 1,
        //最大显示项数
        pagesize: 3
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      SettingRoleVisible: false,
      userInfo: {},
      rolesList: [],
      selectedRoleId: ''
    }
  },
  computed: {},
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status != 200) return this.$message.error('获取用户列表失败')
      console.log(res)
      this.userList = res.data.users
      this.total = res.data.total
    },
    //分页切换
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getUserList()
    },
    //页码值改变
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page
      this.getUserList()
    },
    //监听switch数据变化
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(
        `/users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status != 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败!')
      }
      this.$message.success('更新用户状态成功!')
    },
    //dialog对话框监听
    dialogShow() {
      this.dialogVisible = true
    },
    //dialog对话框关闭
    dialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        //可以发出请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status != 201) return this.$message.error('添加用户失败！')
        this.$message.success('添加用户成功!')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    //展示编辑对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status != 200) {
        return this.$message.error('没有查询到该用户数据!')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //关闭编辑用户对话框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //提交信息修改
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        //发起信息修改
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status != 200) return this.$message.error('修改信息失败！')
        this.$message.success('修改用户信息成功！')
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    //删除操作
    async removeUserById(id) {
      //弹框提示，点确定返回confirm，点取消返回cancel
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult != 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status != 200) return this.$message.error('删除用户失败！')
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    //分配角色
    async setRole(userInfo) {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200)
        return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
      this.userInfo = userInfo
      this.SettingRoleVisible = true
    },
    //保存更改的用户角色
    async saveRoleInfo() {
      if (!this.selectedRoleId)
        return this.$message.error('请选择要分配的角色！')
      const {
        data: res
      } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if (res.meta.status != 200) return this.$message.error('分配角色失败！')
      this.$message.success('分配角色成功！')
      this.getUserList()
      this.SettingRoleVisible = false
    },
    //分配角色对话框关闭
    setRoleClose() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style>
</style>
