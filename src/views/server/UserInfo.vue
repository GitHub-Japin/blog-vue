<template>
  <div>
    <ServerInfo></ServerInfo>
    <div>
      <!--clearable用于输入框后的x-->
      <el-input v-model="input" placeholder="请输入用户名称" style="width: 250px"
                clearable @keyup.enter.native="handleQuery">
        <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="init"></i>
      </el-input>
      <el-button type="primary" v-if="hasLogin" @click="addUser()">+ 新建</el-button>
      <el-button type="primary" v-if="hasLogin" @click="downLoadWithEasyPOI()">+ 导出</el-button>
<!--      <el-button type="primary" v-if="hasLogin" @click="addUser()">+ 导入</el-button>-->
    </div>
    <div>
      <el-table :data="tableData">
        <el-table-column label="用户id" prop="id" width="auto"/>
        <el-table-column label="用户名" prop="username" width="auto"/>
        <el-table-column prop="image" label="头像" align="auto">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>

        <el-table-column label="用户邮箱" prop="email" width="auto"/>
<!--        <el-table-column label="用户密码" prop="password" width="auto"/>-->
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <span style="margin-right: 10px;">{{ scope.row.status === 0 ? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created" width="auto"/>

        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="blueBug" @click="updateUser(scope.row)">修改</el-button>
            <el-button type="text" size="small" class="blueBug" @click="statusHandle(scope.row)">
              {{ scope.row.status === 0 ? '禁用' : '启用' }}
            </el-button>
            <el-button type="text" size="small" class="delBut non" @click="deleteUser(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pageList"
                     :page-sizes="[5, 10, 20, 30]" :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="counts"
                     @size-change="handleSizeChange" :current-page.sync="page"
                     @current-change="handleCurrentChange"></el-pagination>
    </div>

    <el-dialog width="550px" :visible.sync="showUserUpdateDialog" :title="title" @close="closeDialog('userForm')">
      <!--表单单向绑定模型-->
      <el-form :model="userForm" label-width="140px" label-position="right" :inline="true" :rules="rules"
               ref="userForm">
        <el-form-item label="用户名：" prop="username">
          <!--表单元素双向绑定模型数据-->
          <el-input placeholder="请输入用户名" v-model="userForm.username"  :disabled="Edit"/>
        </el-form-item>
        <br/>
        <el-form-item label="邮箱：" prop="email">
          <!--表单元素双向绑定模型数据-->
          <el-input placeholder="请输入邮箱" v-model="userForm.email"/>
        </el-form-item>
        <br/>
        <el-form-item label="头像：" prop="avatar">
          <el-avatar :src="userForm.avatar"></el-avatar>
          <el-input placeholder="头像网络链接" v-model="userForm.avatar" clearable/>
        </el-form-item>
        <br/>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="userForm.password" show-password/>
        </el-form-item>
        <br/>
      </el-form>
      <div slot="footer">
        <el-button @click="handleQuery">取消</el-button>
        <el-button v-if="Edit" @click="reset">重置</el-button>
        <el-button @click="title==='修改用户信息'?update('userForm'):add('userForm')" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ServerInfo from '../../components/server/ServerInfo'

export default {
  name: "UserInfo",
  components: {ServerInfo},
  data() {
    return {
      Edit: true,
      hasLogin: false,
      input: '',
      tableData: [],
      counts: 0,
      page: 1,//默认首页
      pageSize: 5,//默认页大小
      showUserUpdateDialog: false,
      userForm: {
        username: '',
        email: '',
        avatar: '',
        password: ''
      },
      title: '',
      rules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        avatar: [
          {required: true, message: '请输入头像链接', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init() {
      const userInfo = sessionStorage.getItem("userInfo")
      let username=null;
      if (userInfo!==null){
        username = JSON.parse(userInfo).username//反序列化
      }
      // const name = JSON.stringify(username);//序列化
      if (username === null) {
        this.$message.warning('请先登录账号...')
      } else if (username !== "admin") {
        console.info("--------this.username------------------" + username)
        this.$message.warning('当前账号不是管理员，不加载数据')
      } else {
        const params = {
          currentPage: this.page,
          pageSize: this.pageSize,
          name: this.input ? this.input : undefined
        }
        this.$axios.get("/user/page", {
          params: params,
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        }).then(res => {
          console.log(res)
          this.tableData = res.data.data.records || [];
          this.counts = res.data.data.total
        }, error => {
          // this.$message.error('请求出错了：' + error)
        })
      }
    },
    //(更新/删除后)重新查询
    handleQuery() {
      this.showUserUpdateDialog = false
      this.page = 1;
      this.init();
    },

    reset(){
      this.userForm.username=""
      this.userForm.password=""
      this.userForm.email=""
      this.userForm.avatar=""
    },

    //更新用户信息
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.put("/user/update", this.userForm, {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }).then(res => {
            this.$message.success('更新成功！')
            this.handleQuery()
          }, error => {
            // this.$message.error('请求出错了：' + error)
          })
        } else {
          // console.log('error submit!!');
          return false;
        }
      })

    },
    //添加用户信息
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post("/user/add", this.userForm, {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }).then(res => {
            this.$message.success('添加成功！')
            this.handleQuery()
          }, error => {
            // this.$message.error('请求出错了：' + error)
          })
        } else {
          // console.log('error submit!!');
          return false;
        }
      })
    },

    //点击事件
    updateUser(user) {// 修改
      this.Edit=true;
      this.title = '修改用户信息'
      //不能直接等于user 这样会导致页面数据随之变动
      this.userForm.username = user.username
      this.userForm.avatar = user.avatar
      this.userForm.password = user.password
      this.userForm.email = user.email
      this.showUserUpdateDialog = true;
    },
    addUser() {
      this.Edit=false;
      this.title = '添加用户信息'
      this.userForm = {
        username: '',
        email: '',
        avatar: '',
        password: ''
      }
      this.showUserUpdateDialog = true;
    },
    downLoadWithEasyPOI(){
      window.open("/user/downLoadWithEasyPOI");
    },
    deleteUser(id) {// 删除
      this.$confirm('确定删除吗?', '确定删除', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
      }).then(() => {
        this.$axios.delete("/user/delete", {
          params: {id},
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        }).then(res => {
          this.$message.success('删除成功！')
          this.handleQuery()
        }, error => {
          // this.$message.error('请求出错了：' + error)
        })
      })
    },

    statusHandle(user) {//状态更改
      this.$confirm('确认更改该博客状态?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        this.$axios.put('/user/updateStatus/', {}, {
          params: {
            id: user.id,
            status: user.status ? '0' : '1'
          },
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        }).then(res => {
          this.$message.success('状态已经更改成功！')
          this.handleQuery()
        }, error => {
          // this.$message.error('请求出错了：' + error)
        })
      })
    },
    //页改变
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.page = val
      this.init()
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields();
      this.showUserUpdateDialog = false;
    }
  },
  mounted() {
    const userInfo = sessionStorage.getItem("userInfo")
    const username = JSON.parse(userInfo).username//反序列化
    if (username === null) {
      this.$message.warning('请先登录账号...')
    } else if (username !== "admin") {
      // console.info("--------this.username------------------" + username)
      this.$message.warning('当前账号不是管理员，不加载数据')
    }else {
      this.hasLogin= true
      this.init()
    }
  },
}
</script>


<style scoped>
span {
  font-size: 14px;
  color: #42b983;
}

caption {
  font-size: 25px;
}
</style>
