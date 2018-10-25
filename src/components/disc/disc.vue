<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from '../music-list/music-list';
  import {getSongList} from '../../api/recommend';
  import {getSongVkey} from '../../api/singer';
  import {createSong} from '../../common/js/song';
  import {mapGetters} from 'vuex';
  export default {
    data(){
      return {
        songs:[]
      } 
    },
    computed:{
      title(){
        return this.disc.dissname
      },
      bgImage(){
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    components:{
      MusicList
    },
    created(){
      this._getSongList()
    },
    methods:{
      _getSongList(){
        if(!this.disc.dissid){
          this.$router.push('/recommend');
          return;
        }
        getSongList(this.disc.dissid).then((res)=>{
          this.songs = this.songsList(res.cdlist[0].songlist);
          
        })
      },
      songsList(list){
        let ret = [];
        list.forEach((musicData)=>{
          getSongVkey(musicData.songmid).then(result=>{
            const vkey = result.data.items[0].vkey;
            if(musicData.songid && musicData.albumid){
              ret.push(createSong(musicData,vkey))
            }
          })
        })
        return ret
      }
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