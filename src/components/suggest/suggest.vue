<template>
  <scroll ref="suggest"
          class="suggest"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" :key="item.id">
        <div class="icon">
          <i></i>
        </div>
        <div class="name">
          <p class="text"></p>
        </div>
      </li>
    </ul>
    <!-- <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div> -->
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import {search} from 'api/search'
  import {createSong} from 'common/js/song'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from 'common/js/singer'

  export default {
    props: {
      query:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        result: []
      }
    },
    methods: {
      
    },
    watch: {
      query(){
        this.search()
      }
    },
    components: {
      Scroll,
    }
  }
</script>

<style>
.suggest {
  height: 100%;
  overflow: hidden;
}
.suggest .suggest-list {
  padding: 0 30px;
}
.suggest .suggest-list .suggest-item {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
}
.suggest .suggest-list .icon {
  flex: 0 0 30px;
  width: 30px;
}
.suggest .suggest-list .icon [class^="icon-"] {
  font-size: 14px;
  color: rgba(255,255,255,0.3);
}
.suggest .suggest-list .name {
  flex: 1;
  font-size: 14px;
  color: rgba(255,255,255,0.3);
  overflow: hidden;
}
.suggest .suggest-list .name .text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.suggest .no-result-wrapper {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>