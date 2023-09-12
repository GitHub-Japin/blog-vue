<template>
  <div>
    <ServerInfo></ServerInfo>
    <div>
      <!--clearable用于输入框后的x-->
      <el-input v-model="input" placeholder="请输入文章标题" style="width: 250px"
                clearable @keyup.enter.native="handleQuery">
        <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="init"></i>
      </el-input>
      <el-button type="primary" @click="addBlog()">+ 新建</el-button>
    </div>
    <div>
      <el-table :data="tableData">
        <el-table-column label="文章id" prop="id" width="75"/>
        <el-table-column label="创建者名" prop="username" width="auto"/>
        <el-table-column label="文章标题" prop="title" width="auto"/>
        <el-table-column label="文章分类" prop="categoryname" width="auto"/>
<!--        <el-table-column label="文章摘要" prop="description" width="auto"/>-->

        <el-table-column label="文章内容">
          <template slot-scope="scope">
            <el-button type="text" @click="getBlogContent(scope.row.id)">点击查看</el-button>
          </template>
        </el-table-column>

<!--        <el-table-column label="文章评论">
          <template slot-scope="scope">
&lt;!&ndash;            <el-button type="text" @click="getCommentContent(scope.row.id)">点击查看</el-button>&ndash;&gt;
            <router-link type="text" size="small" class="blueBug"
                         :to="{  name: 'CommentsDetails', params: {blogId: scope.row.id}}">
              预览
            </router-link>
          </template>
        </el-table-column>-->

        <el-table-column label="创建时间" prop="created" width="auto"/>
        <el-table-column label="文章状态">
          <template slot-scope="scope">
            <span style="margin-right: 10px;">{{ scope.row.status === 0 ? '已发表' : '已下架' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" v-if="isAdmin">
          <template slot-scope="scope">
            <router-link type="text" size="small" class="blueBug"
                         :to="{  name: 'BlogDetail', params: {blogId: scope.row.id}}">
              预览
            </router-link>
            <router-link type="text" size="small" class="blueBug"
                         :to="{  name: 'BlogEdit', params: {blogId: scope.row.id}}">
              编辑
            </router-link>
            <el-button type="text" size="small" class="blueBug" @click="statusHandle(scope.row)">
              {{ scope.row.status === 0 ? '下架' : '发表' }}
            </el-button>
            <el-button type="text" size="small" class="delBut non" @click="deleteBlog(scope.row.id)">
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

    <!--    <mavon-editor v-model="ruleForm.content"></mavon-editor>-->

  </div>
</template>

<script>
import ServerInfo from '../../components/server/ServerInfo'

export default {
  name: "BlogInfo",
  components: {ServerInfo},
  data() {
    return {
      isAdmin: false,
      page: 1,
      input: '',
      tableData: [],
      counts: 0,
      currentPage: 1,//默认首页
      pageSize: 5,//默认页大小
    }
  },
  methods: {
    init() {
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        title: this.input ? this.input : undefined
      }
      this.$axios.get("/blog/page", {
        params: params
      }).then(res => {
        this.tableData = res.data.data.records || [];
        this.counts = res.data.data.total
      }, error => {
        // this.$message.error('请求出错了：' + error)
      })
    },

    handleQuery() {
      this.page = 1;
      this.init();
    },

    getBlogContent(id) {
      this.$axios.get("/blog/getContent", {
        params: {id},
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(res => {
        this.$alert(res.data.data, '该文章内容为：', {
          confirmButtonText: '确定',
        })
      }, error => {
        // this.$message.error('请求出错了：' + error)
      })
    },
    getCommentContent(id) {
      this.$axios.get("/comment?blogId="+id, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(res => {
        this.$alert(res.data.data, '该文章内容为：', {
          confirmButtonText: '确定',
        })
      }, error => {
        // this.$message.error('请求出错了：' + error)
      })
    },

    addBlog() {// 添加
      this.$router.push('../Blog/add')
    },

    editBlog(id) {
      this.$router.push('../blog/add/' + id)
    },

    deleteBlog(id) {// 删除
      this.$confirm('确定删除吗?', '确定删除', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
      }).then(() => {
        this.$axios.delete("/blog/delete/" + id, {
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        }).then(res => {
          this.$message.success('该博客已删除')
          this.handleQuery()
        }, error => {
          // this.$message.error('请求出错了：' + error)
        })
      })
    },

    statusHandle(blog) {//状态更改
      this.$confirm('确认更改该博客状态?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        this.$axios.put("/blog/updateStatus", {}, {
          params: {
            id: blog.id,
            status: blog.status ? '0' : '1'
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
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.init()
    },
  },
  //初始化
  mounted() {
    // alert(this.$store.getters.getUser.id)
    this.isAdmin = this.$store.getters.getUser.id === "1"
    this.init()
  },
  created() {
  }
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
