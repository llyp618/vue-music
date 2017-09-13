import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend'
import Singer from '@/components/singer'
import Rank from '@/components/rank'
import Search from '@/components/search'
Vue.use(Router)

export default new Router({
    routes:[
        {
            path:'/',
            component:Recommend
        },
        {
            path:'/recommend',
            component:Recommend
        },
        {
            path:'/singer',
            component:Singer
        },
        {
            path:'/rank',
            component:Rank
        },
        {
            path:'/search',
            component:Search
        }
    ]
})