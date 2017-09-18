<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="{backgroundImage: `url(${bgImage})`}" ref="bgImage">
            <div class="play-wrapper" ref="playButton" v-show="songs.length">
                <div class="play">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter">
            </div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll class="list" ref="list" :data="songs" :probe-type="probeType" :listen-scroll="listenScroll" @scroll="scroll">
            <div class="song-list-wrapper">
                <song-list :songs="songs"></song-list>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>
<script>
    import Scroll from '@/base/scroll'
    import Loading from '@/base/loading'
    import SongList from '@/base/song-list'
    import {prefixStyle} from '@/common/js/dom'

    const TRANSFORM = prefixStyle('transform')
    const BACKDROP = prefixStyle('backdrop-filter')
    console.log(BACKDROP)
    export default {
        props:{
            title: {
                type: String,
                default: ''
            },
            bgImage: {
                type: String,
                default: ''
            },
            songs: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                scrollY: 0
            }
        },
        components: {
            Scroll,
            Loading,
            SongList
        },
        methods: {
            back(){
                this.$router.back()
            },
            scroll(pos) {
                this.scrollY = pos.y
            }
        },
        watch: {
            scrollY(newY) {
                let scale = 1
                let blur = 0
                let percent = Math.abs(newY / this.imageHeight)
                let isOverMinTranslateY = newY < this.minTranslateY
                let Y = isOverMinTranslateY ? this.minTranslateY : newY
                this.$refs.layer.style[TRANSFORM] = `translate3d(0,${Y}px,0)`
               
                if(isOverMinTranslateY) {
                    this.bgImageStyle.paddingTop = 0
                    this.bgImageStyle.zIndex = 10
                    this.bgImageStyle.height = '40px'
                    this.playBtnStyle.display = 'none'
                } else {
                    this.bgImageStyle.paddingTop = '70%'
                    this.bgImageStyle.zIndex = 0
                    this.bgImageStyle.height = 0
                    this.playBtnStyle.display = ''
                }
                if(newY > 0) {
                    scale = 1 + percent
                    this.bgImageStyle[TRANSFORM] = `scale(${scale})`
                    this.bgImageStyle.zIndex = 10
                }else {
                    blur = Math.min(20, percent * 20)
                    this.$refs.filter.style[BACKDROP] = `blur(${blur}px)`
                }
            }
        },
        mounted() {
            this.imageHeight = this.$refs.bgImage.clientHeight
            this.minTranslateY = -this.imageHeight + 40
            this.bgImageStyle = this.$refs.bgImage.style
            this.playBtnStyle = this.$refs.playButton.style
            this.$refs.list.$el.style.top = `${this.imageHeight}px`
        },
        created() {
            this.probeType = 3 
            this.listenScroll = true
        }
        
    }
</script>
<style lang="less" scoped>
    @import '~@/common/less/variable';
    @import '~@/common/less/mixin';
    .music-list {
        position:fixed;
        z-index:100;
        top:0;
        left:0;
        bottom:0;
        right:0;
        background: @color-background;
        .back {
            position:absolute;
            top:0;
            left:6px;
            z-index:50;
            .icon-back {
                display: block;
                padding: 10px;
                font-size: @font-size-large-x;
                color: @color-theme;
            }
        }
        .title {
            position:absolute;
            top:0;
            left:10%;
            z-index:40;
            width:80%;
            text-align:center;
            line-height:40px;
            font-size:@font-size-large;
            color:@color-text;
            .no-wrap()
        }
        .bg-image {
            position:relative;
            width:100%;
            height:0;
            padding-top:70%;
            transform-origin:top;
            background-size:cover;
            background-repeat:no-repeat;
            .play-wrapper {
                position:absolute;
                bottom:20px;
                z-index:50;
                width:100%;
                .play {
                    box-sizing:border-box;
                    width:135px;
                    padding:7px 0;
                    margin:0 auto;
                    text-align:center;
                    border:1px solid @color-theme;
                    color:@color-theme;
                    border-radius:100px;
                    font-size:0;
                    .icon-play {
                        display:inline-block;
                        vertical-align:middle;
                        margin-right:6px;
                        font-size:@font-size-medium-x;
                    }
                    .text {
                        display:inline-block;
                        vertical-align:middle;
                        font-size:@font-size-small;
                    }
                }
            }
            .filter {
                position:absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
                background:rgba(7,17,27,0.4)
            }
            
        }
        .bg-layer {
            position:relative;
            height:100%;
            background:@color-background;
        }
        .list {
            position:fixed;
            top:0;
            bottom:0;
            width:100%;
            background:@color-background;
            .song-list-wrapper {
                padding:20px 30px;
            }
            .loading-container {
                position:absolute;
                width:100%;
                top:50%;
                transform:translateY(-50%);
            }
        }
    }
</style>
