import {playMode} from '@/common/js/config'
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
}

export default state