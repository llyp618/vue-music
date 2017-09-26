import {playMode} from '@/common/js/config'
// import {loadSearch} from '@/common/js/cache'
const state = {
    disc: {},
    singer: {},
    playing: false,
    fullScreen: false,
    playlist: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    toplist: []
    // searchHistory:loadSearch()
}

export default state