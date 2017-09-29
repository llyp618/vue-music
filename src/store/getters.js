/**
 * getters 存储用于取state值的所有方法 同时，他能对state的数据进行各种处理
 */
// 歌单 recommend
export const disc = state => state.disc

// 歌手 singer
export const singer = state => state.singer

// 播放器 player
export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
    return state.playlist[state.currentIndex] || {}
}
// 排行榜 rank
export const toplist = state => state.toplist

// 搜索历史 search

export const searchHistory = state => state.searchHistory

// 播放历史

export const playHistory = state => state.playHistory

// 我喜欢的

export const favoriteList = state => state.favoriteList