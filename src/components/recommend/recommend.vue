<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="playList">
        <div>
          <!-- 轮播图 -->
          <mt-swipe :auto="4000" v-if="imgList.length">
            <mt-swipe-item  v-for="item in imgList" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl">
              </a>
            </mt-swipe-item>
          </mt-swipe>
          <!-- 歌单推荐 -->
          <div class="recommend-list">
            <h2 class="list-title">热门歌单推荐</h2>
            <ul>
              <li v-for="item in playList" :key="item.id" class="list-item">
                <div class="icon">
                  <img :src="item.coverImgUrl" width="70" height="70">
                </div>
                <div class="text">
                  <h4 class="name" v-html="item.name"></h4>
                  <p class="desc" v-html="item.copywriter"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../../base/scroll'
  import {getRecommend} from '../../api/recommend.js';
  
  export default {
    data() {
      return {
        imgList:[],
        playList:[],
      }
    },
    created() {
      this._getRecommend()
      this.getPlaylist()
    },
    methods: {
      _getRecommend(){
        getRecommend().then((res)=>{
          if(res.code == 0){
            this.imgList = res.data.slider;
          }
        })
      },
      getPlaylist(){
        var url = `/api/top/playlist/highquality?limit=15`;
        this.$axios.get(url).then(result=>{
              this.playList = result.data.playlists;
            
        })
      }
    },
    components:{
      Scroll
    }
  }
</script>

<style>
  .recommend{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
  .mint-swipe{
    height: 150px;
  }
  .mint-swipe img{
    width: 100%;
  }
  .recommend-list .list-title{
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    color:  #ffcd32;
  }
  ul{
    padding: 0px;
  }
  ul li.list-item{
    display: flex;
    box-sizing: border-box;
    align-items: center;
    padding: 0 10px 10px 10px;
  }
  ul li.list-item .icon{
    flex:0 0 60px;
    width: 60px;
    padding-right: 20px;
  }
  ul li.list-item .text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    font-size: 12px;
  }
  ul li.list-item .name{
    margin-top: 0;
    margin-bottom: 10px;
    color: #fff
  }
  ul li.list-item .desc{
    color:rgba(255, 255, 255, 0.3);
    margin: 0;
  }
  .loading-container{
    position: absolute;
    width: 100%;
    top: 50px;
    transform: translateY(-50%)
  }
</style>