<template>
    <transition name="slide">
        <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>
<script>
    import MusicList from '@/components/music-list'
    import {getMusicList} from '@/api/rank'
    import {ERR_OK} from '@/api/config'
    import {mapGetters} from 'vuex'
    import {createSong} from '@/common/js/song'

    export default {
        computed: {
            title() {
                return this.toplist.topTitle
            },
            bgImage() {
                return this.songs[0] && this.songs[0].image
            },
            ...mapGetters([
                'toplist'
            ])
        },
        data() {
            return {
                songs: [],
                rank: true
            }
        },
        created() {
            this._getMusicList()
        },
        methods: {
            _getMusicList() {
                if (!this.toplist.id) {
                    this.$router.push('/rank')
                    return
                }
                getMusicList(this.toplist.id).then((res) => {
                    if (res.code === ERR_OK) {
                        this.songs = this._normalizeSongs(res.songlist)
                    }
                })
            },
            _normalizeSongs(list) {
                let ret = []
                list.forEach((item) => {
                    const musicData = item.data
                    if (musicData.songid && musicData.albummid) {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }
        },
        components: {
            MusicList
        }
    }
</script>
<style scoped lang="less">
    .slide-enter-active,.slide-leave-active {
        transition:all .3s;
    }
    .slide-enter,.slide-leave-to {
        transform:translate3d(100%,0,0)
    }
</style>