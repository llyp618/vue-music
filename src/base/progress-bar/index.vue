<template>
    <div class="progress-bar" @click="onBarClick">
        <div class="bar-inner" ref="bar" >
            <div class="progress" ref="progressBar"></div>
            <div class="progress-btn-wrapper" ref="progressBtn"
                 @touchstart.prevent="progressTouchStart"
                 @touchmove.prevent="progressTouchMove"
                 @touchend="progressTouchEnd"
            >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import {prefixStyle} from '@/common/js/dom'
    const TRANSFORM = prefixStyle('transform')
    export default {
        props:{
            percent:{
                type:Number,
                default:0
            }
        },
        created(){
            this.touch = {}
        },
        methods:{
            progressTouchStart(e){
                this.touch.initiated = true  // 这个标识符的作用是用来防止用户按下手指时，touch对象不是该按钮，但touchmove时又经过该按钮的情况 同时 它也标识了用户当前正在拖动的情形
                this.touch.startX = e.touches[0].pageX
                this.touch.left = this.$refs.progressBar.clientWidth
            },
            progressTouchMove(e){
                if(!this.touch.initiated) {
                    return 
                }
                const barWidth = this.$refs.bar.clientWidth - 16
                const deltaX = e.touches[0].pageX - this.touch.startX
                const offsetWidth = Math.min(barWidth, Math.max(0,this.touch.left + deltaX))
                this._offset(offsetWidth)
            },
            progressTouchEnd(e){
                this.touch.initiated = false
                this._triggerPercent()
            },
            _offset(offsetWidth) {
                this.$refs.progressBtn.style[TRANSFORM] = `translate3d(${offsetWidth}px,0,0)`
                this.$refs.progressBar.style.width = `${offsetWidth}px`
            },
            _triggerPercent() {
                const barWidth = this.$refs.bar.clientWidth - 16
                const percent = this.$refs.progressBar.clientWidth / barWidth
                this.$emit('percentChange', percent)
            },
            onBarClick(e){
                const rect = this.$refs.bar.getBoundingClientRect()
                const offsetWidth = e.pageX - rect.left
                this._offset(offsetWidth)
                this._triggerPercent()
            }
        },
        watch:{
            percent(percent){
                if(percent >= 0 && !this.touch.initiated) {  
                    const barWidth = this.$refs.bar.clientWidth - 16 // 需要减去小球的宽
                    const offsetWidth = percent * barWidth
                    this._offset(offsetWidth)
                }
            }
        }
    }
</script>
<style scoped lang="less">
    @import '~@/common/less/variable';
    .progress-bar {
        height:30px;
        .bar-inner {
            position:relative;
            top:13px;
            height:4px;
            background:rgba(0,0,0,0.3);
            .progress {
                position: absolute;
                height:100%;
                background: @color-theme;
            }
            .progress-btn-wrapper {
                position:absolute;
                left:-8px;
                top:-13px;
                width:30px;
                height:30px;
                .progress-btn {
                    position:absolute;
                    top:7px;
                    left:7px;
                    box-sizing:border-box;
                    width:16px;
                    height:16px;
                    border:3px solid @color-text;
                    border-radius:50%;
                    background:@color-theme;
                }
            }
        }
    }
</style>