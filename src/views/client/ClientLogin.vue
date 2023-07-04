<template>
  <div>
    <el-container>
      <el-header>
        <img class="logo" src="../../../src/assets/logo.png" alt="logo图片" />
      </el-header>
      <el-main>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户姓名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="zhuye">主页</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-button @click="resetForm()">重置</el-button>
            <el-button @click="goback()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      ruleForm: {
        username: 'admin',
        password: '111111'
      },
      //element-ui表单组件校验规则
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }

        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('校验成功')
          this.$axios.post('/login', this.ruleForm).then(res => {
            const jwt = res.headers['authorization']
            const userInfo = res.data.data

            // 存储(共享)全局变量jwt和userInfo 使用Store
            this.$store.commit('SET_TOKEN', jwt)
            this.$store.commit('SET_USERINFO', userInfo)

            // 获取token和getUser
            // console.log(_this.$store.getters.getToken)
            // console.log(_this.$store.getters.getUser)
            // 跳转blogs页面
            this.$router.push('/blogs')
            this.$message.success("登录成功")
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.ruleForm.username=''
      this.ruleForm.password=''
    },
    zhuye () {
      this.$router.push('/blogs')
    },
    goback() {
// 这个判断用来解决这种情况，当用户没有上一条路由的历史记录，出现点击返回按钮没有反应时，下
// 面的代码用来判断有没有上一条路由的历史记录   如果没有则返回首页
      if (window.history.length <= 1) {
        this.$router.push({ path: "/zh-CN/home" });
        return false;
      } else {
        this.$router.go(-1);
      }
    }
  }
}
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.logo {
  height: 60%;
  margin-top: 10px;
}

.demo-ruleForm {
  max-width: 500px;
  margin: 0 auto;
}
</style>
