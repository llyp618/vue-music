<template>
    <transition name="slide">
        <music-list :title="singer.name" :bgImage="singer.avatar"></music-list>
    </transition>
</template>
<script>
    import {mapGetters} from 'vuex'
    import {getSingerDetail} from '@/api/singer'
    import {ERR_OK} from '@/api/config'
    import MusicList from '@/components/music-list'
    import {createSong} from '@/common/js/song'
    export default {
        components:{
            MusicList
        },
        computed: {
            ...mapGetters({
                singer:'singer'
            })
        },
        data() {
            return {
                songs: []
            }
        },
        created(){
            this._getSingerDetail(this.singer.id)
        },
        methods: {
            _getSingerDetail(id) {
                // 防止刷新
                if(!id){
                    this.$router.push('/singer')
                    return
                }
                getSingerDetail(id).then((res) => {
                    if(res.code === ERR_OK){
                        this.songs = this._normalizeSongs(res.data.list)
                    }
                })
            },
            _normalizeSongs(list){
                let ret = [] 
                list.forEach((item) => {
                    let {musicData} = item
                    if(musicData.songid && musicData.albummid) {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }
        }

    }
</script>
<style scoped lang="less">
    @import "~@/common/less/variable";
    .slide-enter-active,.slide-leave-active {
        transition:all .3s;
    }
    .slide-enter,.slide-leave-to {
        transform: translate3d(100%,0,0)
    }
</style>