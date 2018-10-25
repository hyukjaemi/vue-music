<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from '../music-list/music-list'
  import {mapGetters} from 'vuex'
  import {createSong} from '../../common/js/song'
  import {getSongVkey} from '../../api/singer'
  import {getMusicList} from '../../api/rank';

  export default {
    computed: {
      title(){
        return this.topList.topTitle
      },
      bgImage(){
        if(this.songs.length){
          return this.songs[0].image;
        }
        return '';
      },
    ...mapGetters([
        'topList'
      ])
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
     _getMusicList(){
       if(!this.topList.id){
         this.$router.push('/rank')
         return 
       }
        getMusicList(this.topList.id).then((res)=>{
          if(res.code==0){
            this.songs = this.Songs(res.songlist)
          }
        })
      },
      Songs(list){
        let ret = []
        list.forEach((item)=>{
          const musicData = item.data;
          getSongVkey(musicData.songmid).then(result=>{
            const vkey = result.data.items[0].vkey;
            if(musicData.songid && musicData.albumid){
              ret.push(createSong(musicData,vkey))
            }
          })
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style>
  .slide-enter-active, .slide-leave-active{
    transition: all 0.3s ease;
  }

  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>