import router from "./router";
import Element, {Message} from 'element-ui'

// 路由判断登录 根据路由配置文件的参数
// 前置路由守卫 //前置拦截
router.beforeEach((to, from, next) => {
  console.log(to, from)
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限//如果为true
    const token = localStorage.getItem("token")
    // console.log("------------" + token)
    if (token) { // 判断当前的token是否存在 ； 登录存入的token
      if (to.path === '/login') {
      } else {
        next()
      }
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  console.log(to, from)
  if (to.meta.requireLogin) { // 判断该路由是否需要登录权限//如果为true
    const token = localStorage.getItem("token")
    // console.log("------------" + token)
    if (token) { // 判断当前的token是否存在 ； 登录存入的token
      if (to.path === '/login') {
      } else {
        next()
      }
    } else {
      next({
        Element: Message.error("请先登录管理员账号，否则无法跳转"),
        //返回一个异常提示就不会继续往下走了 不+的话 res=>的里面 还是会继续走的
        return: Promise.reject(response.data.msg)
      })
    }
  } else {
    next()
  }
})

/*
* query参数
*1.给路由组件传递数据
*2.例如：
* 在router-link标签的to中的路由路径中拼接的参数(?key=value&...) 接收可以通过this.$route.query
* 需要注意使用模板字符串/使用对象写法(指定path/name，query)
*
* params参数
* 不需要写出?key=value的形式 直接在/后面配置value
* 但是需要在路由的path中配置/:key 接收可以通过this.$route.params
* 需要注意当使用对象写法时，不能使用path 必须使用路由name
*
* props参数
* 用于简化接收参数的方式三种方式
* 需要在组件里配置props:["key1","key2"],以及对应的路由中配置props
* 1.props:{key1:value,key2:value} 写死的
* 2.props:true,会将接收到的params数据直接传回组件(只能是params)
* 3.props($route){ return {key1:$route.params/query.,key1:$route.params/query.}}
* */
