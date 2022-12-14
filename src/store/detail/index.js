//detail模块的仓库

import { reqAddOrUpdateShopCart, reqGoodsInfo } from "@/api"
// 封装游客临时身份模块uuid-->生成一个随机字符串(不能再变)
import {getUUID} from '@/utils/uuid_token'
//state:仓库,存储数据
const state = {
    //state中的数据默认初始值设置为空,服务器返回的值是根据接口返回值初始化的
    goodInfo: {},
    // 游客临时身份
    uuid_token: getUUID()
}
//mutations: 修改state的唯一手段
const mutations = {
    GETGOODINFO(state, goodInfo) {
        state.goodInfo = goodInfo
    }
}
//action: 处理action,可以书写自己的业务逻辑,也可以处理异步
const actions = {
    //可以书写可业务逻辑,但是不能修改state
    //通过api里面的接口函数调用,向服务器发送请求,获取服务器数据
    async getGoodInfo({ commit }, skuId) {
        let result = await reqGoodsInfo(skuId)
        if (result.code == 200) {
            commit("GETGOODINFO", result.data)
        }
    },
    // 将产品添加到购物车中

    async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
        // 加入购物车返回的结果
        let result = await reqAddOrUpdateShopCart(skuId, skuNum)
        // 加入购物车以后发送请求,前台将参数带给服务器,只是返回code==200.而没有别的操作,仅代表此次操作成功
        // 因为服务器没有返回新的数据,因此不需要三连环存储新的数[据
        if (result.code == 200) {   // 代表服务器加入购物车成功
            return "ok"
        } else {   //代表加入购物车失败
            return Promise.reject(new Error("faile"))
        }
    }
}

//getters:理解为计算属性,用于简化仓库数据,让组件获取仓库的数据更加方便
const getters = {
    // 路径导航简化的数据
    categoryView(state) {
        return state.goodInfo.categoryView || {}
    },
    // 简化商品信息对数据
    skuInfo(state) {
        return state.goodInfo.skuInfo || {}
    },
    // 商品售卖属性的简化
    spuSaleAttrList(state) {
        return state.goodInfo.spuSaleAttrList || []
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}