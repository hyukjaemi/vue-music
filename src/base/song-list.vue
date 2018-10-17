<template>
    <div class="song-list">
        <ul>
            <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs" :key="song.id">
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
            }
        },
        methods:{
            selectItem(item, index) {
                this.$emit('select', item, index)
            },
            getDesc(song) {
                return `${song.singer}·${song.album}`
            }
        }
    }
</script>
<style>
.song-list .item{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 60px;
    font-size: 12px;
}
.song-list .item .rank{
    flex: 0 0 25px;
    width: 25px;
    margin-right: 30px;
    text-align: center;
}
.song-list .item .rank .icon{
    display: inline-block;
    width: 25px;
    height: 24px;
    background-size: 25px 24px;
}
.song-list .item .rank .icon.icon0{
    background-image: url('../common/image/first.png')
}
.song-list .item .rank .icon.icon1{
    background-image: url('../common/image/second.png')
}
.song-list .item .rank .icon.icon2{
    background-image: url('../common/image/third.png')
}
.song-list .item .rank .text{
    color:#ffcd32;
    font-size: 18px;
}
.song-list .item .content{
    flex: 1;
    line-height: 20px;
    overflow: hidden;
}
.song-list .item .content .name{
    display: flex;
    text-overflow: ellipsis;
    white-space: nowrap;
    color:rgba(255, 255, 255, 0.8);
    padding: 0;
    margin:4px;
    font-weight: 100;
}
.song-list .item .content .desc{
    display: flex;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 4px;
    color: rgba(255,255,255,0.3);
}
</style>
