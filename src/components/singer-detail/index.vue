<template>
    <transition name="slide">
        <div class="singer-detail">
            {{singer}}
        </div>
    </transition>
</template>
<script>
    import {mapGetters} from 'vuex'
    export default {
        computed: {
            ...mapGetters({
                singer:'singer'
            })
        },
        methods: {
            
        }

    }
</script>
<style scoped lang="less">
    @import "~@/common/less/variable";
    .singer-detail {
        position:fixed;
        top:0;
        bottom:0;
        right:0;
        left:0;
        width:100%;
        background: @color-background;
        z-index:100;
    }
    .slide-enter-active,.slide-leave-active {
        transition:all .3s;
    }
    .slide-enter,.slide-leave-to {
        transform: translate3d(100%,0,0)
    }
</style>