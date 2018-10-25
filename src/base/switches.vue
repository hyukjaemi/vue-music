<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item,index) in switches" :class="{'active':currentIndex === index}"
        @click="switchItem(index)" :key="item.id">
      <span>{{item.name}} </span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      switches: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItem(index) {
        this.$emit('switch', index)
      }
    }
  }
</script>

<style>
  .switches {
  display: flex;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 1px solid #333;
  border-radius: 5px;
  list-style: none;
  padding: 0;
}
.switches .switch-item {
  flex: 1;
  padding: 8px;
  text-align: center;
  font-size: 14px;
  color: rgba(255,255,255,0.3);
}
.switches .switch-item.active {
  background: #333;
  color: #fff;
}
</style>