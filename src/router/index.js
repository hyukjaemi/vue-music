import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../components/recommend/recommend';
import Singer from '../components/singer/singer';
import Rank from '../components/rank/rank';
import Search from '../components/search/search';
import SingerDetail from '../components/singer-detail/singer-detail';
import Disc from '../components/disc/disc';
Vue.use(Router)

export default new Router({
  routes: [
    {path:'/',redirect:'/recommend'},
    {path: '/recommend',component:Recommend},
    // 子路由
    {path:'/singer',component:Singer,children:[
      {
        path:':id',
        component:SingerDetail
      }
    ]},
    {path:'/rank',component:Rank},
    {path:'/search',component:Search}
  ]
})
