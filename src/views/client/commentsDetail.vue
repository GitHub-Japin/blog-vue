<template>
  <div>
  <div>
    <Header></Header>
  </div>
  <div style="width: 1000px; margin: 0 auto">
    <div style="margin: 20px 0">
      <div style="margin: 10px 0">
        <el-input type="textarea" placeholder="请输入评论" v-model="comment.content"></el-input>
        <div style="text-align: right; margin: 10px 0" >
          <el-button type="primary" @click="submit" >提交</el-button>
        </div>
      </div>
    </div>
    <div style="margin: 20px 0">
      <div style="margin: 10px 0; font-size: 24px; padding: 10px 0; border-bottom: 1px solid #ccc; text-align: left">
        评论列表
      </div>
      <div style="margin: 20px 0; text-align: left">
        <div style="padding: 10px 0;border-bottom: 1px solid #ccc;"  v-for="item in comments" :key = "item.id">

          <div style=" display: flex">
            <div style="width: 80px"><el-avatar :size="50" :src="user.avator"></el-avatar></div>
            <div style="flex: 1">
              <div style="color: black ">  <b>{{ item.userName }}：</b><span>{{ item.content }}</span></div>

              <div style="width: 200px;margin-top: 5px">
                <i class="el-icon-time"></i><span style="margin-left: 5px">{{ item.created}}</span>
              </div>
              <!--多级回复-->
              <div>
                <el-button type="text" @click="reply(item.id,item.userName)">回复</el-button>
              </div>

              <!--回复列表-->
              <div v-if="item.children.length" style="margin-left: 100px;background-color:aliceblue;padding: 10px;border-radius: 10px">
                <div v-for="sub in item.children" :key="sub.id">
                  <div style="padding: 5px 0">
                    <b style="cursor: pointer" @click="reply(sub.pid,sub.userName)">{{ sub.userName }}</b>
                    <span>
                      回复
                    <span style="color: cornflowerblue">@{{ sub.target }}</span>
                    <span style="color: #666; margin-left: 10px">{{ sub.content }}</span>
                    </span>
                    <div style="width: 200px;margin-top: 5px">
                      <i class="el-icon-time"></i><span style="margin-left: 5px">{{ item.created}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    <el-dialog title="回复" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="replyComment">
        <el-form-item label="内容" :label-width="100">
          <el-input v-model="replyComment.content" autocomplete="off" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveReply">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Header from "@/components/client/Header";

export default {
  name: 'Home',
  components: {Header},
  data(){
    return{
      value:0,
      comments:[],
      pid: 0,
      comment:{
        blogId:'',
        content:''
      },
      replyComment:{
        username:''
      },
      user:{
        avatar:''
      },
      dialogFormVisible:false
    }
  },
  created() {
    this.user.avatar = this.$store.getters.getUser.avatar
    this.comment.blogId = this.$route.params.blogId
    this.load()
  },
  methods:{
    reply(pid,target){
      this.replyComment.username=this.$store.getters.getUser.username
      this.replyComment ={pid: pid, userId:2,username:this.replyComment.username,blogId:this.comment.blogId,target:target}
      this.dialogFormVisible =true
    },
    load(){
      fetch("comment?blogId="+this.comment.blogId).then(res =>{
        if(res.status ===500){
          this.$notify.success("系统错误")
          return {}
        }
        return res.json()
      }).then(res => {
        this.value = res.rate
        this.comments = res.comments
      })
    },
    saveReply(){
      fetch("comment",{
        method:'post',
        headers:{
          'Content-Type':'application/json;charset=utf-8'
        },
        body: JSON.stringify(this.replyComment)
      }).then(res =>{
        if (res.status ===200){
          this.$notify.success("评论成功")
          this.load();
          this.replyComment ={}
          this.dialogFormVisible=false
        }
      })
    },
    submit(){
      fetch("comment",{
        method:'post',
        headers:{
          'Content-Type':'application/json;charset=utf-8',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(this.comment)
      }).then(res =>{
        if (res.status ===200){
          this.$notify.success("评论成功")
          this.load();
          this.comment ={}
        }
      })
    }
  }
}
</script>
