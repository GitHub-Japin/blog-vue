<template>
  <div>
    <ServerInfo></ServerInfo>
    <div>
      <!--clearable用于输入框后的x-->
      <el-input v-model="input" placeholder="请输入操作名" style="width: 250px"
                clearable @keyup.enter.native="handleQuery">
        <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="init"></i>
      </el-input>
    </div>
    <div>
      <el-table :data="tableData">
        <el-table-column label="id" prop="id" width="auto"/>
        <el-table-column label="操作名" prop="annotation" width="auto"/>
        <el-table-column label="用户名" prop="userName" width="auto"/>
        <el-table-column label="ip" prop="clientIp" width="auto"/>
        <el-table-column label="创建时间" prop="time" width="auto"/>
        <el-table-column label="操作" width="160" align="center" v-if="isAdmin">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="delBut non" @click="deleteCategory(scope.row.id)">
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
  </div>
</template>

<script>
import ServerInfo from '../../components/server/ServerInfo'

export default {
  name: "LogInfo",
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
      this.$axios.get("/Log/page", {
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
    deleteCategory(id) {// 删除
      this.$confirm('确定删除吗?', '确定删除', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
      }).then(() => {
        this.$axios.delete("/category/delete/" + id, {
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        }).then(res => {
          this.$message.success('已删除')
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
    this.isAdmin = this.$store.getters.getUser.id === 1
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
