<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag">
      <div class="list-wrapper" >
        <div class="list-header">
          <h1 class="title">
            <i class="icon" ></i>
            <span class="text"></span>
            <span class="clear"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content" :data="sequenceList">
          <div ref="listItem" name="list" tag="ul">
            <li  class="item" v-for="(item,index) in sequenceList" :key="item.id"
                @click="selectItem(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete"> 
                <i class="icon-delete"></i>
              </span>
            </li>
          </div>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Scroll from '../../base/scroll';
  import {mapGetters, mapMutations,mapActions} from 'vuex';
  import {playMode} from '../../common/js/config';
  export default {
    data(){
      return{
        showFlag:false
      }
    },
    methods:{
      show(){
        this.showFlag = true;
        setTimeout(()=>{
          this.$refs.listContent.refresh();
          this.scrollToCurrent(this.currentSong)
        },20)
      },
      hide(){
        this.showFlag = false;
      },
      getCurrentIcon(item){
        if(this.currentSong.id === item.id){
          return 'icon-play'
        }
        return ''
      },
      selectItem(item,index){
        if(this.mode === playMode.random){
          index = this.playlist.findIndex((song)=>{
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index);
        this.setPlayingState(true);
      },
      scrollToCurrent(current){
        const index = this.sequenceList.findIndex((song)=>{
          return current.id === song.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index],300)
      },
      ...mapMutations({
        setCurrentIndex:'SET_CURRENT_INDEX',
        setPlayingState:'SET_PLAYING_STATE'
      }),
      ...mapActions([
        'deleteSong'
      ])
    },
    components:{
      Scroll
    },
    computed:{
      ...mapGetters([
        'sequenceList',
        'currentSong',
        'mode'
      ])
    },
    watch:{
      currentSong(newSong,oldSong){
        if(!this.showFlag || newSong.id==oldSong.id){
          return 
        }else{
          this.scrollToCurrent(newSong)
        }
      }
    }
  }
</script>

<style>
h1{
  margin: 0;
}
  .playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0,0,0,0.3);
}
.playlist.list-fade-enter-active,
.playlist.list-fade-leave-active {
  transition: opacity 0.3s;
}
.playlist.list-fade-enter-active .list-wrapper,
.playlist.list-fade-leave-active .list-wrapper {
  transition: all 0.3s;
}
.playlist.list-fade-enter,
.playlist.list-fade-leave-to {
  opacity: 0;
}
.playlist.list-fade-enter .list-wrapper,
.playlist.list-fade-leave-to .list-wrapper {
  transform: translate3d(0, 100%, 0);
}
.playlist.list-fade-enter,
.playlist .list-wrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #333;
}
.playlist.list-fade-enter .list-header,
.playlist .list-wrapper .list-header {
  position: relative;
  padding: 20px 30px 10px 20px;
}
.playlist.list-fade-enter .list-header .title,
.playlist .list-wrapper .list-header .title {
  display: flex;
  align-items: center;
}
.playlist.list-fade-enter .list-header .title .icon,
.playlist .list-wrapper .list-header .title .icon {
  margin-right: 10px;
  font-size: 30px;
  color: rgba(255,205,49,0.5);
}
.playlist.list-fade-enter .list-header .title .text,
.playlist .list-wrapper .list-header .title .text {
  flex: 1;
  font-size: 14px;
  color: rgba(255,255,255,0.5);
}
.playlist.list-fade-enter .list-header .title .clear,
.playlist .list-wrapper .list-header .title .clear {
  position: relative;
}
.playlist.list-fade-enter .list-header .title .clear:before,
.playlist .list-wrapper .list-header .title .clear:before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
}
.playlist.list-fade-enter .list-header .title .clear .icon-clear,
.playlist .list-wrapper .list-header .title .clear .icon-clear {
  font-size: 14px;
  color: rgba(255,255,255,0.3);
}
.playlist.list-fade-enter .list-content,
.playlist .list-wrapper .list-content {
  max-height: 240px;
  overflow: hidden;
}
.playlist.list-fade-enter .list-content .item,
.playlist .list-wrapper .list-content .item {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 30px 0 20px;
  overflow: hidden;
}
.playlist.list-fade-enter .list-content .item.list-enter-active,
.playlist .list-wrapper .list-content .item.list-enter-active,
.playlist.list-fade-enter .list-content .item.list-leave-active,
.playlist .list-wrapper .list-content .item.list-leave-active {
  transition: all 0.1s;
}
.playlist.list-fade-enter .list-content .item.list-enter,
.playlist .list-wrapper .list-content .item.list-enter,
.playlist.list-fade-enter .list-content .item.list-leave-to,
.playlist .list-wrapper .list-content .item.list-leave-to {
  height: 0;
}
.playlist.list-fade-enter .list-content .item .current,
.playlist .list-wrapper .list-content .item .current {
  flex: 0 0 20px;
  width: 20px;
  font-size: 12px;
  color: rgba(255,205,49,0.5);
}
.playlist.list-fade-enter .list-content .item .text,
.playlist .list-wrapper .list-content .item .text {
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
  color: rgba(255,255,255,0.3);
}
.playlist.list-fade-enter .list-content .item .like,
.playlist .list-wrapper .list-content .item .like {
  position: relative;
  margin-right: 15px;
  font-size: 12px;
  color: #ffcd32;
}
.playlist.list-fade-enter .list-content .item .like:before,
.playlist .list-wrapper .list-content .item .like:before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
}
.playlist.list-fade-enter .list-content .item .like .icon-favorite,
.playlist .list-wrapper .list-content .item .like .icon-favorite {
  color: #d93f30;
}
.playlist.list-fade-enter .list-content .item .delete,
.playlist .list-wrapper .list-content .item .delete {
  position: relative;
  font-size: 12px;
  color: #ffcd32;
}
.playlist.list-fade-enter .list-content .item .delete:before,
.playlist .list-wrapper .list-content .item .delete:before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
}
.playlist.list-fade-enter .list-operate,
.playlist .list-wrapper .list-operate {
  width: 140px;
  margin: 20px auto 30px auto;
}
.playlist.list-fade-enter .list-operate .add,
.playlist .list-wrapper .list-operate .add {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 100px;
  color: rgba(255,255,255,0.5);
}
.playlist.list-fade-enter .list-operate .add .icon-add,
.playlist .list-wrapper .list-operate .add .icon-add {
  margin-right: 5px;
  font-size: 10px;
}
.playlist.list-fade-enter .list-operate .add .text,
.playlist .list-wrapper .list-operate .add .text {
  font-size: 12px;
}
.playlist.list-fade-enter .list-close,
.playlist .list-wrapper .list-close {
  text-align: center;
  line-height: 50px;
  background: #222;
  font-size: 16px;
  color: rgba(255,255,255,0.5);
}
</style>