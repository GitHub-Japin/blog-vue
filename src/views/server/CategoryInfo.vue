<template>
  <div>
    <ServerInfo></ServerInfo>
    <div>
      <!--clearable用于输入框后的x-->
      <el-input v-model="input" placeholder="请输入分类名" style="width: 250px"
                clearable @keyup.enter.native="handleQuery">
        <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="init"></i>
      </el-input>
      <el-button type="primary" @click="addCategory()">+ 新建</el-button>
    </div>
    <div>
      <el-table :data="tableData">
        <el-table-column label="id" prop="id" width="auto"/>
        <el-table-column label="分类名" prop="categoryname" width="auto"/>
        <el-table-column label="创建时间" prop="created" width="auto"/>
        <el-table-column label="操作" width="160" align="center" v-if="isAdmin">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="blueBug" @click="updateCategory(scope.row)">修改</el-button>
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

    <el-dialog width="550px" :visible.sync="showCategoryUpdateDialog" :title="title" @close="closeDialog('categoryForm')">
      <!--表单单向绑定模型-->
      <el-form :model="categoryForm" label-width="140px" label-position="right" :inline="true" :rules="rules"
               ref="categoryForm">
        <el-form-item label="id：" prop="id">
          <!--表单元素双向绑定模型数据-->
          <el-input placeholder="id自增" v-model="categoryForm.id"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="分类名：" prop="categoryname">
          <!--表单元素双向绑定模型数据-->
          <el-input placeholder="请输入分类名" v-model="categoryForm.categoryname"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleQuery">取消</el-button>
        <el-button v-if="Edit" @click="reset">重置</el-button>
        <el-button @click="title==='修改信息'?update('categoryForm'):add('categoryForm')" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ServerInfo from '../../components/server/ServerInfo'

export default {
  name: "CategoryInfo",
  components: {ServerInfo},
  data() {
    return {
      isAdmin: false,
      Edit: true,
      showCategoryUpdateDialog: false,
      page: 1,
      input: '',
      tableData: [],
      counts: 0,
      currentPage: 1,//默认首页
      pageSize: 5,//默认页大小
      categoryForm: {
        categoryname: ''
      },
      rules: {
        categoryname: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ],
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
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        title: this.input ? this.input : undefined
      }
      this.$axios.get("/category/page", {
        params: params
      }).then(res => {
        this.tableData = res.data.data.records || [];
        this.counts = res.data.data.total
      }, error => {
        // this.$message.error('请求出错了：' + error)
      })
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields();
      this.showCategoryUpdateDialog = false;
    },

    reset(){
      this.categoryForm.categoryname=""
    },

    handleQuery() {
      this.showCategoryUpdateDialog = false;
      this.page = 1;
      this.init();
    },
    addCategory() {
      this.Edit=false;
      this.title = '添加信息'
      this.categoryForm = {
        categoryname: '',
      }
      this.showCategoryUpdateDialog = true;
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post("/category/add", this.categoryForm, {
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
          console.log('error submit!!');
          return false;
        }
      })
    },
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.put("/category/update", this.categoryForm, {
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
          console.log('error submit!!');
          return false;
        }
      })
    },

    //点击事件
    updateCategory(category) {// 修改
      this.Edit=true;
      this.title = '修改信息'
      this.categoryForm.id = category.id
      this.categoryForm.categoryname = category.categoryname
      this.showCategoryUpdateDialog = true;
    },
    addUser() {
      this.Edit=false;
      this.title = '添加信息'
      this.categoryForm = {
        categoryname: '',
      }
      this.showCategoryUpdateDialog = true;
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
