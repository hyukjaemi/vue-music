<template>
    <div class="song-list">
        <ul>
            <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs" :key="song.id">
                <!-- <div class="rank" v-show="rank">
                    <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
                </div> -->
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                 </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        props:{
            songs:{
                type:Array,
                default:[]
            },
            rank:{
                type:Boolean,
                default:false
            }
        },
        methods:{
            selectItem(item, index) {
                this.$emit('select', item, index)
            },
            getDesc(song) {
                return `${song.singer}·${song.album}`
            },
            getRankCls(index){
                if(index <= 2){
                    return `icon icon${index}`
                }else{
                    return `text`
                }
            },
            getRankText(index){
                if(index > 2){
                    return index + 1
                }
            }
        }
    }
</script>
<style>
.song-list .item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 64px;
  font-size: 14px;
}
.song-list .item .rank {
  flex: 0 0 25px;
  width: 25px;
  margin-right: 30px;
  text-align: center;
}
.song-list .item .rank .icon {
  display: inline-block;
  width: 25px;
  height: 24px;
  background-size: 25px 24px;
}
.song-list .item .rank .icon.icon0 {
  background-image: url("../common/image/first@2x.png");
}
@media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
  .song-list .item .rank .icon.icon0 {
    background-image: url("../common/image/first@3x.png");
  }
}
.song-list .item .rank .icon.icon1 {
  background-image: url("../common/image/second@2x.png");
}
@media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
  .song-list .item .rank .icon.icon1 {
    background-image: url("../common/image/second@3x.png");
  }
}
.song-list .item .rank .icon.icon2 {
  background-image: url("../common/image/third@2x.png");
}
@media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
  .song-list .item .rank .icon.icon2 {
    background-image: url("../common/image/third@3x.png");
  }
}
.song-list .item .rank .text {
  color: #ffcd32;
  font-size: 18px;
}
.song-list .item .content {
  flex: 1;
  line-height: 20px;
  overflow: hidden;
}
.song-list .item .content .name {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: #fff;
}
.song-list .item .content .desc {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 4px;
  color: rgba(255,255,255,0.3);
}

</style>
