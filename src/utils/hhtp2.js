/*
    说明:接口二次封装
        1. 根据 process.env.NODE_ENV 判断线上还是线下
        2. 接口调用

    流程：
        1.当为true时就调用线下接口 https://mt.hiepm.com false时调用线上接口 https://hj.hiepm.com
        2.timeout 设置超时时间 aipduniapp
        3.获取token后判断处理
        
    涉及变量：
        1. process.env.NODE_ENV 
        2. get("csrFtoken")
    args:
        无

    return:
        无
*/ 

import axios from 'axios';//引入axios
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'//设置post请求头
import Cookies from "js-cookie";//引入cookie
import { removeCookie,setCookie } from "@/utils/support.js";//引入封装好的cookie
// 引入依赖进行判断
import { ElMessage, ElMessageBox } from 'element-plus'
// 判断是线上还是线下
let development = process.env.NODE_ENV == 'development' ? true : false;
// 创建基础地址 https://hj.hiepm.com https://mtkj.hiepm.com  http://192.168.0.102:8080/

const service = axios.create({
    // 公共接口
    baseURL: development? 'http://192.168.0.102:8000/':'https://hj.hiepm.com',
    // 超时时间
    timeout: 10000
}) 
// 配置接口请求信息
service.interceptors.request.use(
    (config) => {
        if (config.method === 'get') {
            // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
            config.paramsSerializer = function(params) {
              return qs.stringify(params, { arrayFormat: 'repeat' })
            }
        }
        // 判断是否是undfined
        if(Cookies.get("csrFtoken")){
            config.headers.Authorization = 'Token ' + Cookies.get("csrFtoken"); //"token"; //从后台传过来的token

            // 处理中文情况
            var pattern = new RegExp("[\u4E00-\u9FA5]+");
            if(pattern.test(config.headers.Authorization)){
                if (document.getElementsByClassName("is-message-box").length === 0 ) {
                    ElMessageBox.alert('', '页面权限出错', {
                    // if you want to disable its autofocus
                    // autofocus: false,
                        confirmButtonText: '重新登录',
                        callback: (action) => {
                            location.reload();
                            removeCookie("csrFtoken")
                            removeCookie("user_name")
                            
                            setCookie("status",err.response.status)
                        },
                    })
                }
            }
            return config;
            // 当我们实现单点登录的时候就将token设置在此处使用参数传递过来
        }
        return config;
        
    },
    (err) => {
        return err;
    }
);
/*
    说明:返回请求结果
        1. 返回响应后的数据
        2. 接口调用状态码判断

    流程：
        1.根据 service.interceptors.response.use 括号里面返回的信息获取
        2.获取到相应的res 进行rentun
        3.权限与数据接口请求判断
        
    涉及变量：
    args:
        1. res 正确数据
        2. err 错误结果

    return:
        无
*/ 
service.interceptors.response.use(
    (res) => {
        return res
    },
    (err) => {
        switch(err.response){//超时情况处理 message
            case 'timeout of 10000ms exceeded':
                if (document.getElementsByClassName("is-message-box").length === 0 ) {
                    ElMessage({
                        message: '登录状态已过期',
                        type: 'warning',
                    })
                }
            break
        }
        // 报错处理
        switch(err){//超时情况处理 
            case err.response != 400:
                if (document.getElementsByClassName("is-message-box").length === 0 ) {
                    ElMessage({
                        message: err.message,
                        type: 'warning',
                    })
                }
            break
        }
        if(err.response){
            switch(err.response.status){
                case 401://无权限时进行判断
                    if (document.getElementsByClassName("is-message-box").length === 0 ) {
                        ElMessageBox.alert('', '您似乎没有权限查看该页面', {
                        // if you want to disable its autofocus
                        // autofocus: false,
                            confirmButtonText: '重新登录',
                            callback: (action) => {
                                // location.reload();
                                router.go(0);
                                removeCookie("csrFtoken")
                                removeCookie("user_name")
                                setCookie("status",err.response.status)
                            },
                        })
                    }
                    
                break;

            }
        }
        return err
        
        
    }
);
export default service;