<template>
    <transition name="slide">
        <div class="add-song" v-show="showFlag" @click.stop>
            <div class="header">
                <h1 class="title">添加歌曲到列表</h1>
                <div class="close" @click="hide">
                    <i class="icon-close"></i>
                </div>
            </div>
            <div class="search-box-wrapper">
                <search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
            </div>
            <div class="shortcut" v-show="!query">
                <switches :switches="switches" @switch="onSwitch" :currentIndex="switchIndex"></switches>
                <div class="list-wrapper">
                    <scroll class="list-scroll" ref="songList" v-if="switchIndex === 0" :data="playHistory">
                        <div class="list-inner">
                            <song-list :songs="playHistory" @select="selectSong"></song-list>
                        </div>
                    </scroll>
                    <scroll class="list-scroll" ref="searchList" v-if="switchIndex === 1" :data="searchHistory">
                        <div class="list-inner">
                            <search-list :searches="searchHistory"  @select="addQuery" @delete="deleteSearch" ></search-list>
                        </div>
                    </scroll>
                </div> 
            </div>
            <div class="search-result" v-show="query" ref="searchResult">
                <suggest :query="query" @listScroll="blurInput" :showSinger="false" @select="selectSuggest" ref="suggest"></suggest>
            </div>
            <top-tip ref="topTip">
                <div class="tip-title">
                    <i class="icon-ok"></i>
                    <span class="text">1首歌曲已经添加到播放列表</span>
                </div>
            </top-tip>
        </div>
    </transition>
</template>
<script>
    import {mapActions,mapGetters} from 'vuex'
    import SearchBox from '@/base/search-box'
    import Switches from '@/base/switches'
    import Scroll from '@/base/scroll'
    import SongList from '@/base/song-list'
    import SearchList from '@/base/search-list'
    import Suggest from '@/components/suggest'
    import TopTip from '@/base/top-tip'
    import Song from '@/common/js/song'
    import {searchMixin} from '@/common/js/mixin'
    export default {
        mixins:[searchMixin],
        components: {
            SearchBox,
            Switches,
            Scroll,
            SongList,
            SearchList,
            Suggest,
            TopTip
        },
        data() {
            return {
                showFlag: false,
                switches: [
                    {
                        name: '最近播放'
                    },
                    {
                        name: '搜索历史'
                    }
                ],
                switchIndex: 0
            }
        },
        computed: {
            ...mapGetters([
                'playHistory'
            ])
        },
        methods: {
            show() {
                this.showFlag = true
                setTimeout(() => {
                    if (this.switchIndex === 0) {
                        this.$refs.songList.refresh()
                    } else {
                        this.$refs.searchList.refresh()
                    }
                }, 20)
            },
            hide() {
                this.showFlag = false
            },
            onSwitch(index) {
                this.switchIndex = index
            },
            selectSong(song,index){
                if (index !== 0) {
                    this.insertSong(new Song(song))
                    this.$refs.topTip.show()
                }
            },
            selectSuggest(){
                this.$refs.topTip.show()
                this.saveSearch()
            },
            ...mapActions([
                'insertSong'
            ])

        }
    }
</script>
<style lang="less" scoped>
    @import "~@/common/less/variable";
    @import "~@/common/less/mixin";

    .add-song {
        position:fixed;
        top:0;
        bottom:0;
        width:100%;
        z-index:200;
        background: @color-background;
        &.slide-enter-active, &.slide-leave-active {
            transition: all .3s;
        }
        &.slide-enter, &.slide-leave-to {
            transform: translate3d(100%, 0, 0)
        }
        .header {
            position: relative;
            height: 44px;
            text-align: center;
            .title {
                line-height: 44px;
                font-size: @font-size-large;
                color: @color-text;
            }
            .close {
                position: absolute;
                top: 0;
                right: 8px;
                .icon-close {
                    display: block;
                    padding: 12px;
                    font-size: 20px;
                    color: @color-theme;
                }
            }
        }
        .search-box-wrapper {
            margin: 20px;
        }
        .shortcut {
            .list-wrapper {
                position: absolute;
                top:165px;
                bottom: 0;
                width: 100%;
                .list-scroll {
                    height: 100%;
                    overflow: hidden;
                    .list-inner {
                        padding: 20px 30px;
                    }
                }
            }
        }
        .search-result {
            position: fixed;
            top:124px;
            bottom:0;
            width:100%;
        }
        .tip-title {
            text-align: center;
            padding: 18px 0;
            font-size: 0;
            .icon-ok {
                font-size: @font-size-medium;
                color: @color-theme;
                margin-right: 4px;
            }
            .text {
                font-size: @font-size-medium;
                color: @color-text
            }
        }
        
    }
</style>