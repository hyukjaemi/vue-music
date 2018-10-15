<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex';
import {getSingerDetail} from '../../api/singer.js';
import {createSong} from '../../common/js/song';
import musicList from '../music-list/music-list';
  export default {
    data(){
      return {
        songs:[]
      }
    },
    computed:{
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    methods:{
      getDetail(){
        //当前页面刷新获得不到数据,回退到上一级
        if(!this.singer.id){
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then(res=>{
          if(res.code==0){
            this.songs = this.Songs(res.data.list)
            console.log(this.songs);
          }
        })
      },
      Songs(list){
        var ret = [];
        list.forEach((item) => {
          var {musicData} = item;
          if(musicData.songid && musicData.albummid){
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    created(){
      this.getDetail();
    },
    components:{
      musicList
    }
  }
</script>

<style>
  .slide-enter-active, .slide-leave-active{
    transition: all 0.3s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0)   
  }
    
</style>