<template>
    <div class="rank" ref="rank">
        <scroll class="toplist" :data="toplist" ref="toplist">
            <ul>
                <li class="item" v-for="item in toplist" @click="selectItem(item)">
                    <div class="icon">
                        <img v-lazy="item.picUrl" alt="" width="100" height="100">
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song, index) in item.songList">
                            <span>{{index + 1}}</span>
                            <span>{{song.songname}}-{{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-container" v-show="!toplist.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>
<script>
    import Scroll from '@/base/scroll'
    import Loading from '@/base/loading'
    import {getTopList} from '@/api/rank'
    import {ERR_OK} from '@/api/config'
    import {playlistMixin} from '@/common/js/mixin'
    import {mapMutations} from 'vuex'
    export default {
        mixins: [playlistMixin],
        components:{
            Scroll,
            Loading
        },
        data() {
            return {
                toplist: []
            }
        },
        created() {
            this._getTopList()
        },
        methods: {
            handlePlaylist(playlist) {
                const bottom = playlist.length > 0 ? '60px' : ''
                this.$refs.rank.style.bottom = bottom
                this.$refs.toplist.refresh()
            },
            _getTopList() {
                getTopList().then((res) => {
                    if(res.code === ERR_OK) {
                        this.toplist = res.data.topList
                    }
                })
            },
            selectItem(item) {
                this.SET_TOP_LIST(item)
                this.$router.push({
                    path:`/rank/${item.id}`
                })
            },
            ...mapMutations([
                'SET_TOP_LIST'
            ])
        }
    }
</script>
<style scoped lang="less">
    @import '~@/common/less/variable';
    @import '~@/common/less/mixin';

    .rank {
        position:fixed;
        top:88px;
        bottom:0px;
        width:100%;
    }
    .toplist {
        width:100%;
        height:100%;
        overflow:hidden;
        .item {
            display:flex;
            align-items:center;
            margin:0 20px;
            padding-top:20px;
            height: 100px;
            &:last-child {
                padding-bottom:20px;
            }
            .icon {
                flex:0 0 100px;
                width:100px;
                height:100px;
            }
            .songlist {
                flex:1;
                display:flex;
                flex-direction:column;
                justify-content:center;
                padding:0 20px;
                height: 100px;
                overflow:hidden;
                background:@color-highlight-background;
                color:@color-text-d;
                font-size:@font-size-small;
                .song {
                    line-height:26px;
                    .no-wrap()
                }
            }
        }
    }
    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
</style>