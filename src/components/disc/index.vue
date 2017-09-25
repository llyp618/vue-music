<template>
    <transition name="slide">
        <music-list :bgImage="bgImage" :songs="songs" :title="title"></music-list>
    </transition>
</template>
<script>
    import MusicList from '@/components/music-list'
    import {getSongList} from '@/api/recommend'
    import {ERR_OK} from '@/api/config'
    import {createSong} from '@/common/js/song'
    import {mapGetters} from 'vuex'
    export default {
        components:{
            MusicList
        },
        computed: {
            title() {
                return this.disc.dissname
            },
            bgImage() {
                return this.disc.imgurl
            },
            ...mapGetters([
                'disc'
            ])
        },
        created(){
            this._getSongList()
        },
        data(){
            return {
                songs: []
            }
        },
        methods: {
            _getSongList(){
                if(!this.disc.dissid) {
                    this.$router.push('/recommend')
                    return
                }
                getSongList(this.disc.dissid).then((res) => {
                    if(res.code === ERR_OK) {
                        this.songs = this._normalizeSongs(res.cdlist[0].songlist)
                    }
                })
            },
            _normalizeSongs(list) {
                let ret = []
                list.forEach((musicData) => {
                    if(musicData.songid && musicData.albummid){
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }
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