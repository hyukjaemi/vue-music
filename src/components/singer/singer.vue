<template>
  <div class="singer" ref="singer">
    <list-view :data="Singers"></list-view>
  </div>
</template>

<script>
  import {getSingerList} from '../../api/singer.js';
  import ListView from '../../base/listview';
  var HOT_NAME = "热门";
  var length = 10;
  export default {
    data() {
      return {
        Singers:[]
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      _getSingerList(){
        getSingerList().then(result=>{
          if(result.code == 0){
            this.Singers = this.Singer(result.data.list);
          }
        })
      },
      //两个列表 热门和字母排列  字母排列内部
      Singer(list){
        var map = {
          hot:{
            title: HOT_NAME,
            items:[]
          }
        }
        list.forEach((item,index)=>{
          if(index < length){
            map.hot.items.push({
              id:item.Fsinger_mid,
              name:item.Fsinger_name,
              avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
            })
          }
          var key = item.Findex;
          if(!map[key]){
            map[key]={
              title:key,
              items:[]
            }
          }
          map[key].items.push({
              id:item.Fsinger_mid,
              name:item.Fsinger_name,
              avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
            })
        })
        //为了得到有序列表,需要处理map
        let hot = [];
        let ret = []; //a-z
        for(let key in map){
          let val = map[key];
          if(val.title.match(/[a-zA-Z]/)){
            ret.push(val)
          }else if(val.title === HOT_NAME){
            hot.push(val)
          }
        }
        ret.sort((a,b)=>{
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      }
    },
    components: {
     ListView
    }
  }

</script>

<style>
  .singer{
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>
