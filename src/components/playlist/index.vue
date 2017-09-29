<template>
    <transition name="list-fade">
        <div class="playlist" v-show="show" @click="close">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="icon" :class="iconMode" @click.top="selectMode">
                        </i>
                        <span class="text">
                            {{textMode}}
                        </span>
                        <span class="clear" @click="showConfirm">
                            <i class="icon-clear"></i>
                        </span>
                    </h1>
                </div>
                <scroll class="list-content" :data="sequenceList" ref="listContent" :refreshDelay="refreshDelay">
                    <transition-group name="list" tag="ul">
                        <li class="item" v-for="(item, index) in sequenceList"  ref="items" :key="item.id">
                            <i class="current" :class="getCurrentIcon(item)"></i>
                            <span class="text" @click.stop="selectSong(item,index)">{{item.name}}</span>
                            <span class="like" @click.stop="toggleFavorite(item)" >
                               <i class="icon" :class="getFavoriteIcon(item)"></i>
                            </span>
                            <span class="delete" @click.stop="_deleteSong(item)">
                                <i class="icon-delete"></i>
                            </span>
                        </li>
                    </transition-group>
                </scroll>
                <div class="list-operate">
                    <div class="add" @click="addSong">
                        <i class="icon-add"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div class="list-close" @click="close">
                    <span>关闭</span>
                </div>
            </div>
            <confirm text="确认清空播放列表吗？" ref="confirm" @sure="_clearPlaylist"></confirm>
            <add-song ref="addSong"></add-song>
        </div>
    </transition>
</template>
<script>
    import {mapGetters,mapMutations,mapActions} from 'vuex'
    import Scroll from '@/base/scroll'
    import Confirm from '@/base/confirm'
    import AddSong from '@/components/add-song'
    import {playMode} from '@/common/js/config'
    import {shuffle} from '@/common/js/util'
    import {playerMixin} from '@/common/js/mixin'
    export default {
        mixins:[playerMixin],
        components:{
            Scroll,
            Confirm,
            AddSong
        },
        data() {
            return {
                show: false,
                refreshDelay: 220
            }
        },
        computed: {
            iconMode(){
                return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
            },
            textMode(){
                return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
            }
        },
        methods: {
            open() {
                this.show = true
                setTimeout(() => {
                    this.$refs.listContent.refresh()
                    this.scrollToCurrent(this.currentSong)
                },20)
            },
            close() {
                this.show = false
            },
            getCurrentIcon(item){
                return item.id === this.currentSong.id ? 'icon-play' : ''
            },
            selectSong(item, index) {
                if (this.mode === playMode.random) {
                    index = this.playlist.findIndex((song) => {
                        return song.id === item.id
                    })
                }
                this.SET_CURRENT_INDEX(index)
                this.SET_PLAYING_STATE(true)
            },
            scrollToCurrent(current){
                let i = this.sequenceList.findIndex((item) => {
                    return current.id === item.id
                })
                let currentItem = this.$refs.items[i]
                this.$refs.listContent.scrollToElement(currentItem, 300)
            },
            _deleteSong(song) {
                this.deleteSong(song)
                if (!this.playlist.length) {
                    this.close()
                }
            },
            showConfirm(){
                this.$refs.confirm.show()
            },
            _clearPlaylist(){
                this.close()
                this.clearPlaylist()
            },
            addSong() {
                this.$refs.addSong.show()
            },
            ...mapMutations([
                'SET_CURRENT_INDEX',
                'SET_PLAYING_STATE',
                'SET_PLAYLIST',
                'SET_PLAY_MODE'
            ]),
            ...mapActions([
                'deleteSong',
                'clearPlaylist'
            ])
        },
        watch: {
            currentSong(newSong, oldSong){
                if (!this.show || newSong.id === oldSong.id) {
                    return
                }
                this.scrollToCurrent(newSong)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "~@/common/less/variable";
    @import "~@/common/less/mixin";
    .playlist {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 200;
        background-color: @color-background-d;
        &.list-fade-enter-active, &.list-fade-leave-active {
            transition:opacity .3s;
            .list-wrapper {
                transition:all .3s;
            }
        }
        &.list-fade-enter, &.list-fade-leave-to {
            opacity:0;
            .list-wrapper {
                transform: translate3d(0, 100%, 0)
            }
        }
        .list-wrapper {
            position:absolute;
            bottom:0;
            left:0;
            right:0;
            width:100%;
            background-color: @color-highlight-background;
            .list-header {
                position: relative;
                padding: 20px 30px 10px 20px;
                .title {
                    display:flex;
                    align-items:center;
                    .icon {
                        margin-right:10px;
                        font-size:30px;
                        color: @color-theme-d;
                    }
                    .text {
                        flex:1;
                        font-size: @font-size-medium;
                        color: @color-text-l;
                    }
                    .clear {
                        .icon-clear {
                            font-size: @font-size-medium;
                            color: @color-text-d;
                        }
                        .extend-click()
                    }
                }
            }
            .list-content {
                overflow:hidden;
                max-height:240px;
                .item {
                    display:flex;
                    align-items:center;
                    height:40px;
                    padding: 0 30px 0 20px;
                    overflow:hidden;
                    &.list-enter-active, &.list-leave-active {
                        transition: all 0.2s;
                    }
                    &.list-enter, &.list-leave-to {
                        height:0
                    }
                    .current {
                        font-size: @font-size-small;
                        color: @color-theme-d;
                        flex: 0 0 20px;
                        width: 20px;
                    }
                    .text {
                        flex:1;
                        font-size: @font-size-medium;
                        color: @color-text-d;
                        .no-wrap()
                    }
                    .like {
                        margin-right:15px;
                        font-size: @font-size-small;
                        color: @color-theme;
                        .extend-click();
                        .icon-favorite {
                            color: @color-sub-theme;
                        }
                    }
                    .delete {
                        font-size:@font-size-small;
                        color: @color-theme;
                    }
                }
            }
            .list-operate {
                .add {
                    width: 140px;
                    margin: 20px auto 30px auto;
                    display: flex;
                    align-items: center;
                    box-sizing:border-box;
                    padding:8px 16px;
                    border: 1px solid @color-text-l;
                    border-radius: 100px;
                    color: @color-text-l;
                    .icon-add {
                        margin-right: 5px;
                        font-size: @font-size-small-s;
                    }
                    .text {
                        font-size: @font-size-small;
                    }
                }
            }
            .list-close {
                text-align: center;
                line-height: 50px;
                background: @color-background;
                font-size: @font-size-medium-x;
                color: @color-text-l;
            }
        }
    }
</style>