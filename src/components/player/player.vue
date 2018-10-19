<template>
 <div class="player" v-show="playlist.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back">
            </i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart"
            @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div> 
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current':currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines"
                   :key="line.id">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange">
              </progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" >
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini"> 
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop="showPlaylist">
            <i @click.stop="togglePlaying" :class="miniIcon"></i> 
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio ref="audio" :src="currentSong.url" 
            @timeupdate="updateTime" @ended="end">
    </audio>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex';
import ProgressBar from '../../base/progress-bar';
import {playMode} from '../../common/js/config';
import {shuffle} from '../../common/js/util';
import Lyric from 'lyric-parser';
import Scroll from '../../base/scroll';
import {prefixStyle} from '../../common/js/dom';
import Playlist from '../playlist/playlist';

const transform = prefixStyle('transform');
const transitionDuration = prefixStyle('transitionDuration');
  export default {
    data() {
      return {
       songReady:false,
       currentTime:0,
       currentLyric:null,
       currentLineNum:0,
       currentShow:'cd',
       playingLyric:''
      }
    },
    computed: {
      playIcon(){
        return this.playing ? 'icon-pause' : 'icon-play';
      }, 
      miniIcon(){
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },
      cdCls() {
        return this.playing ? 'play' : 'play pause';
      },
      percent(){
        return this.currentTime / this.currentSong.duration;
      },
      iconMode(){
        return this.mode === playMode.sequence ? "icon-sequence" : 
        this.mode === playMode.loop ? "icon-loop" : "icon-random"
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        "mode",
        "sequenceList"
      ])
    },
    created(){
      this.touch = {}
    },
    methods:{
      back(){
        this.setFullScreen(false)
      },
      open(){
        this.setFullScreen(true);
      },
      togglePlaying(){
        this.setPlayingState(!this.playing)
        if(this.currentLyric){
          this.currentLyric.togglePlay()
        }
      },
      end(){
        if(this.mode===playMode.loop){
          this.loop();
        }else{
          this.next();
        }
      },
      prev(){
        if(this.playlist.length==1){
          this.loop()
        }else{
          var index = this.currentIndex-1;
          if(index === -1){
            index = this.playlist.length-1;
          }
          this.setCurrentIndex(index)
          if(!this.playing) this.togglePlaying();
        }
      },
      next(){
        if(this.playlist.length==1){
          this.loop()
        }else{
          var index = this.currentIndex+1;
          if(index === this.playlist.length){
            index = 0
          }
          this.setCurrentIndex(index)
          if(!this.playing) this.togglePlaying();
        }
      },
      loop(){
        this.$ref.audio.currentTime = 0;
        this.$refs.audio.play();
        if(this.currentLyric){
          this.currentLyric.seek(0)
        }
      },
      updateTime(e){
        this.currentTime = e.target.currentTime
      },
      format(interval){
        //播放时间
        interval = interval | 0;
        const minute = interval/60 | 0;
        const second = this._pad(interval%60);
        return `${minute}:${second}`
      },
      onProgressBarChange(percent){
        const currentTime = this.currentSong.duration * percent;;
        this.$refs.audio.currentTime = currentTime;
        if(!this.playing){
          this.togglePlaying()
        }
        if(this.currentLyric){
          this.currentLyric.seek(currentTime * 1000);
        }
      },
      showPlaylist(){
        this.$refs.playlist.show();
      },
      _pad(num,n = 2){
        //给秒数补位
        let len = num.toString().length;
        while(len<n){
          num = '0' + num;
          len++;
        }
        return num
      },
      changeMode(){
        const mode = (this.mode + 1)%3;
        this.setPlayMode(mode);
        let list = null;
        if(mode === playMode.random){
          list = shuffle(this.sequenceList)
        }else{
          list = this.sequenceList;
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex(list){
        let index = list.findIndex((item)=>{
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      getLyric(){
        this.currentSong.getLyric().then((lyric)=>{
          this.currentLyric = new Lyric(lyric,this.handleLyric)
          if(this.playing){
            this.currentLyric.play()
          }
        }).catch(()=>{
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;

        })
      },
      handleLyric({lineNum,txt}){
        this.currentLineNum = lineNum;
        if(lineNum > 5){
          let lineEl = this.$refs.lyricLine[lineNum-5]
          this.$refs.lyricList.scrollToElement(lineEl,1000)
        }else{
          this.$refs.lyricList.scrollTo(0,0,1000)
        }
        this.playingLyric = txt
      },
      middleTouchStart(e){
        this.touch.initiated = true;
        const touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
      },
      middleTouchMove(e){
        if(!this.touch.initiated){
          return
        }
        const touch = e.touches[0];
        const deltaX = touch.pageX - this.touch.startX;
        const deltaY = touch.pageY - this.touch.startY;
        if(Math.abs(deltaY) > Math.abs(deltaX)){
          return 
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(Math.max(-window.innerWidth,left+deltaX));
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = 0;
        this.$refs.middleL.style.opacity = 1-this.touch.percent;
        this.$refs.middleL.style[transitionDuration] = 0;
      },
      middleTouchEnd(){
        let offsetWidth;
        let opacity;
        if(this.currentShow === 'cd'){
          if(this.touch.percent > 0.1){
            offsetWidth = -window.innerWidth;
            this.currentShow = 'lyric';
            opacity = 0;
          }else{
            offsetWidth = 0;
            opacity = 1;
          }
        }else{
          if(this.touch.percent<0.9){
            offsetWidth = 0;
            this.currentShow = 'cd';
            opacity = 1;
          }else{
            offsetWidth = -window.innerWidth;
            opacity = 0;
          }
        }
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = `300ms`;
        this.$refs.middleL.style.opacity = opacity;
        this.$refs.middleL.style[transitionDuration] = `300ms`;
      },
      ...mapMutations({
        setFullScreen:'SET_FULL_SCREEN',
        setPlayingState:'SET_PLAYING_STATE',
        setCurrentIndex:'SET_CURRENT_INDEX',
        setPlayMode:"SET_PLAY_MODE",
        setPlayList:"SET_PLAYLIST"
      })
    },
    watch:{
      currentSong(newSong, oldSong) {
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
          this.currentTime = 0
          this.playingLyric = ''
          this.currentLineNum = 0
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
      playing(newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      },
      fullScreen(newVal) {
        if (newVal) {
          setTimeout(() => {
            this.$refs.lyricList.refresh()
          }, 20)
        }
      }
    },
    components:{
      ProgressBar,
      Scroll,
      Playlist
    }
  }
</script>

<style>
 .player .normal-player {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: #222;
}
.player .normal-player .background {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.6;
  filter: blur(20px);
}
.player .normal-player .top {
  position: relative;
  margin-bottom: 25px;
}
.player .normal-player .top .back {
  position: absolute;
  top: 0;
  left: 6px;
  z-index: 50;
}
.player .normal-player .top .back .icon-back {
  display: block;
  padding: 9px;
  font-size: 22px;
  color: #ffcd32;
  transform: rotate(-90deg);
}
.player .normal-player .top .title {
  width: 70%;
  margin: 0 auto;
  line-height: 40px;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 18px;
  color: #fff;
}
.player .normal-player .top .subtitle {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
  color: #fff;
}
.player .normal-player .middle {
  position: fixed;
  width: 100%;
  top: 80px;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
}
.player .normal-player .middle .middle-l {
  display: inline-block;
  vertical-align: top;
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 80%;
}
.player .normal-player .middle .middle-l .cd-wrapper {
  position: absolute;
  left: 10%;
  top: 0;
  width: 80%;
  height: 100%;
}
.player .normal-player .middle .middle-l .cd-wrapper .cd {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 10px solid rgba(255,255,255,0.1);
  border-radius: 50%;
}
.player .normal-player .middle .middle-l .cd-wrapper .cd.play {
  animation: rotate 20s linear infinite;
}
.player .normal-player .middle .middle-l .cd-wrapper .cd.pause {
  animation-play-state: paused;
}
.player .normal-player .middle .middle-l .cd-wrapper .cd .image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.player .normal-player .middle .middle-l .playing-lyric-wrapper {
  width: 80%;
  margin: 30px auto 0 auto;
  overflow: hidden;
  text-align: center;
}
.player .normal-player .middle .middle-l .playing-lyric-wrapper .playing-lyric {
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: rgba(255,255,255,0.5);
}
.player .normal-player .middle .middle-r {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.player .normal-player .middle .middle-r .lyric-wrapper {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
}
.player .normal-player .middle .middle-r .lyric-wrapper .text {
  line-height: 32px;
  color: rgba(255,255,255,0.5);
  font-size: 14px;
}
.player .normal-player .middle .middle-r .lyric-wrapper .text.current {
  color: #fff;
}
.player .normal-player .bottom {
  position: absolute;
  bottom: 50px;
  width: 100%;
}
.player .normal-player .bottom .dot-wrapper {
  text-align: center;
  font-size: 0;
}
.player .normal-player .bottom .dot-wrapper .dot {
  display: inline-block;
  vertical-align: middle;
  margin: 0 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
}
.player .normal-player .bottom .dot-wrapper .dot.active {
  width: 20px;
  border-radius: 5px;
  background: rgba(255,255,255,0.8);
}
.player .normal-player .bottom .progress-wrapper {
  display: flex;
  align-items: center;
  width: 80%;
  margin: 0px auto;
  padding: 10px 0;
}
.player .normal-player .bottom .progress-wrapper .time {
  color: #fff;
  font-size: 12px;
  flex: 0 0 30px;
  line-height: 30px;
  width: 30px;
}
.player .normal-player .bottom .progress-wrapper .time.time-l {
  text-align: left;
}
.player .normal-player .bottom .progress-wrapper .time.time-r {
  text-align: right;
}
.player .normal-player .bottom .progress-wrapper .progress-bar-wrapper {
  flex: 1;
}
.player .normal-player .bottom .operators {
  display: flex;
  align-items: center;
}
.player .normal-player .bottom .operators .icon {
  flex: 1;
  color: #ffcd32;
}
.player .normal-player .bottom .operators .icon.disable {
  color: rgba(255,205,49,0.5);
}
.player .normal-player .bottom .operators .icon i {
  font-size: 30px;
}
.player .normal-player .bottom .operators .i-left {
  text-align: right;
}
.player .normal-player .bottom .operators .i-center {
  padding: 0 20px;
  text-align: center;
}
.player .normal-player .bottom .operators .i-center i {
  font-size: 40px;
}
.player .normal-player .bottom .operators .i-right {
  text-align: left;
}
.player .normal-player .bottom .operators .icon-favorite {
  color: #d93f30;
}
.player .normal-player.normal-enter-active,
.player .normal-player.normal-leave-active {
  transition: all 0.4s;
}
.player .normal-player.normal-enter-active .top,
.player .normal-player.normal-leave-active .top,
.player .normal-player.normal-enter-active .bottom,
.player .normal-player.normal-leave-active .bottom {
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.player .normal-player.normal-enter,
.player .normal-player.normal-leave-to {
  opacity: 0;
}
.player .normal-player.normal-enter .top,
.player .normal-player.normal-leave-to .top {
  transform: translate3d(0, -100px, 0);
}
.player .normal-player.normal-enter .bottom,
.player .normal-player.normal-leave-to .bottom {
  transform: translate3d(0, 100px, 0);
}
.player .mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: #333;
}
.player .mini-player.mini-enter-active,
.player .mini-player.mini-leave-active {
  transition: all 0.4s;
}
.player .mini-player.mini-enter,
.player .mini-player.mini-leave-to {
  opacity: 0;
}
.player .mini-player .icon {
  flex: 0 0 40px;
  width: 40px;
  padding: 0 10px 0 20px;
}
.player .mini-player .icon img {
  border-radius: 50%;
}
.player .mini-player .icon img.play {
  animation: rotate 10s linear infinite;
}
.player .mini-player .icon img.pause {
  animation-play-state: paused;
}
.player .mini-player .text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  line-height: 20px;
  overflow: hidden;
}
.player .mini-player .text .name {
  margin-bottom: 2px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
  color: #fff;
  margin: 0;
}
.player .mini-player .text .desc {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 12px;
  color: rgba(255,255,255,0.3);
  margin: 0;
}
.player .mini-player .control {
  flex: 0 0 30px;
  width: 30px;
  padding: 0 10px;
  position: relative;
}
.player .mini-player .control .icon-play-mini,
.player .mini-player .control .icon-pause-mini,
.player .mini-player .control .icon-playlist {
  font-size: 30px;
  color: rgba(255,205,49,0.5);
}
.player .mini-player .control .icon-mini {
  font-size: 32px;
  position: absolute;
  left: 0;
  top:-15px;
}
@-moz-keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@-o-keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>