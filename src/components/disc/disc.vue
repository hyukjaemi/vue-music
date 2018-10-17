<template>
  <transition name="slide">
    <music-list></music-list>
  </transition>
</template>

<script>
  import MusicList from '../../components/music-list/music-list';
  import {getSongList} from '../../api/recommend';
  import {mapGetters} from 'vuex';

  export default {

  }
</script>

<style>
  .slide-enter-active, .slide-leave-active{
    transition: all 0.3s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0)
  }
</style>