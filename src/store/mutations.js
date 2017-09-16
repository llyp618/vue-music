/* mutations 用于存取改变store state 的所有方法 */ 
import * as types from './mutation-types'

const mutations = {
    [types.SET_SINGER](state,singer){
        state.singer = singer
    }
}

export default mutations