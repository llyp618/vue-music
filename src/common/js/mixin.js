import {mapGetters,mapActions} from 'vuex'
import {playMode} from '@/common/js/config'
import {shuffle} from '@/common/js/util'
export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playlist'
        ])
    },
    mounted() {
        this.handlePlaylist(this.playlist)
    },
    activated() {
        this.handlePlaylist(this.playlist)
    },
    watch: {
        playlist(newVal) {
            this.handlePlaylist(newVal)
        }
    },
    methods: {
        handlePlaylist() {
            throw new Error('component must implement handlePlaylist method')
        }
    }
}

export const playerMixin = {
    computed: {
        ...mapGetters([
            'favoriteList',
			'mode',
			'sequenceList',
			'playlist',
			'currentSong'
        ])
    },
    methods: {
        selectMode() {
            let newMode = (this.mode + 1) % 3 
            this.SET_PLAY_MODE(newMode)
            let list = null
            if(newMode === playMode.random) {
                list = shuffle(this.sequenceList)
            }else {
                list = this.sequenceList
            }
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            this.SET_CURRENT_INDEX(index)
            this.SET_PLAYLIST(list)
        },
        toggleFavorite(song) {
			if (this.isFavorite(song)) {
				this.deleteFavoriteList(song)
			} else {
				this.saveFavoriteList(song)
			}
		},
		getFavoriteIcon(song) {
			if (this.isFavorite(song)) {
				return 'icon-favorite'
			}
			return 'icon-not-favorite'
		},
		isFavorite(song) {
			const index = this.favoriteList.findIndex((item) => {
				return item.id === song.id
			})
			return index > -1
        },
        ...mapActions([
			'saveFavoriteList',
			'deleteFavoriteList'
		])
    }
}


export const searchMixin = {
    data() {
        return {
            query: ''
        }
    },
    computed: {
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods: {
        addQuery(query) {
            this.$refs.searchBox.setQuery(query)
        },
        blurInput() {
            // 手机端如果不对input进行blur，输入框是不会收起来的，better-scroll 改变了一些触摸行为，因此需要执行这个操作。
            this.$refs.searchBox.blur()
        },
        saveSearch() {
            this.saveSearchHistory(this.query)
        },
        deleteSearch(item){
            this.deleteSearchHistory(item)
        },
        onQueryChange(query) {
            this.query = query
        },
        ...mapActions([
            'saveSearchHistory',
            'deleteSearchHistory'
        ])
    }
}