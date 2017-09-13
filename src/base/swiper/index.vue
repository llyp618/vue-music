<template>
    <div  class="swiper-wrapper" ref="wrapper">
        <swipe v-if="recommends.length" >
            <swipe-item :key="recommends[0].id">
                <a :href="recommends[0].linkUrl">
                    <img :src="recommends[0].picUrl" @load.once="autoFix" alt="" class="swiper-img" ref="firstImg">
                </a>
            </swipe-item>    
            <swipe-item v-for="(item, index) in recommends" v-if="index > 0" :key="item.id">
                <a :href="item.linkUrl">
                    <img :src="item.picUrl" alt="" class="swiper-img">
                </a>
            </swipe-item>    
        </swipe>
    </div>
</template>
<script>
import 'vue-swipe/dist/vue-swipe.css'
import { Swipe, SwipeItem } from 'vue-swipe'
export default {
    name:'swiper',
    props:['recommends'],
    mounted() {
        let timer = null
        window.addEventListener('resize', () => {
           if (timer) {
               return false
           }
           timer = setTimeout(() => {
               this.autoFix()
               clearTimeout(timer)
               timer = null
           }, 200)
        })
    },
    methods:{
        autoFix() { 
            // let h = this.$refs.firstImg.clientHeight 图片隐藏时会是0 换下面这种方法
            let h = document.querySelector('.is-active .swiper-img').clientHeight
            console.log(h)
            this.$refs.wrapper.style.height = h + 'px'
        }
    },
    components:{
        Swipe,
        SwipeItem
    }
}
</script>
<style scoped lang="less">
    .swiper-wrapper {
        position:relative;
        width:100%;
        overflow:hidden;
        min-height:100px;
        a {
            display:block;
            width:100%;
        }
        img {
            display:block;
            width:100%;
        }
    }
</style>