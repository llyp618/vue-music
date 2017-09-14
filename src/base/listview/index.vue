<template>
    <div class="listview">
        <ul>
            <li class="list-group">
                <h2 class="list-group-title">热门</h2>
                <ul>
                    <li class="list-group-item">
                        <img class="avatar" src="">
                        <span class="name">skdfj</span>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {

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
</style>