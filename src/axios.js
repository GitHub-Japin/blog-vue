// 引入axios依赖
import axios from 'axios'
// 引入element-ui依赖
import Element from 'element-ui'
import store from './store';
// 引入路由
import router from './router'

//使用全局代理无需配置
//axios.defaults.baseURL="http://localhost:8081"

//配置前置拦截
axios.interceptors.request.use(config => {
  return config
})

//配置后置拦截
axios.interceptors.response.use(response => {
    let res = response.data;
    if (res.code === 200) {
      return response
    } else {
      //挂靠main.js所以不能使用this.$  --->Element             duration--->超时时间2s就消失
      Element.Message.error({
        message: res.msg,
        duration: 1000,
        showClose: true,
      })
      //返回一个异常提示就不会继续往下走了 不+的话 res=>的里面 还是会继续走的
      return Promise.reject(response.data.msg)
    }
    // 捕获并处理后台异常信息
  }, error => {
    // 使得异常信息更加友好
    // console.log(error)
    if (error.response.data) { //data不为空时
      error.message = error.response.data.msg
    }
    if (error.response.status === 401) {//未登录或登录信息过期
      store.commit('REMOVE_INFO')//清空token userinfo
      router.push("/login")  //跳转登录页面
    }
    Element.Message.error({
      message: error.message,
      duration: 1000,
      showClose: true,
    })//全局消息
    // Element.Message.error(error.message)//全局消息

    return Promise.reject(error) //抛出异常, 阻止进入"$axios.post(.."
  }
)
