<template>
  <scroll ref="suggest"
          class="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" :key="item.id">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
    <!-- <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div> -->
  </scroll>
</template>

<script>
  import Scroll from '../../base/scroll'
  import {search} from '../../api/search'
  import {filterSinger} from '../../common/js/song'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from '../../common/js/singer'

  const TYPE_SINGER = 'singer';
  const perpage = 20;
  export default {
    props: {
      query:{
        type:String,
        default:''
      },
      showSinger:{
        type:Boolean,
        default:true
      }
    },
    data() {
      return {
        page: 1,
        pullup: true,
        beforeScroll: true,
        hasMore: true,
        result: []
      }
    },
    methods: {
      refresh() {
        this.$refs.suggest.refresh()
      },
      search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === 0) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === 0) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      listScroll() {
        this.$emit('listScroll')
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select', item)
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query(newQuery) {
        this.search(newQuery)
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