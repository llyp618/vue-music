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
					<img width="100%" height="100%" :src="currentSong.image">
				</div>
				<div class="top">
					<div class="back" @click="back">
						<i class="icon-back"></i>
					</div>
					<h1 class="title" v-html="currentSong.name"></h1>
					<h2 class="subtitle" v-html="currentSong.singer"></h2>
				</div>
				<div class="middle" 
					@touchstart.prevent="middleTouchStart"
					@touchmove.prevent="middleTouchMove"
					@touchend="middleTouchEnd"
				>
					<div class="middle-l" ref="middleL">
						<div class="cd-wrapper" ref="cdWrapper">
							<div class="cd" :class="playing ? 'play' : 'play pause'">
								<img :src="currentSong.image" alt="" class="image" >
							</div>
						</div>
						<div class="playing-lyric-wrapper">
							<transition name="lyric">
								<div class="playing-lyric">{{playingLyric}}</div>
							</transition>	
						</div>
					</div>
					<scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
						<div class="lyric-wrapper">
							<div v-if="currentLyric">
								<p ref="lyricLine" class="text" :class="{'current':currentLineNum === index}" v-for="(line, index) in currentLyric.lines">
									{{line.txt}}
								</p>
							</div>
						</div>
					</scroll>
				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{'active': currentShow === 'cd'}"></span>
						<span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
					</div>
					<div class="progress-wrapper">
						<span class="time time-l">
							{{format(currentTime)}}
						</span>
						<div class="progress-bar-wrapper">
							<progress-bar :percent="percent" @percentChange="onPercentChange" ref="progressBar"></progress-bar>
						</div>
						<span class="time time-r">
							{{format(currentSong.duration)}}
						</span>
					</div>
					<div class="operators">
						<div class="icon i-left">
							<i :class="iconMode" @click="selectMode"></i>
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
						<div class="icon i-right" @click="">
							<i @click="toggleFavorite(currentSong)" class="icon" :class="getFavoriteIcon(currentSong)"></i>
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
				<progress-circle :radius="radius" :percent="percent">
					<i class="icon-mini" :class="playing ? 'icon-pause-mini' : 'icon-play-mini'"  @click="togglePlaying"></i>
				</progress-circle>
			</div>
			<div class="control">
			    <i class="icon-playlist" @click="openPlayList"></i>
			</div>
		</div>
		<play-list ref="playList"></play-list>
		<audio ref="audio" :src="currentSong.url" :paused="!playing" @play="ready" @error="error" @timeupdate="updateTime" @ended="onAudioEnd"></audio>
	</div>
