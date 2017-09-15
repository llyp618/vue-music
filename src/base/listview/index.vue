<template>
    <scroll class="listview" ref="listview" @scroll="scroll" :listen-scroll="listenScroll" :probe-type="probeType" :data="data">
        <ul>
            <li class="list-group" v-for="group in data" ref="listGroup">  <!-- 这里的ref 会生成一个数组 存储dom索引 -->
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li class="list-group-item" v-for="item in group.items" :key="item.id">
                        <img class="avatar" v-lazy="item.avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop>
            <ul>
                <li class="item" v-for="(item, index) in shortcutList" :data-index="index" :class="{'current':currentIndex===index}">{{item}}</li>
            </ul>
        </div>
        
        <div class="list-fixed" ref="fixed" v-show="fixedTitle">
            <div class="fixed-title">{{fixedTitle}} </div>
        </div>
        <div class="loading-container" v-show="!data.length">
            <loading></loading>
        </div>
    </scroll>
</template>
<script>
    import Scroll from '@/base/scroll'
    import {getData} from '@/common/js/dom'
    import Loading from '@/base/loading'
    const TITLE_HEIGHT = 30
    const ANCHOR_HEIGHT = 18
    export default {
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        components:{
            Scroll,
            Loading
        },
        created() {
            this.probeType = 3 
            // 开启scroll滚动监听
            this.listenScroll = true 
            this.touch = {} 
            // 存储每个歌手组元素顶部距离 scroll元素顶部的高度
            this.listHeight = []
        },
        data() {
            return {
                // 记录scroll的y轴滚动高度
                scrollY: -1, 
                // 记录当前组的index
                currentIndex: 0,
                diff: -1
            }
        },
        computed: {
            shortcutList() {
                return this.data.map((group) => {
                    return group.title.substr(0, 1)
                })
            },
            fixedTitle() {
                if (this.scrollY > 0) {
                    return ''
                }
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
            }
        },
        methods: {
            refresh() {
                this.$refs.listview.refresh()
            },
            scroll(pos) {
                /** 
                    pos: better-scroll 滚动事件传递的对象参数
                    scroll滚动后变动scrollY
                */
                this.scrollY = pos.y
            },
            onShortcutTouchStart(e) {
                let anchorIndex = getData(e.target,'index')
                let firstTouch = e.touches[0]
                this.touch.y1 = firstTouch.pageY
                this.touch.anchorIndex = anchorIndex
                this._scrollTo(anchorIndex)
            },
            onShortcutTouchMove(e) {
                // e.touchs[0] 触摸事件对象
                let firstTouch = e.touches[0]
                this.touch.y2 = firstTouch.pageY
                // 位运算 | 可以向下取整
                let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
                let anchorIndex = parseInt(this.touch.anchorIndex) + delta
                this._scrollTo(anchorIndex)
            },
            _calculateHeight() {
                this.listHeight = [] 
                const list = this.$refs.listGroup
                let height = 0
                // 先存储第一个组距离顶部的高度
                this.listHeight.push(height) 
                for (let i = 0; i < list.length - 1; i++) {
                    let item = list[i]
                    // 每个循环累加height并存储，以分别存储每个组元素距离顶端的距离
                    height += item.clientHeight
                    this.listHeight.push(height)
                }
            },
            _scrollTo(index) {
                if (!index && index !== 0) {
                    return 
                }
                if (index < 0) {
                    index = 0
                } else if (index > this.listHeight.length - 1) {
                    index = this.listHeight.length - 1
                }
                this.scrollY = -this.listHeight[index]
                this.$refs.listview.scrollToElement(this.$refs.listGroup[index],200,0,4)
            }
        },
         
        watch: {
            data() {
                setTimeout(() => {
                    this._calculateHeight()
                },20)
            },
            // 监视 this.scrollY 
            scrollY(newY) {
                const listHeight = this.listHeight
                if(newY > 0) {
                    this.currentIndex = 0
                    return 
                }
                for(let i = 0; i < listHeight.length - 1; i++){
                    let height1 = listHeight[i]
                    let height2 = listHeight[i + 1]
                    // 高度在两者之间是指定对应的currentIndex
                    if(-newY > height1 && -newY <= height2) {
                        this.currentIndex = i
                        this.diff = height2 + newY
                        return
                    }
                }
                this.currentIndex = listHeight.length - 1
            },
            diff(newVal) {
                let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
                if (this.fixedTop === fixedTop) {
                    return
                }
                this.fixedTop = fixedTop
                this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "~@/common/less/variable";
    .listview {
        position:relative;
        width:100%;
        height:100%;
        overflow:hidden;
        background: @color-background;
        .list-group {
            padding-bottom:30px;
            .list-group-title {
                height:30px;
                line-height:30px;
                padding-left:20px;
                font-size: @font-size-small;
                color: @color-text-l;
                background: @color-highlight-background;
            }
            .list-group-item {
                display:flex;
                align-items:center;
                padding:20px 0 0 30px;
                .avatar {
                    width:50px;
                    height:50px;
                    border-radius:50px;
                }
                .name {
                    margin-left:20px;
                    color: @color-text-l;
                    font-size:@font-size-medium;
                }
            }
        }
    }
    .list-shortcut {
        position:absolute;
        z-index:30;
        right:5px;
        top:50%;
        transform:translateY(-50%);
        width:20px;
        padding:20px 0;
        border-radius:10px;
        text-align:center;
        background: @color-background-d;
        font-family:Helvetica;
        .item {
            padding:3px;
            line-height:1;
            color: @color-text-l;
            font-size:@font-size-small;
            &.current {
                color: @color-theme;
            }
        }
    }
    .list-fixed {
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:30px;
        line-height:30px;
        padding-left:20px;
        box-sizing:border-box;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
    }
    .loading-container {
        position:absolute;
        top:50%;
        width:100%;
        text-align:center;
        transform:translateY(-50%);
    }
</style>