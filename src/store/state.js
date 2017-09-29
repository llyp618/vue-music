import {playMode} from '@/common/js/config'
import {loadSearch,loadPlay,loadFavorite} from '@/common/js/cache'
const state = {
    disc: {},
    singer: {},
    playing: false,
    fullScreen: false,
    playlist: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    toplist: [],
    searchHistory:loadSearch(),
    playHistory:loadPlay(),
    favoriteList:loadFavorite()
}

export default state