</template>
<script>
import {mapGetters,mapMutations,mapActions} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from '@/common/js/dom'
import progressBar from '@/base/progress-bar'
import progressCircle from '@/base/progress-circle'
import {playMode} from '@/common/js/config'
import {shuffle} from '@/common/js/util'
import Lyric from 'lyric-parser'
import Scroll from '@/base/scroll'
import PlayList from '@/components/playlist'
import {playerMixin} from '@/common/js/mixin'
const TRANSFORM = prefixStyle('transform')
const TRANSITION = prefixStyle('transition')
const TRANSITIONDURATION = prefixStyle('transitionDuration')
export default {
	mixins:[playerMixin],
	data() {
		return {
			songReady: false,
			currentTime: 0,
			radius: 32,
			currentLyric:null,
			currentLineNum : 0,
			currentShow:'cd',
			playingLyric:''
		}
	},
	components:{
		progressBar,
		progressCircle,
		Scroll,
		PlayList
	},
	created() {
      this.touch = {}
    },
	computed: {
		percent(){
			return this.currentTime / this.currentSong.duration
		},
		iconMode(){
			return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
		},
		...mapGetters([
			'fullScreen',
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
		// 打开动画
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
		// 开关音乐
		togglePlaying(){
			this.SET_PLAYING_STATE(!this.playing)
			if (this.currentLyric) {
				this.currentLyric.togglePlay()
			}
		},
		// 选择歌曲
		selectNext(){
			if(!this.songReady){  // 防止快速点击
				return
			}
			this.songReady = false
			if(this.playlist.length === 1){
				this.loop()
				return
			} else {
				let nextIndex = this.currentIndex + 1 
				let index = nextIndex > this.playlist.length - 1 ? 0 : nextIndex
				this.SET_CURRENT_INDEX(index)
				if(!this.playing){
					this.togglePlaying()
				}
			}
		},
		selectPrev(){
			if(!this.songReady){
				return
			}
			this.songReady = false
			if(this.playlist.length === 1){
				this.loop()
				return
			} else {
				let prevIndex = this.currentIndex - 1 
				let index = prevIndex < 0 ? this.playlist.length - 1 : prevIndex
				this.SET_CURRENT_INDEX(index)
				if(!this.playing){
					this.togglePlaying()
				}
			}
		},
		ready() {
			this.songReady = true
			this.savePlayHistory(this.currentSong)
			// 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
			if (this.currentLyric) {
				const currentTime = this.currentSong.duration * this.percent * 1000
				this.currentLyric.seek(currentTime)
			}
		},
		error() {
			this.songReady = true
		},
		// 进度条处理
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
			if (this.currentLyric) {
				this.currentLyric.seek(currentTime * 1000)
			}
		},
		onAudioEnd(){
			if(this.mode === playMode.loop){
				this.loop()
			}else {
				this.selectNext()
			}
		},
		loop(){
			this.currentTime = 0
			this.$refs.audio.play()
			if (this.currentLyric) {
				this.currentLyric.seek(0)
			}
		},
		// 歌词处理
		getLyric() {
			this.currentSong.getLyric().then((lyric) => {
				if(this.currentSong.lyric !== lyric) {
					return
				}
				let theLyric = new Lyric(lyric,this.handleLyric)
				if(theLyric.lines.length === 0) {
					theLyric.lines.push({
						time:0,
						txt:'此歌曲为没有填词的纯音乐，请您欣赏'
					})
				}
				this.currentLyric = theLyric
				if (this.playing && this.songReady) {
					const currentTime = this.currentSong.duration * this.percent * 1000
					this.currentLyric.seek(currentTime)
				}
			}).catch(() => {
				this.currentLyric = null 
				this.playingLyric = ''
				this.currentLineNum = 0
			})
		},
		handleLyric({lineNum, txt}) {
			this.currentLineNum = lineNum
			if (lineNum > 5) {
				let lineEl = this.$refs.lyricLine[lineNum - 5]
				this.$refs.lyricList.scrollToElement(lineEl, 1000)
			}else {
				this.$refs.lyricList.scrollTo(0, 0, 1000)
			}
			this.playingLyric = txt
		},
		// cd 歌词切换
		middleTouchStart(e) {
			this.touch.initiated = true
			// 用来判断是否是一次移动
			this.touch.moved = false
			const touch = e.touches[0]
			this.touch.startX = touch.pageX
			this.touch.startY = touch.pageY
		},
		middleTouchMove(e) {
			if(!this.touch.initiated) {
				return
			}
			const touch = e.touches[0]
			const deltaX = touch.pageX - this.touch.startX
			const deltaY = touch.pageY - this.touch.startY
			if (Math.abs(deltaY) > Math.abs(deltaX)) {
				return
			}
			if (!this.touch.moved) {
				this.touch.moved = true
			}
			const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
			const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
			this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
			this.$refs.lyricList.$el.style[TRANSFORM] = `translate3d(${offsetWidth}px,0,0)`
			this.$refs.lyricList.$el.style[TRANSITIONDURATION] = 0
			this.$refs.middleL.style.opacity = 1 - this.touch.percent
			this.$refs.middleL.style[TRANSITIONDURATION] = 0
		},
		middleTouchEnd() {
			if (!this.touch.moved) {
				return
			}
			let offsetWidth
			let opacity
			if (this.currentShow === 'cd') {
				if(this.touch.percent > 0.1) {
					offsetWidth = -window.innerWidth
					opacity = 0
					this.currentShow = 'lyric'
				}else {
					offsetWidth = 0
					opacity = 1
				}
			}else {
				if(this.touch.percent < 0.9) {
					offsetWidth = 0
					this.currentShow = 'cd'
					opacity = 1
				} else {
					offsetWidth = -window.innerWidth
					opacity = 0
				}
			}
			const time = 300
			this.$refs.lyricList.$el.style[TRANSFORM] = `translate3d(${offsetWidth}px,0,0)`
			this.$refs.lyricList.$el.style[TRANSITIONDURATION] = `${time}ms`
			this.$refs.middleL.style.opacity = opacity
			this.$refs.middleL.style[TRANSITIONDURATION] = `${time}ms`
			this.touch.initiated = false
		},
		openPlayList() {
			this.$refs.playList.open()
		},
		...mapMutations([
			'SET_FULL_SCREEN',
			'SET_PLAYING_STATE',
			'SET_CURRENT_INDEX',
			'SET_PLAY_MODE',
			'SET_PLAYLIST'
		]),
		...mapActions([
			'savePlayHistory'
		])
	},
	watch: {
		currentSong(newSong,oldSong){
			if(!newSong.id){
				return
			}
			if(newSong.id === oldSong.id) {
				return
			}
			if(this.currentLyric){
				this.currentLyric.stop()
				this.currentTime = 0
				this.playingLyric = ''
				this.currentLineNum = 0
			}
			// 微信问题
			// this.$nextTick(() => {
			// 	this.$refs.audio.play()
			// 	this.getLyric()
			// })
			
			if(this.timer) {
				clearTimeout(this.timer)
				this.timer = null
			}
			this.timer = setTimeout(() => {
				this.currentLyric = null
				this.$refs.audio.play()
				this.getLyric()
			}, 1000)
		},
		playing(state){
			let audio = this.$refs.audio
			this.$nextTick(() => {
				state ? audio.play() : audio.pause()
			})
		},
		fullScreen(newVal) {
			if (newVal) {
				setTimeout(() => {
					this.$refs.lyricList.refresh()
				}, 20)
			}
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
							box-shadow: 0 0 200px 2px rgba(255,255,255,0.5);
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
					.playing-lyric-wrapper {
						width:80%;
						margin:30px auto 0 auto;
						overflow:hidden;
						text-align:center;
						.playing-lyric {
							height:20px;
							line-height:20px;
							font-size: @font-size-medium;
							color: @color-text-l;
						}
					}
				}
				.middle-r {
					display:inline-block;
					vertical-align: top;
					width: 100%;
					height: 100%;
					overflow: hidden;
					.lyric-wrapper {
						width:80%;
						margin:0 auto;
						overflow:hidden;
						text-align:center;
						.text {
							line-height:32px;
							color: @color-text-l;
							font-size: @font-size-medium;
							&.current {
								color: @color-text;
							}
						}
					}
				}
			}
			.bottom {
				position: absolute;
				bottom:50px;
				width:100%;
				.dot-wrapper {
					text-align:center;
					font-size: 0;
					.dot {
						display: inline-block;
						vertical-align: middle;
						margin:0 4px;
						width:8px;
						height:8px;
						border-radius:50%;
						background: @color-text-l;
						&.active {
							width:20px;
							border-radius: 5px;
							background: @color-text-ll;
						}
					}
				}
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