<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1"><a @click="zhuye">主页</a></el-menu-item>
    <el-menu-item index="2"><a type="success" @click="fbbk">发表博客</a></el-menu-item>
    <!--    <el-submenu index="11">-->
    <!--      <template slot="title">账号管理</template>-->
    <!--      <el-menu-item index="11-1" v-show="!hasLogin" @click="login">登录</el-menu-item>-->
    <!--      <el-menu-item index="11-1" v-show="hasLogin" @click="logout">退出</el-menu-item>-->
    <!--    </el-submenu>-->
    <div>
      <el-avatar class="block" :size="50" :src="user.avatar" v-if="hasLogin"
                 style="float:right;">
      </el-avatar>
      <span v-if="hasLogin" :size="50" style="float:right;padding-top: 20px;color: #42b983;">
        {{ user.username }}
      </span>
    </div>
    <el-menu-item index="3" @click="adminlogin" style="color: crimson">进入后台</el-menu-item>
    <el-menu-item index="8" style="float: right;padding-right: 20px">
      <el-link v-if="!hasLogin" type="danger" style="color: #42b983;" @click="login">登录</el-link>
      <el-link v-if="hasLogin" type="danger" style="color: #42b983;" @click="logout">退出</el-link>
    </el-menu-item>
  </el-menu>

</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      activeIndex: '1',
      user: {
        username: '',
        avatar: ''
      },
      hasLogin: false
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    //退出操作
    logout() {
      //首先调用后端logout接口(因该接口需要认证权限,所以需要传入token)
      //其次调用$store清除用户信息及token
      this.$axios.post("/logout", {}, {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      }).then(res => {
        this.$message.success("退出成功")
        this.$router.push("/login")
        this.$store.commit("REMOVE_INFO")
      })
    },
    login() { //跳转登录页面进行登录
      this.$router.push("/login")
    },
    adminlogin() {
      this.$router.push('/serverinfo')
    },
    fbbk() {
      this.$router.push("/blog/add")
    },
    zhuye() {
      this.$router.push("/blogs")
    }
  },
  //页面创建时即会调用,进而获取用户信息
  created() {
    if (this.$store.getters.getUser.username) {//如果username不为空
      this.user.username = this.$store.getters.getUser.username
      this.user.avatar = this.$store.getters.getUser.avatar
      //判断是登录状态还是非登录显示 退出按钮或者登录按钮
      this.hasLogin = true;
    }
  }
}
</script>

<style>
.content {
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
}
</style>



