<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <scroll  :data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '../../base/scroll';
import SongList from '../../base/song-list';
import {mapActions} from 'vuex'
import {playlistMixin} from '../../common/js/mixin'
  export default {
    mixins:[playlistMixin],
    props:{
      bgImage:{
        type:String,
        default:''
      },
      songs:{
        type:Array,
        default:[]
      },
      title:{
        type:String,
        default:""
      },
      rank:{
        type:Boolean,
        default:false
      }
    },
    computed:{
      bgStyle(){
        return `background-image:url(${this.bgImage})`
      }
    },
    mounted(){
     this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
    },
    components:{
      Scroll,
      SongList
    },
    methods:{
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' :''
        this.$refs.list.$el.style.bottom = bottom ;
        this.$refs.list.refresh()
      },
      back(){
        this.$router.back()
      },
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      random(){
        this.randomPlay({
          list:this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    }
  }
</script>

<style>
  .music-list{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background:#222;
  }
  .music-list .back{
      position:absolute;
      top: 0;
      left: 6px;
      z-index: 50;
    }
  .music-list .back .icon-back{
    display: block;
    padding: 10px;
    font-size: 22px;
    color: #ffcd32;
  }
  .music-list .title{
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: center;
      line-height: 40px;
      font-size: 22px;
      color:  #fff;
    }
  .music-list .bg-image{
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
    }
  .music-list .bg-image .play-wrapper{
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;
      }
  .music-list .bg-image .play-wrapper .play{
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid  #ffcd32;
          color: #ffcd32;
          border-radius: 100px;
          font-size: 0;
        }
  .icon-play{
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: 16px;
  }
  .music-list .bg-image .play-wrapper .play .text{
            display: inline-block;
            vertical-align: middle;
            font-size: 12px;
          }
  .music-list .bg-image .filter{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
  .music-list .bg-layer{
      position: relative;
      height: 100%;
      background: #222;
    }
  .music-list .list{
      position: fixed;
      top: 0;
      bottom: 0;
      overflow: hidden;
      width: 100%;
      background: #222;
    }
  .music-list .list .song-list-wrapper{
        padding: 10px 20px;
      }
  .music-list .list .loading-container{
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
</style>