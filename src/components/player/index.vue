<template>
	<div class="player" v-show="playlist.length>0">
		<transition name="normal"
					@enter="enter"
					@after-enter="afterEnter"
					@leave="leave"
					@afterLeave="afterLeave"
		>
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
					<img width="100%" height="100%">
				</div>
				<div class="top">
					<div class="back" @click="back">
						<i class="icon-back"></i>
					</div>
					<h1 class="title" v-html="currentSong.name"></h1>
					<h2 class="subtitle" v-html="currentSong.singer"></h2>
				</div>
				<div class="middle">
					<div class="middle-l">
						<div class="cd-wrapper" ref="cdWrapper">
							<div class="cd" :class="playing ? 'play' : 'play pause'">
								<img :src="currentSong.image" alt="" class="image" >
							</div>
						</div>
					</div>
				</div>
				<div class="bottom">
					<div class="progress-wrapper">
						<span class="time time-l">
							{{format(currentTime)}}
						</span>
						<div class="progress-bar-wrapper">
							<progress-bar :percent="percent" @percentChange="onPercentChange"></progress-bar>
						</div>
						<span class="time time-r">
							{{format(currentSong.duration)}}
						</span>
					</div>
					<div class="operators">
						<div class="icon i-left">
							<i class="icon-sequence"></i>
						</div>
						<div class="icon i-left" :class="songReady ? '' : 'disable'">
							<i class="icon-prev" @click="selectPrev"></i>
						</div>
						<div class="icon i-center" :class="songReady ? '' : 'disable'">
							<i @click="togglePlaying" :class="playing ? 'icon-pause' : 'icon-play'"></i>
						</div>
						<div class="icon i-right" :class="songReady ? '' : 'disable'">
							<i class="icon-next" @click="selectNext"></i>
						</div>
						<div class="icon i-right">
							<i class="icon icon-not-favorite"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<div class="mini-player" v-show="!fullScreen">
			<div class="icon" @click="open">
			    <img width="40" height="40" :src="currentSong.image" :class="playing ? 'play' : 'play pause'">
			</div>
			<div class="text">
				<h2 class="name" v-html="currentSong.name"></h2>
				<p class="desc" v-html="currentSong.singer"></p>
			</div>
			<div class="control">
				<i :class="playing ? 'icon-pause-mini' : 'icon-play-mini'" @click="togglePlaying"></i>
			</div>
			<div class="control">
			    <i class="icon-playlist"></i>
			</div>
		</div>
		<audio ref="audio" :src="currentSong.url" :paused="!playing" @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
	</div>
