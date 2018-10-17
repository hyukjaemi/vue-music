<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="toplist">
      <ul>
        <li class="item" v-for="item in topList" :key="item.id" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" :src="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList" :key="song.id">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singgername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import Scroll from '../../base/scroll';
  import {getTopList} from '../../api/rank';
  import {playlistMixin} from '../../common/js/mixin';
  import {mapMutations} from 'vuex'
  export default {
    mixins: [playlistMixin],
    data(){
      return{
        topList:[]
      }
    },
    methods:{
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.rank.style.bottom = bottom;
        this.$refs.toplist.refresh();
      },
      selectItem(item){
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
      },
      _getTopList(){
        getTopList().then((res) => {
          if (res.code === 0) {
            this.topList = res.data.topList
          }
        })
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    },
    created(){
      this._getTopList()
    },
    components:{
      Scroll
    }
  }
</script>

<style>
.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
.rank .toplist {
  height: 100%;
  overflow: hidden;
}
.rank .toplist ul{
  padding:0
}
.rank .toplist .item {
  display: flex;
  margin: 0 20px;
  padding-top: 20px;
  height: 100px;
}
.rank .toplist .item:last-child {
  padding-bottom: 20px;
}
.rank .toplist .item .icon {
  flex: 0 0 100px;
  width: 100px;
  height: 100px;
}
.rank .toplist .item .songlist {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  height: 100px;
  overflow: hidden;
  background: #333;
  color: rgba(255,255,255,0.3);
  font-size: 12px;
}
.rank .toplist .item .songlist .song {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 26px;
}
.rank .toplist .loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>