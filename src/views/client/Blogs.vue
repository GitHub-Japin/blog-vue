<template>
  <div class="Container">
    <Header></Header>

    <el-backtop></el-backtop><!--回到顶部按钮-->
    <div class="center">
      <el-input v-model="input" placeholder="请输入要搜索的文章标题" style="width: 250px"
                clearable @keyup.enter.native="handleQuery">
        <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="init"></i>
      </el-input>
      <el-pagination class="pageList"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[5, 10, 20, 30]" :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total=total></el-pagination>
    </div>
    <div class="block">
      <el-timeline><!-- :绑定值  --->
        <el-timeline-item :timestamp="blog.created" placement="top" v-for="(blog,key) in blogs" :key=key>
          <el-card>
            <h4>
              <router-link :to="{  name: 'BlogDetail', params: {blogId: blog.id}}">{{ blog.title }}
              </router-link>
            </h4>
            <div style="font-size:10px">博主名：{{ blog.username }}</div>
            <div style="font-size:10px">所属分类：{{ blog.categoryname }}</div>
            <p>{{ blog.description }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
// 引入header组件
import Header from '../../components/client/Header'

export default {
  data() {
    return {
      input: '',
      blogs: {},
      total: 0,
      currentPage: 1,//默认首页
      pageSize: 10,//默认页大小
    }
  },
  name: 'Blogs',
  components: {Header},

  methods: {
    init() {
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        title: this.input ? this.input : undefined
      }

      this.$axios.get("/blogs/page", {
        params: params
      }).then(res => {
        let data = res.data.data
        this.blogs = data.records || []
        this.currentPage = data.current
        this.pageSize = data.size
        this.total = data.total
      }, error => {
        this.$message.error('请求出错了：' + error)
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
    handleQuery() {
      this.page = 1;
      this.init();
    },
  },
  created() {//创建页面调用方法
  },
  //初始化!!
  mounted() {
    this.init()
  }
}
</script>

<style scoped>
.block {
  margin: 20px;
}

.center { /*居中显示*/
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
}

</style>
