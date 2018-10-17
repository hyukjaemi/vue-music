<template>
    <scroll class="listview" :data="data" ref="listview" 
            :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll">
        <!-- 歌手列表 -->
        <ul>
            <li v-for="group in data" class="list-group" 
                :key="group.id" ref="listgroup" >
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item" :key="item.id">
                        <img v-lazy="item.avatar" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <!-- 字母快速入口 -->
        <div class="list-shortcut" @touchstart="onFastclick" @touchmove.stop.prevent="onFastMove">
            <ul>
                <li v-for="(item,index) in fastList" :key="item.id" 
                    class="item" :class="{'current':currentIndex===index}"  :data-index="index">
                    {{item}}
                </li>
            </ul>
        </div>
    </scroll>
</template>
<script>
import Scroll from './scroll'
import {getData} from '../common/js/dom'
    export default {
        props:{
            data:{
                type:Array,
                default:[]
            }
        }, 
        data(){
            return {
                scrollY:-1,
                currentIndex:0,  //当前位置(高亮)
            }
        },
        components:{
            Scroll
        },
        created(){
            this.touch ={}
            this.listenScroll = true;   //监听
            this.listHeight = []
            this.probeType = 3
        },
        computed:{
            fastList(){
                return this.data.map((group)=>{
                    return group.title.substr(0,1)
                })
            }
        },
        methods:{
            selectItem(item){
                this.$emit("select",item);
            },
            onFastclick(e){
                //字母
                var anchorIndex = getData(e.target,"index");
                var firstTouch = e.touches[0];
                this.touch.y1 = firstTouch.pageY;
                this.touch.anchorIndex = anchorIndex;
                this. _scrollTo(anchorIndex);
            },
            onFastMove(e){
                var firstTouch = e.touches[0];
                this.touch.y2 = firstTouch.pageY;
                let delta = Math.floor((this.touch.y2 - this.touch.y1)/18);//每个字母高度18px
                let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
                this._scrollTo(anchorIndex);
            },
            refresh(){
                this.$refs.listview.refresh()
            },
            scroll(pos){
                this.scrollY = pos.y
            },
            _scrollTo(index){
                if(index==null){
                    return
                }
                if(index<0){
                    index = 0
                }else if(index > this.listHeight.length -2){
                    index = this.listHeight.length -2;
                }
                this.scrollY = -this.listHeight[index];
                this.$refs.listview.scrollToElement(this.$refs.listgroup[index],0)
            },
            _calculateHeight(){
                this.listHeight = [];
                var list = this.$refs.listgroup;
                let height = 0;
                this.listHeight.push(height);
                for(var i=0;i<list.length;i++){
                    var item = list[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            }
        },
        watch:{
            data(){
                setTimeout(()=>{
                    //数据变化到dom变化 缓存时间
                    this._calculateHeight()
                },20)
            },
            scrollY(newY){
                const listHeight = this.listHeight;
                //当滚动到顶部,newY>0
                if(newY>0){
                    this.currentIndex = 0;
                    return
                }
                //在中间部分滚动
                for(var i=0;i<listHeight.length-1;i++){
                    let height1 = listHeight[i];
                    let height2 = listHeight[i+1];
                    if(-newY >= height1 && -newY<height2){
                        this.currentIndex = i;
                        return;
                    }
                }
                //当滚动到底部,且-newY大于最后一个元素的上限
                this.currentIndex = listHeight-2;
            }
        }
    }
</script>
<style>
.listview{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #222;
}
ul{
    padding:0;
    list-style: none;
}
.listview .list-group{
    padding-bottom: 30px;
}
.listview .list-group .list-group-title{
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: 10px;
    color:rgba(255, 255, 255, 0.5);
    background: #333;
}
.listview .list-group .list-group-item{
    display: flex;
    align-items: center;
    padding: 20px 0 0 30px;
}
.listview .list-group .list-group-item .avatar{
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.listview .list-group .list-group-item .name{
    margin-left: 20px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
}
.listview .list-shortcut{
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform:translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    font-family: Helvetica;
}
.listview .list-shortcut .item{
    padding: 3px;
    line-height: 1;
    color: rgba(255, 255, 255, 0.5);
    font-size: 10px;
}
.listview .list-shortcut .item.current{
    color:#ffcd32;
}
/* .list-fixed{
    position: absolute;
    top: 0;
    left: 0;
    width: 100% ;
}
.list-fixed .fixed-title{
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    background: #333;
} */
.loading-container{
    position: absolute;
    width: 100%;
    top:50%;
    transform: translateY(-50%)
}
</style>
