<template>
    <div class="song-list">
        <ul>
            <li class="item" v-for="(song, index) in songs" @click="selectItem(song,index)">
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        props: {
            songs: {
                type: Array,
                default: []
            }
        },
        methods: {
            selectItem(item, index) {
                this.$emit('select', item, index)
            },
            getDesc(song) {
                return `${song.singer}·${song.album}`
            }
        }
    }
</script>
<style scoped lang="less">
    @import "~@/common/less/variable";
    @import "~@/common/less/mixin";
    .song-list {
        .item {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            height: 64px;
            font-size: @font-size-medium;
            .content {
                flex: 1;
                line-height: 20px;
                overflow: hidden;
                .name {
                    color: @color-text;
                    .no-wrap()
                }
                .desc {
                    .no-wrap();
                    margin-top: 4px;
                    color: @color-text-d;
                }
            }
        }
    }
</style>