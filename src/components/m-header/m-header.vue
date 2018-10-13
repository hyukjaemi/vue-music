<template>
    <div class="m-header">
        <div class="icon"></div>
        <h1 class="text">Kang Music</h1>
  </div>
</template>
<script>
    export default{}
</script>
<style>
.m-header{
    position:relative;
    height: 44px;
    text-align: center;
    color:#ffcd32
}
.m-header .icon{
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    background-image: url('./logo@2x.png');
    background-size: 30px 32px;
}
.m-header .text{
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: 18px;
    margin: 0;
}
.m-header .mine{
    position: absolute;
    top: 0;
    right: 0;
}
.m-header .mine .icon-mine{
    display: block;
    padding: 12px;
    font-size: 20px;
    color: #ffcd32;
}
</style>
