<!-- 组件说明 -->
<template>
  <div class="">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoles">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template v-slot:default="SlotProp">
            <el-row
              v-for="(item1, i1) in SlotProp.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vertical-center']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightsById(SlotProp.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vertical-center']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(SlotProp.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightsById(SlotProp.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="children" width="300px">
          <template v-slot:default="SlotProp">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoleById(SlotProp.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoleById(SlotProp.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSettingRight(SlotProp.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 对话框区域 -->
    <el-dialog
      title="添加角色"
      :visible.sync="showRolesDialog"
      width="50%"
      @close="closeRolesDialog"
    >
      <!-- 对话框主体 -->
      <el-form
        :model="addRolesForm"
        :rules="addRolesFormRules"
        ref="addRolesFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      :visible.sync="showEditRolesDialog"
      width="50%"
      @close="closeEditRolesDialog"
    >
      <!-- 对话框主体 -->
      <el-form
        :model="editRolesForm"
        :rules="addRolesFormRules"
        ref="editRolesFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="showSettingRolesDialog"
      width="50%"
      @close="closeSettingRolesDialog"
    >
      <!-- 对话框主体 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSettingRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateRoleRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//import x from ''
export default {
  components: {},
  data() {
    return {
      rolesList: [],
      showRolesDialog: false,
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      addRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { message: '请输入角色描述', trigger: 'blur' },
          { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' }
        ]
      },
      showEditRolesDialog: false,
      editRolesForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      showSettingRolesDialog: false,
      rightsList: {},
      /* 树型控件绑定 */
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      /* 默认选中结点的id值 */
      defKeys: [],
      roleId: ''
    }
  },
  computed: {},
  methods: {
    //获取权限列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200)
        return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
    },
    //展示对话框
    showAddRoles() {
      this.showRolesDialog = true
    },
    //关闭对话框
    closeRolesDialog() {
      this.showRolesDialog = false
    },
    //添加角色
    addRoles() {
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status != 201) return this.$message.error('添加角色失败！')
        this.$message.success('添加角色成功！')
        this.showRolesDialog = false
        this.getRolesList()
      })
    },
    //删除权限
    async removeRightsById(role, rightid) {
      //弹框提示
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult != 'confirm') return this.$message.info('取消了删除!')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightid}`
      )
      if (res.meta.status != 200) return this.$message.error('删除权限失败！')
      this.$message.success('删除权限成功！')
      role.children = res.data
    },
    //删除角色
    async deleteRoleById(id) {
      //弹框提示
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult != 'confirm') return this.$message.info('取消了删除!')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status != 200) return this.$message.error('删除角色失败！')
      this.$message.success('删除角色成功！')
      this.getRolesList()
    },
    //关闭编辑弹窗
    closeEditRolesDialog() {
      this.showEditRolesDialog = false
    },
    //点击编辑按钮
    async editRoleById(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status != 200) {
        return this.$message.error('没有查询到该用户数据!')
      }
      this.editRolesForm = res.data
      this.editRolesForm.id = id
      this.showEditRolesDialog = true
    },
    //提交编辑结果
    editRole() {
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editRolesForm.id,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc
          }
        )
        if (res.meta.status != 200) return this.$message.error('修改角色失败！')
        this.$message.success('修改角色成功!')
        this.showEditRolesDialog = false
        this.getRolesList()
      })
    },
    //展示权限分配弹窗
    async showSettingRight(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status != 200)
        return this.$message.error('获取权限列表失败！')
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.showSettingRolesDialog = true
    },
    //关闭权限分配弹窗
    closeSettingRolesDialog() {
      this.showSettingRolesDialog = false
      this.defKeys = []
    },
    //获取角色三级权限id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    //分配权限
    async updateRoleRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idArray = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idArray }
      )
      if (res.meta.status != 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.showSettingRolesDialog = false
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vertical-center {
  display: flex;
  align-items: center;
}
</style>
