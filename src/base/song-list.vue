<template>
    <div class="song-list">
        <ul>
            <li v-for="song in songs" :key="song.id" class="item">
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
            getDesc(song){
                console.log(song);
                return `${song.singer}·${song.album}`
            }
        }
    }
</script>
<style>
.item{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 60px;
    font-size: 12px;
}
.item .rank{
    flex: 0 0 25px;
    width: 25px;
    margin-right: 30px;
    text-align: center;
}
.item .rank .icon{
    display: inline-block;
    width: 25px;
    height: 24px;
    background-size: 25px 24px;
}
.item .rank .icon.icon0{
    background-image: url('../common/image/first.png')
}
.item .rank .icon.icon1{
    background-image: url('../common/image/second.png')
}
.item .rank .icon.icon2{
    background-image: url('../common/image/third.png')
}
.item .rank .text{
    color:#ffcd32;
    font-size: 18px;
}
.item .content{
    flex: 1;
    line-height: 20px;
    overflow: hidden;
}
.item .content .name{
    display: flex;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color:rgba(255, 255, 255, 0.8);
    padding: 0;
    margin: 0;
    font-weight: 100;
}
.item .content .desc{
    display: flex;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-top: 4px;
    color: rgba(255,255,255,0.3);
    padding: 0;
    margin: 0;
}
</style>
