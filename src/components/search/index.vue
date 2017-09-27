<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
            <scroll class="shortcut" ref="shortcut" :data="shortcut">
                <div>
                    <div class="hot-key">
                        <h1 class="title">
                            热门搜索
                        </h1>
                        <ul>
                            <li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="showConfirm">
                                <i class="icon-clear"></i>
                            </span>
                        </h1>
                        <search-list @select="addQuery" @delete="deleteSearch" :searches="searchHistory"></search-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest @listScroll="blurInput" @select="saveSearch" ref="suggest" :query="query"></suggest> 
        </div>
        <confirm ref="confirm" :text="'确认清空吗?'" @sure="clearSearch"></confirm>
        <router-view></router-view>
    </div>
</template>
<script>
    import SearchBox from '@/base/search-box'
    import Scroll from '@/base/scroll'
    import SearchList from '@/base/search-list'
    import Confirm from '@/base/confirm'
    import Suggest from '@/components/suggest'
    import {getHotKey} from '@/api/search'
    import {ERR_OK} from '@/api/config'
    import {playlistMixin} from '@/common/js/mixin'
    import {mapActions,mapGetters} from 'vuex'
    export default {
        mixins:[playlistMixin],
        components: {
            SearchBox,
            Scroll,
            SearchList,
            Suggest,
            Confirm
        },
        data(){
            return {
                hotKey:[],
                query:''
            }
        },
        created() {
            this._getHotKey()
        },
        computed: {
            shortcut() {
                return this.hotKey.concat(this.searchHistory)
            },
            ...mapGetters([
                'searchHistory'
            ])
        },
        methods:{
            handlePlaylist(playlist){
                const bottom = playlist.length > 0 ? '60px' : ''
                this.$refs.shortcutWrapper.style.bottom = bottom
                this.$refs.shortcut.refresh()
                this.$refs.searchResult.style.bottom = bottom
                this.$refs.suggest.refresh()
            },
            onQueryChange(query) {
                this.query = query
            },
            addQuery(query) {
                this.$refs.searchBox.setQuery(query)
            },
            _getHotKey() {
                getHotKey().then((res) => {
                    if(res.code === ERR_OK){
                        this.hotKey = res.data.hotkey.slice(0,10)
                    }
                })
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
            clearSearch(){
                this.clearSearchHistory()
            },
            showConfirm(){
              this.$refs.confirm.show()  
            },
            ...mapActions([
                'saveSearchHistory',
                'deleteSearchHistory',
                'clearSearchHistory'
            ])
        },
        watch: {
            query(newQuery) {
                if(!newQuery) {
                    setTimeout(() => {
                        this.$refs.shortcut.refresh()
                    })
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    @import '~@/common/less/variable';
    @import "~@/common/less/mixin";
    .search {
        .search-box-wrapper {
            margin: 20px;
        }
        .shortcut-wrapper {
            position: fixed;
            top:178px;
            bottom:0;
            width:100%;
            .shortcut {
                height: 100%;
                overflow:hidden;
                .hot-key {
                    margin: 0 20px 20px 20px;
                    .title {
                        margin-bottom:20px;
                        font-size: @font-size-medium;
                        color: @color-text-l;
                    }
                    .item {
                        display: inline-block;
                        padding: 5px 10px;
                        margin: 0 8px 10px 0;
                        border-radius: 6px;
                        background: @color-highlight-background;
                        font-size: @font-size-medium;
                        color: @color-text-d;
                    }
                }
                .search-history {
                    position: relative;
                    margin:0 20px;
                    .title {
                        display: flex;
                        align-items: center;
                        height: 40px;
                        font-size: @font-size-medium;
                        color: @color-text-l;
                        .text {
                            flex:1;
                        }
                        .clear {
                            .extend-click();
                            .icon-clear {
                                font-size: @font-size-medium;
                                color: @color-text-d;
                            }
                        }
                    }
                }
            }
        }
        .search-result {
            position:fixed;
            width:100%;
            top:178px;
            bottom:0
        }
    }
</style>