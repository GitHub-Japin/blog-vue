<template>
  <div>
<!--    <Header></Header>-->

    <div class="blog">
      <h2>{{blog.title}}</h2>
      <el-link icon="el-icon-edit" v-if="ownBlog" class="linklist">
        <router-link :to="{name:'BlogEdit',params:{blogId:blog.id}}">
          编辑
        </router-link>
      </el-link>
      <el-link icon="el-icon-delete" v-if="ownBlog" class="linklist">
        <el-link type="danger" @click="delBlog">删除</el-link>
      </el-link>
      <el-link class="linklist">
        <el-link type="success" @click="goBack">返回</el-link>
      </el-link>
      <el-divider></el-divider>
      <div class="markdown-body" v-html="blog.content"></div>
    </div>
  </div>
</template>

<script>
import 'github-markdown-css'
import Header from '../../components/client/Header'

export default {
  name: 'BlogDetail',
  components: { Header },
  data () {
    return {
      blog: {
        id: '',
        username: '',
        categoryname:'',
        title: '',
        content: '',
        description: ''
      },
      blogId:'',
      ownBlog: false
    }
  },
  methods: {
    goBack() {
// 这个判断用来解决这种情况，当用户没有上一条路由的历史记录，出现点击返回按钮没有反应时，
// 下面的代码用来判断有没有上一条路由的历史记录   如果没有则返回首页
      if (window.history.length <= 1) {
        this.$router.push({ path: "/zh-CN/home" });
        return false;
      } else {
        this.$router.go(-1);
      }
    },
    delBlog () {
      const blogId = this.$route.params.blogId
      if (blogId) {
        this.$confirm('确定删除吗?', '确定删除', {
          'confirmButtonText': '确定',
          'cancelButtonText': '取消',
        }).then(() => {
          this.$axios.delete("/blog/delete/"+blogId,{
            headers:{
              'Authorization': localStorage.getItem('token')
            }
          }).then(res => {
            this.$message({
              type: 'success',
              message: res.data.data
            })
            this.$router.push('/blogs')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  },
  created () {
    // 获取动态路由的 blogId
    const blogId = this.$route.params.blogId
    if (blogId) {
      this.$axios.get('/blog/' + blogId).then(res => {
        const blog = res.data.data
        this.blog.id = blog.id
        this.blog.title = blog.title
        this.blog.description = blog.description

        // MarkdownIt 渲染  博客内容
        let MardownIt = require('markdown-it')
        let md = new MardownIt()//初始化
        this.blog.content = md.render(blog.content)

        // 查看是否是登录人  ||登陆人id是1   ----》      是则可以编辑和删除
        this.ownBlog = (blog.userId === this.$store.getters.getUser.id) || (this.$store.getters.getUser.id === "1")
      })
    }
  }
}
</script>

<style scoped>
.blog {
  margin-top: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);  /*边框阴影边框*/
  width: 100%;
  min-height: 700px;
  padding: 10px;/*文本上下距*/
}
.linklist {
  margin: 5px;
}
</style>
