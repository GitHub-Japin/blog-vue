<template>
  <div class="login_container">
    <el-header>
      <img class="logo" src="../../../src/assets/logo.png" alt="logo图片"/>
    </el-header>
    <div class="login_box">
      <el-tabs :stretch="true">
        <el-tab-pane label="账号密码登录">
          <!-- 账号密码登录表单 -->
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
            <!-- 用户名 -->
            <el-form-item prop="username" class="input-container">
              <el-input placeholder="用户名" clearable prefix-icon="el-icon-user-solid"
                        v-model="ruleForm.username">
              </el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password" class="input-container">
              <el-input  placeholder="密码" type="password" show-password prefix-icon="el-icon-lock"
                        v-model="ruleForm.password">
              </el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
              <el-button type="primary" @click="registerUser()">注册</el-button>
              <el-button type="success" @click="zhuye">主页</el-button>
              <el-button @click="resetForm()">重置</el-button>
              <el-button @click="goback()">后退</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="邮箱验证登录">
          <!-- 邮箱验证登录表单 -->
          <el-form ref="emailLoginForm" :model="emailLoginForm" :rules="emailLoginFormRules">
            <!-- 邮箱 -->
            <el-form-item prop="email" class="input-container">
              <el-input  placeholder="邮箱" clearable prefix-icon="el-icon-message" v-model="emailLoginForm.email">
              </el-input>
            </el-form-item>
            <el-form-item prop="pcode" class="captcha-container">
              <el-input   placeholder="输入验证码" v-model="emailLoginForm.pcode">
              </el-input>
              <el-image src="http://localhost:8081/verify"/>
            </el-form-item>
            <!-- 邮箱验证码 -->
            <el-form-item prop="emailCode" class="input-container">
              <el-input  placeholder="邮箱验证码" prefix-icon="el-icon-key" v-model="emailLoginForm.emailCode">
                <template #append>
                  <el-button :disabled="disabled" @click="getEmailValidateCode('emailLoginForm')">{{ buttonText }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="login_btns">
              <el-button type="primary" @click="submitEmailLoginForm('emailLoginForm')">登录</el-button>
              <el-button type="primary" @click="">注册</el-button>
              <el-button type="success" @click="zhuye">主页</el-button>
              <el-button @click="resetEmailLoginForm()">重置</el-button>
              <el-button @click="goback()">后退</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="第三方登录">
          <a href="http://localhost:8081/oauth/render">
            <img class="gitee" src="../../../src/assets/gitee.png" alt="gitee" style="max-width: 50px" @click="loginGitee"/>
          </a>
          <el-button @click="loginGitee">Gitee</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="login_footer">
      登录即表示您已阅读并同意
      <a href="#">服务条款</a>
    </div>
    <el-dialog width="550px" :visible.sync="showUserRegisterDialog" :title="title" @close="closeDialog('userForm')">
      <!--表单单向绑定模型-->
      <el-form :model="userForm" label-width="140px" label-position="right" :inline="true" :rules="rules"
               ref="userForm">
        <el-form-item label="用户名：" prop="username">
          <!--表单元素双向绑定模型数据-->
          <el-input placeholder="请输入用户名" v-model="userForm.username"/>
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
        <el-button @click="add('userForm')" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'));
      }
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {// 合法的邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    };
    return {
      Edit: true,
      userForm: {
        username: '',
        email: '',
        avatar: '',
        password: ''
      },
      ruleForm: {
        username: 'admin',
        password: '111111'
      },
      //element-ui表单组件校验规则
      rules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}

        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ]
      },
      emailLoginForm: {
        email: '',
        pcode: '',
        emailCode: ''
      },

      emailLoginFormRules: {
        email: [{
          required: true,
          message: '请输入你的邮箱',
          trigger: 'blur'
        },
          {
            validator: validateEmail,
            trigger: 'blur'
          }
        ],

        pcode: [{
          required: true,//这个不就是必要填写的内容
          message: '请输入图形验证码',
          // trigger: 'blur'
        },],
      },
      loading: false,
      showUserRegisterDialog: false,
      // 控制获取验证码
      buttonText: '获取验证码',
      disabled: false,
      duration: 10,
      time: 0,
      timer: null
    }
  },
  methods: {
    loginGitee(){
      // window.open("http://localhost:8081/oauth/render")
      //http://localhost:8081/oauth/render
      this.$axios.get('/oauth/render').then(res => {
        alert(res.data.code)
        alert(res.code)
        if (res.data.code===200){
          const jwt = res.headers['authorization']
          const userInfo = res.data.data
          // 存储(共享)全局变量jwt和userInfo 使用Store
          this.$store.commit('SET_TOKEN', jwt)
          this.$store.commit('SET_USERINFO', userInfo)
          this.$router.go('/blogs')
          this.$message.success("登录成功")
          this.$router.go('/blogs')
          this.$router.go(-2)
        }else {
          this.$router.go(-1)
          this.$router.go('/blogs')
          this.$message.success("登录失败")
        }
      }).catch(err => {

      })
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields();
      this.showUserUpdateDialog = false;
    },
    handleQuery() {
      this.showUserUpdateDialog = false
    },
    reset(){
      this.userForm.username=""
      this.userForm.password=""
      this.userForm.email=""
      this.userForm.avatar=""
    },
    registerUser() {
      this.title = '用户注册'
      this.userForm = {
        username: '',
        email: '',
        avatar: '',
        password: ''
      }
      this.showUserRegisterDialog = true;
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
            this.showUserRegisterDialog=false
          }, error => {
            // this.$message.error('请求出错了：' + error)
          })
        } else {
          // console.log('error submit!!');
          return false;
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
    submitEmailLoginForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/loginByEmail', this.emailLoginForm).then(res => {
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
          // console.log('error submit!!')
          return false
        }
      })
    },
    getEmailValidateCode(formName) {
      // alert(formName)
      this.$refs[formName].validate((valid) => {//这里和上面没调方法
        if (valid) {
          this.$axios.post('/sendEmailCode', this.emailLoginForm).then(res => {
            if (res.data.code === 200){
              this.$message.success("发送成功")
            }
          })
          this.time=this.duration
          let interval=window.setInterval(()=>{
            if (this.time>0){
              this.time -=1;
              this.buttonText=this.time+"时间后重试";
              this.disabled=true
            }else {
              this.buttonText='获取验证码'
              this.disabled=false
              clearInterval(interval)
            }
          },1000)
        } else {
          alert('error submit!!')
          return false
        }
      })

    },
    resetForm() {
      this.ruleForm.username = ''
      this.ruleForm.password = ''
    },
    resetEmailLoginForm() {
      this.emailLoginForm.email = ''
      this.emailLoginForm.emailCode = ''
      this.emailLoginForm.pcode = ''
    },
    zhuye() {
      this.$router.push('/blogs')
    },
    goback() {
// 这个判断用来解决这种情况，当用户没有上一条路由的历史记录，出现点击返回按钮没有反应时，下
// 面的代码用来判断有没有上一条路由的历史记录   如果没有则返回首页
      if (window.history.length <= 1) {
        this.$router.push({path: "/zh-CN/home"});
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
  background-color: #ffffff;
  color: #333;
  text-align: center;
  /*line-height: 50%;*/
}

.login_container {
  max-width: 50%;
  margin: 0 auto;
  text-align: center;
}

.logo {
  height: 50%;
  margin-top: 10px;
}

.login_box {
  backdrop-filter: blur(15px);
  box-shadow: 0 0 5px #fff;
  text-align: center;
}
.input-container{
  max-width: 50%;
  margin: 0 auto;
  padding-bottom: 25px;
  text-align: center;
}
.captcha-container{
  max-width: 50%;
  text-align: center;
  margin: 0 auto;
  padding-bottom: 25px;
}

</style>