</template>
<script>
import {mapGetters,mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from '@/common/js/dom'
import progressBar from '@/base/progress-bar'

const TRANSFORM = prefixStyle('transform')
const TRANSITION = prefixStyle('transition')
export default {
	data() {
		return {
			songReady: false,
			currentTime: 0
		}
	},
	components:{
		progressBar
	},
	computed: {
		percent(){
			return this.currentTime / this.currentSong.duration
		},
		...mapGetters([
			'fullScreen',
			'playlist',
			'currentSong',
			'playing',
			'currentIndex'
		])
	},
	methods: {
		back() {
			this.SET_FULL_SCREEN(false)
		},
		open() {
			this.SET_FULL_SCREEN(true)
		},
		enter(el,done){
			const {x,y,scale} = this._getPosAndScale()
			let animation = {
				0: {
					transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
				},
				60: {
					transform:`translate3d(0,0,0) scale(1.1)`
				},
				100: {
					transform:`translate3d(0,0,0) scale(1.0)`
				}
			}
			animations.registerAnimation({
				name:'move',
				animation,
				presets:{
					duration:300,
					easing:'linear'
				}
			})

			animations.runAnimation(this.$refs.cdWrapper,'move',done)
		},
		afterEnter(){
			animations.unregisterAnimation('move')
			this.$refs.cdWrapper.style.animation = ''
		},
		leave(el,done){
			this.$refs.cdWrapper.style[TRANSITION] = 'all 0.4s'
			const {x,y,scale} = this._getPosAndScale()
			this.$refs.cdWrapper.style[TRANSFORM] = `translate3d(${x}px,${y}px,0) scale(${scale})`
			this.$refs.cdWrapper.addEventListener('transitionend', done)
		},
		afterLeave(){
			this.$refs.cdWrapper.style[TRANSITION] = ''
			this.$refs.cdWrapper.style[TRANSFORM] = ''
		},
		_getPosAndScale() {
			const targetWidth = 40
			const paddingLeft = 40
			const paddingBottom = 30
			const paddingTop = 80
			const width = window.innerWidth * 0.8
			const scale = targetWidth / width
			const x = -(window.innerWidth / 2 - paddingLeft)
			const y = window.innerHeight - paddingTop - width / 2 - paddingTop
			return {
				x,
				y,
				scale
			}
		},
		togglePlaying(){
			this.SET_PLAYING_STATE(!this.playing)
		},
		selectNext(){
			if(!this.songReady){  // 防止快速点击
				return
			}
			this.songReady = false
			let nextIndex = this.currentIndex + 1 
			let index = nextIndex > this.playlist.length - 1 ? 0 : nextIndex
			this.SET_CURRENT_INDEX(index)
			if(!this.playing){
				this.togglePlaying()
			}
		},
		selectPrev(){
			if(!this.songReady){
				return
			}
			this.songReady = false
			let prevIndex = this.currentIndex - 1 
			let index = prevIndex < 0 ? this.playlist.length - 1 : prevIndex
			this.SET_CURRENT_INDEX(index)
			if(!this.playing){
				this.togglePlaying()
			}
		},
		ready() {
			this.songReady = true
		},
		error() {
			this.songReady = true
		},
		updateTime(e) {
			this.currentTime = e.target.currentTime
		},
		format(interval) {
			interval = interval | 0
			let minute = '' + interval / 60 | 0
			let second = '' + interval % 60
			second = second.length < 2 ? ('0' + second) : second
			return `${minute}:${second}`
		},
		onPercentChange(percent) {
			const currentTime = this.currentSong.duration * percent
			this.$refs.audio.currentTime = currentTime  // 会触发updatetime 事件
			if (!this.playing) {
				this.togglePlaying()
			}
		},
		...mapMutations([
			'SET_FULL_SCREEN',
			'SET_PLAYING_STATE',
			'SET_CURRENT_INDEX'
		])
	},
	watch: {
		currentSong(){
			this.$nextTick(() => {
				this.$refs.audio.play()
			})
		},
		playing(state){
			let audio = this.$refs.audio
			this.$nextTick(() => {
				state ? audio.play() : audio.pause()
			})
		}
	}
}
</script>
<style scoped lang="less">
	@import "~@/common/less/variable";
	@import "~@/common/less/mixin";
	.player {
		.normal-player {
			position:fixed;
			left:0;
			right:0;
			top:0;
			bottom:0;
			z-index:150;
			background:@color-background;
			
			&.normal-enter-active,&.normal-leave-active {
				transition:all 0.4s;
				.top, .bottom {
					transition: all 0.4s cubic-bezier(0.42, 0.09, 0.43, 1.44);
				} 
			}
			&.normal-enter,&.normal-leave-to {
				opacity:0;
				.top {
					transform:translate3d(0,-100px,0)
				}
				.bottom {
					transform:translate3d(0,100px,0)
				}
				
			}
			.background {
				position: absolute;
				left:0;
				top:0;
				width:100%;
				height:100%;
				z-index:-1;
				opacity:0.6;
				filter:blur(20px)
			}
			.top {
				position:relative;
				margin-bottom:25px;
				.back {
					position:absolute;
					top:0;
					left:6px;
					z-index:50;
					.icon-back {
						display:block;
						padding:9px;
						font-size:@font-size-large-x;
						color:@color-theme;
						transform:rotate(-90deg)
					}
				}
				.title {
					width:70%;
					margin:0 auto;
					line-height:40px;
					text-align:center;
					font-size:@font-size-large;
					color:@color-text;
					.no-wrap()
				}
				.subtitle {
					line-height:20px;
					text-align:center;
					font-size:@font-size-medium;
					color:@color-text;
				}
			}
			.middle {
				position:fixed;
				width:100%;
				top:80px;
				bottom:170px;
				white-space:nowrap;
				font-size:0;
				.middle-l {
					position:relative;
					display: inline-block;
					vertical-align: top;
					width:100%;
					height:0;
					padding-top:80%;
					.cd-wrapper {
						position:absolute;
						left:10%;
						top:0;
						width:80%;
						height:100%;
						.cd {
							width:100%;
							height:100%;
							box-sizing:border-box;
							border:10px solid rgba(255,255,255,0.1);
							border-radius:50%;
							position:relative;
							&.play {
								animation:rotate 20s linear infinite;
							}
							&.pause {
								animation-play-state:paused;
							}
							.image{
								position:absolute;
								left:0;
								top:0;
								width:100%;
								height:100%;
								border-radius:50%;
							}
						}
					}
				}
			}
			.bottom {
				position: absolute;
				bottom:50px;
				width:100%;
				.progress-wrapper {
					display:flex;
					align-items:center;
					width:80%;
					margin:0px auto;
					padding:10px 0;
					.time {
						flex:0 0 30px;
						color: @color-text;
						font-size:@font-size-small;
						line-height:30px;
						width:30px;
						&.time-l {
							text-align:left;
						}
						&.time-r {
							text-align:right;
						} 
					}
					.progress-bar-wrapper {
						flex:1;
					}
				}
				.operators {
					display:flex;
					align-items:center;
					.icon {
						flex:1;
						color:@color-theme;
						&.disable {
							color:@color-theme-d;
						}
						i {
							font-size:30px;
						}
					}
					.i-left {
						text-align:right;
					}
					.i-center {
						padding:0 20px;
						text-align:center;
						i {
							font-size:40px;
						}
					}
					.i-right {
						text-align:left;
					}
					.icon-favorite {
						color:@color-sub-theme;
					}
				}
			}
		}
		.mini-player {
			position:fixed;
			left:0;
			bottom:0;
			z-index:180;
			height:60px;
			background: @color-highlight-background;
			width:100%;
			display:flex;
			align-items:center;
			.icon {
				flex: 0 0 40px;
				width:40px;
				padding:0 10px 0 20px;
				img {
					border-radius:50%;
					&.play{
						animation:rotate 10s linear infinite;
					}
					&.pause {
						animation-play-state:paused;
					}
				}
			}
			.text {
				display:flex;
				flex-direction: column;
				justify-content: center;
				flex:1;
				line-height:20px;
				overflow:hidden;
				.name {
					margin-bottom:2px;
					font-size:@font-size-medium;
					color:@color-text;
					.no-wrap()
				}
				.desc {
					.no-wrap();
					font-size:@font-size-small;
					color:@color-text-d;
				}
			}
			.control {
				flex: 0 0 30px;
				width:30px;
				padding:0 10px;
				.icon-play-mini, .icon-pause-mini, .icon-playlist {
					font-size:30px;
					color: @color-theme-d;
				}
				.icon-mini {
					font-size:32px;
					position:absolute;
					left:0;
					top:0;
				}
			}
		}
	}
	@keyframes rotate {
		0% {
			transform:rotate(0deg)
		}
		100% {
			transform:rotate(360deg)
		}
	}
</style>