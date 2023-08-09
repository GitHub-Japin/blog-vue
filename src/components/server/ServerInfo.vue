<template>
  <!-- 主页布局 -->
  <el-container>
    <el-backtop></el-backtop><!--回到顶部按钮-->
    <el-header> <!-- 头部包含水平菜单、主页 -->
      <el-menu :default-active="$route.path" router mode="horizontal" background-color="white"
               text-color="#000000"
               active-text-color="red">

        <el-link type="Success" @click="toBlog()" class="exit">前往博客页</el-link>
        <!--（登录用户，登出）与登录互斥；showLoginForm控制是否显示登录表单-->
        <el-link v-if="!hasLogin" type="danger" @click="showLoginForm=true" class="login">登录</el-link>
        <el-link v-if="hasLogin" type="danger" @click="logout()" class="logout">登出</el-link>
        <span v-if="hasLogin" class="user">当前用户：{{username}}</span>
        <!--菜单内嵌的i标签，用于设置该菜单前的矩形图标，使用内联样式（已经应用了class样式）-->
        <el-avatar class="block" :size="50" :src="avatar" v-if="hasLogin"
                   style="float:right;">
        </el-avatar>
        <span class="web_title">博客后台管理系统</span>
      </el-menu>
    </el-header>


    <el-container>
      <el-menu :default-active="$route.path" router active-text-color="#FF6666" class="el-menu-demo" mode="horizontal">
        <el-menu-item key="0" index="/welcome">欢迎页面</el-menu-item>
        <el-menu-item key="1" index="/userInfo">用户管理</el-menu-item>
        <el-menu-item key="2" index="/categoryInfo">分类管理</el-menu-item>
        <el-menu-item key="3" index="/blogInfo">博客管理</el-menu-item>
        <el-menu-item key="4" index="/EchartsInfo">统计管理</el-menu-item>
<!--        <el-menu-item key="5" index="/notice">公告管理</el-menu-item>-->
      </el-menu>
      <el-main>
        <!--类似于iframe标签效果，重定向后的内容嵌入此处-->
        <router-view></router-view>
      </el-main>
    </el-container>

    <el-dialog
      title="管理员登录"
      :visible.sync="showLoginForm"
      width="40%">
      <el-form v-bind:model="loginForm" label-width=auto ref="loginForm">
        <!--单向绑定 v-bind-->
        <el-form-item prop="username">
          <!--单向绑定 v-mode-->
          <el-input type="text" v-model="loginForm.username" placeholder="管理员用户名"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="管理员密码" show-password/>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="btn_login" @click="login">登录</el-button>
      <el-button @click="resetForm()">重置</el-button>
    </el-dialog>
  </el-container>


</template>

<script>

export default {
  name: 'ServerInfo',
  data() {
    return {
      hasLogin:false, //不显示登出用户
      username: '', //初始未登录
      avatar: '',
      showLoginForm: false, //不显示登出表单
      loginForm: {  //登录表单
        username: 'admin',
        password: '111111'
      },
      rules: {
        username: [
          { required: true, message: '请输入管理员账号', trigger: 'blur' },

        ],
        password: [
          { required: true, message: '请输入管理员密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    initState(){  //初始化用户状态（控制按钮登录与登出是否显示）
      // this.username = window.sessionStorage.getItem("username")
      // this.token = window.localStorage.getItem("token");
      // if(this.username!=null&& this.token!=null) {
      //   this.hasLogin=true
      // }else{
      //   this.hasLogin=false
      // }
    },
    login () {
      let _this = this;
      this.$axios.post('/login', this.loginForm).then(res => {
        const jwt = res.headers['authorization']
        const userInfo = res.data.data

        // 存储(共享)全局变量jwt和userInfo 使用Store
        this.$store.commit('SET_TOKEN', jwt)
        this.$store.commit('SET_USERINFO', userInfo)

        // 跳转blogs页面
        this.$router.push('serverInfo')

        this.$message.success("登录成功")
        let data=res.data.data
        _this.username = data.username
        _this.hasLogin=true
        this.showLoginForm=false

      }).catch(err=>{
        this.$message.error('后端服务器无响应！')
      })
    },
    logout() {
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.username = ''
        this.$axios.post("/logout", {},{
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
          this.$router.push("/ServerInfo")
          this.$store.commit("REMOVE_INFO")
        })
        this.hasLogin=false
        this.$message.success('退出成功!')
      })
    },
    resetForm () {
      this.loginForm.username=''
      this.loginForm.password=''
    },
    toBlog() {
      //使用Element UI默认的确认对话框，也可以使用普通的自定义对话框<el-dialog>
        this.$router.push("/blogs")
      },
  },
  //页面创建时即会调用,进而获取用户信息
  created () {
    if (this.$store.getters.getUser.username) {//如果username不为空
      this.username = this.$store.getters.getUser.username
      this.avatar = this.$store.getters.getUser.avatar
      //判断是登录状态还是非登录显示 退出按钮或者登录按钮
      this.hasLogin = true;
    }
  },
  mounted() {
    this.initState()
  }
}
</script>

<style scoped>
.user {
  float: right;
  color: #42b983;
  padding-top: 18px
}

.exit {
  color: crimson;
  float: right;
  padding: 20px;
}

.login, .logout {
  color: cadetblue;
  float: right;
  padding: 20px
}

.web_title {
  position: absolute;
  padding-top: 20px;
  right: 43%;
  font-size: 20px;
  font-weight: bold
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
