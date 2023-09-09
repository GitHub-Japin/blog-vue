<template>
  <div>
    <div class="m-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <el-form-item label="分类:" prop="categoryId">
          <el-select v-model="ruleForm.categoryId" placeholder="请选择分类">
            <el-option v-for="(item,index) in categoryList" :key="index" :label="item.categoryname" :value="item.id" :disabled="false"/>
<!--            <el-option v-for="item in categoryList" :value="item.categoryId" :label="item"></el-option>-->
          </el-select>
        </el-form-item>

        <el-form-item label="摘要" prop="description">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <mavon-editor v-model="ruleForm.content"></mavon-editor>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="goBack()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Header from '../../components/client/Header'
export default {
  name: 'BlogEdit',
  components: { Header },
  data () {
    return {
      categoryList: [],
      ruleForm: {
        id: '',
        title: '',
        categoryId:'',
        description: '',
        content: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        categoryId: [
          { required: false, message: '请选择分类', trigger: 'change'}
        ],
        description: [
          { required: true, message: '请输入摘要', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getCategory(){
      this.$axios.get("/category/list").then(res => {
        this.categoryList= res.data.data;
        console.log(res.data+"-------------------")
        console.log(res.data.data+"-------------------")
      }, error => {
        // this.$message.error('请求出错了：' + error)
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/blog/edit', this.ruleForm, {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }).then(res => {
            this.$alert('操作成功', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                // this.$router.push('/blogs')
                this.$router.go(-1);
              }
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    goBack() {
// 这个判断用来解决这种情况，当用户没有上一条路由的历史记录，出现点击返回按钮没有反应时，
// 下面的代码用来判断有没有上一条路由的历史记录   如果没有则返回首页
      if (window.history.length <= 1) {
        this.$router.push({path: "/zh-CN/home"});
        return false;
      } else {
        this.$router.go(-1);
      }
    },

  },
  created () {//回显
    this.getCategory()
    // 获取动态路由的 blogId
    const blogId = this.$route.params.blogId
    console.log(blogId)
    if (blogId) {
      this.$axios.get('/blog/' + blogId).then(res => {
        const blog = res.data.data
        this.ruleForm.id = blog.id
        this.ruleForm.title = blog.title
        this.ruleForm.categoryId =blog.categoryId
        this.ruleForm.description = blog.description
        this.ruleForm.content = blog.content
      })
    }
  }
}
</script>

<style scoped>
.m-content {
  text-align: center;
}
</style>
