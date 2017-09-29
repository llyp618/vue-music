/* mutations 用于存取改变store state 的所有方法 */ 
import * as types from './mutation-types'

const mutations = {
    // 歌单recommend 
    [types.SET_DISC](state, disc) {
        state.disc = disc
    },
    // 歌手singer
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    },
    // 播放器player
    [types.SET_PLAYING_STATE](state, flag) {
        state.playing = flag
    },
    [types.SET_FULL_SCREEN](state, flag) {
        state.fullScreen = flag
    },
    [types.SET_PLAYLIST](state, list) {
        state.playlist = list
    },
    [types.SET_PLAY_MODE](state, mode) {
        state.mode = mode
    },
    [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list
    },
    [types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index
    },
    // 排行榜rank
    [types.SET_TOP_LIST](state, list) {
        state.toplist = list
    },
    // 搜索历史 search
    [types.SET_SEARCH_HISTORY](state, history) {
        state.searchHistory = history
    },
    // 播放历史 add-song 
    [types.SET_PLAY_HISTORY](state, history){
        state.playHistory = history
    },
    [types.SET_FAVORITE_LIST](state, list){
        state.favoriteList = list
    }
}

export default mutations