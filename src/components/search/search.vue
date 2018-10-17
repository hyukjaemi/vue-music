<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchbox"></search-box>
    </div>
    <div class="shortcut-wrapper">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" class="item" v-for="item in hotkey" :key="item.id">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from '../../base/search-box';
import {getHotKey} from '../../api/search';

  export default {
    data() {
      return {
        hotkey:[]
      }
    },
    computed: {
      
    },
    created() {
      this._getHotKey()
    },
    methods: {
      _getHotKey(){
        getHotKey().then(res=>{
          if(res.code==0){
            //截取前10个数据
            this.hotkey = res.data.hotkey.slice(0,10);
          }
        })
      },
      addQuery(query){
        this.$refs.searchbox.setQuery(query);
      }
    },
    watch: {
      
    },
    components: {
      SearchBox
    }
  }
</script>

<style> 
.search .search-box-wrapper {
  margin: 20px;
}
.shortcut-wrapper {
  position: fixed;
  top: 178px;
  bottom: 0;
  width: 100%;
}
.shortcut-wrapper .shortcut {
  height: 100%;
  overflow: hidden;
}
.shortcut-wrapper .shortcut .hot-key {
  margin: 0 20px 20px 20px;
}
.shortcut-wrapper .shortcut .hot-key .title {
  margin-bottom: 20px;
  font-size: 14px;
  color: rgba(255,255,255,0.5);
}
.shortcut-wrapper .shortcut .hot-key .item {
  display: inline-block;
  padding: 5px 10px;
  margin: 0 20px 10px 0;
  border-radius: 6px;
  background: #333;
  font-size: 14px;
  color: rgba(255,255,255,0.3);
}
.shortcut-wrapper .shortcut .search-history {
  position: relative;
  margin: 0 20px;
}
.shortcut-wrapper .shortcut .search-history .title {
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 14px;
  color: rgba(255,255,255,0.5);
}
.shortcut-wrapper .shortcut .search-history .title .text {
  flex: 1;
}
.shortcut-wrapper .shortcut .search-history .title .clear {
  position: relative;
}
.shortcut-wrapper .shortcut .search-history .title .clear:before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
}
.shortcut-wrapper .shortcut .search-history .title .clear .icon-clear {
  font-size: 14px;
  color: rgba(255,255,255,0.3);
}
.search-result {
  position: fixed;
  width: 100%;
  top: 178px;
  bottom: 0;
}
</style>
