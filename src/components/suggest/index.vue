<template>
    <scroll class="suggest" 
            ref="suggest" 
            :data="result" 
            :pullup="pullup"
            :beforeScroll="beforeScroll"
            @scrollToEnd="searchMore"
            @beforeScroll="listScroll"        
    >
        <ul class="suggest-list">
            <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div v-show="!hasMore && !result.length" class="no-result-wrapper">
            <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
    </scroll>
</template>
<script>
    import Scroll from '@/base/scroll'
    import Loading from '@/base/loading'
    import NoResult from '@/base/no-result'
    import {search} from '@/api/search'
    import {ERR_OK} from '@/api/config'
    import {createSong} from '@/common/js/song'
    import Singer from '@/common/js/singer'
    import {mapMutations, mapActions} from 'vuex'

    const TYPE_SINGER = 'singer'
    const perpage = 20

    export default {
        props: {
            query:{
                type: String,
                default: ''
            },
            showSinger:{
                type: Boolean,
                default: true
            }
        },
        components: {
            Scroll,
            Loading,
            NoResult
        },
        data() {
            return {
                page: 1,
                pullup: true,
                beforeScroll: true,
                hasMore: true, 
                result: []
            }
        },
        methods:{
            refresh() {
                this.$refs.suggest.refresh()
            },
            search(){
                this.page = 1
                this.hasMore = true
                this.$refs.suggest.scrollTo(0, 0)
                search(this.query, this.page, this.showSinger, perpage).then((res) => {
                    if(res.code === ERR_OK) {
                        this.result = this._getResult(res.data)
                        this._checkMore(res.data)
                    }
                })
            },
            searchMore(){
                if(!this.hasMore) {
                    return
                }
                this.page++
                search(this.query, this.page, this.showSinger,perpage).then((res) => {
                    if(res.code === ERR_OK) {
                        this.result = this.result.concat(this._getResult(res.data)) 
                        this._checkMore(res.data)
                    }
                })
            },
            _getResult(data) {
                let ret = []
                if (data.zhida && data.zhida.singerid) {
                    ret.push({...data.zhida,...{type: TYPE_SINGER}})
                }
                if (data.song) {
                    ret = ret.concat(this._normalizeSongs(data.song.list))
                }
                return ret
            },
            _checkMore(data) {
                const song = data.song
                if(!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum){
                    this.hasMore = false
                }
            },
            listScroll() {
                this.$emit('listScroll')
            },
            getDisplayName(item) {
                if(item.type === TYPE_SINGER){
                    return item.singername
                } else {
                    return `${item.name}-${item.singer}`
                }
            },
            getIconCls(item) {
                if (item.type === TYPE_SINGER) {
                    return 'icon-mine'
                } else {
                    return 'icon-music'
                }
            },
            _normalizeSongs(list) {
                let ret = []
                list.forEach((musicData) => {
                if (musicData.songid && musicData.albummid) {
                    ret.push(createSong(musicData))
                }
                })
                return ret
            },
            selectItem(item) {
                if (item.type === TYPE_SINGER) {
                    const singer = new Singer({
                        id: item.singermid,
                        name: item.singername
                    })
                    this.$router.push({
                        path: `/search/${singer.id}`
                    })
                    this.SET_SINGER(singer)
                } else {
                    this.insertSong(item)
                }
                // 派发选中事件 给search
                this.$emit('select', item)
            },
            ...mapMutations([
                'SET_SINGER'
            ]),

            ...mapActions([
                'insertSong'
            ])

        },
        watch: {
            query(newQuery){
                this.search(newQuery)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "~@/common/less/variable";
    @import "~@/common/less/mixin";
    .suggest {
        height: 100%;
        overflow: hidden;
        .suggest-list {
            padding:0 30px;
            .suggest-item {
                display: flex;
                align-items: center;
                padding-bottom: 20px;
            }
            .icon {
                flex: 0 0 30px;
                width: 30px;
                [class^="icon-"] {
                    font-size:14px;
                    color: @color-text-d;
                }
            }
            .name {
                flex: 1;
                font-size: @font-size-medium;
                color: @color-text-d;
                overflow:hidden;
                .text {
                    white-space:nowrap;
                    text-overflow:ellipsis;
                    overflow:hidden;
                }
            }
        }
        .no-result-wrapper {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%)
        }
    }
</style>