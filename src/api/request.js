// 对于axios 进行二次封装
import axios from 'axios';
//引入进度条
//start:进度条开始  done:进度条结束
import nprogress from 'nprogress';
//引入进度条样式
import "nprogress/nprogress.css"

// 在当前模块中引入store仓库
import store from '@/store'

// 1: 利用axios对象方法create,去创建一个axios实例
const request = axios.create({
    //配置对象
    baseURL: "/api", //基础路径,发送请求时,路径当中会出现api
    timeout: 5000,  //请求超时的事件5s
})

//请求拦截器: 在发送请求之前,请求拦截器可以检测到,可以在请求发出去前做一些事
request.interceptors.request.use((config) => {
    //config:配置对象,对象中 headers请求头
    if (store.state.detail.uuid_token) {
        // 给请求头添加一个字段(userTempId)
        config.headers.userTempId = store.state.detail.uuid_token
    }
    nprogress.start()
    // 需要携带token带给服务器
    if (store.state.user.token) {
        config.headers.token = store.state.user.token
    }
    return config
})

//响应拦截器
request.interceptors.response.use((res) => {
    //进度条结束
    nprogress.done()
    //成功的回调: 服务器响应数据回来以后,响应拦截器可以检测到
    return res.data


}, (error) => {
    //失败的回调
    return Promise.reject(new Error('faile'))
})

//对外暴露
export default request;