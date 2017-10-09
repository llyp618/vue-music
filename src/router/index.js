import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from '@/components/recommend'
// import Singer from '@/components/singer'
// import Rank from '@/components/rank'
// import Search from '@/components/search'
// import SingerDetail from '@/components/singer-detail'
// import Disc from '@/components/disc'
// import TopList from '@/components/top-list'
// import UserCenter from '@/components/user-center'

Vue.use(Router)

const Recommend = (resolve) => {
    import('@/components/recommend').then((recommend) => {
        resolve(recommend)
    })
}
const Singer = (resolve) => {
    import('@/components/singer').then((singer) => {
        resolve(singer)
    })
}
const Rank = (resolve) => {
    import('@/components/rank').then((rank) => {
        resolve(rank)
    })
}
const Search = (resolve) => {
    import('@/components/search').then((search) => {
        resolve(search)
    })
}
const SingerDetail = (resolve) => {
    import('@/components/singer-detail').then((singerDetail) => {
        resolve(singerDetail)
    })
}
const Disc = (resolve) => {
    import('@/components/disc').then((disc) => {
        resolve(disc)
    })
}
const TopList = (resolve) => {
    import('@/components/top-list').then((toplist) => {
        resolve(toplist)
    })
}

const UserCenter = (resolve) => {
    import('@/components/user-center').then((usercenter) => {
        resolve(usercenter)
    })
}

export default new Router({
    routes:[
        {
            path:'/',
            redirect: '/recommend'
        },
        {
            path:'/recommend',
            component:Recommend,
            children:[
                {
                    path: ':id',
                    component: Disc
                }
            ]
        },
        {
            path:'/singer',
            component:Singer,
            children:[
                {
                    path: ':id',
                    component:SingerDetail
                }
            ]
        },
        {
            path:'/rank',
            component:Rank,
            children:[
                {
                    path: ':id',
                    component:TopList
                }

            ]
        },
        {
            path:'/search',
            component:Search,
            children: [
                {
                  path: ':id',
                  component: SingerDetail
                }
              ]
        },
        {
            path:'/user',
            component:UserCenter
        }
    ]
})