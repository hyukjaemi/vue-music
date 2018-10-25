<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style>
 .no-result {
  text-align: center;
}
.no-result .no-result-icon {
  width: 86px;
  height: 90px;
  margin: 0 auto;
  background-image: url("./no-result@2x.png");
  background-size: 86px 90px;
}
@media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
  .no-result .no-result-icon {
    background-image: url("./no-result@3x.png");
  }
}
.no-result .no-result-text {
  margin-top: 30px;
  font-size: 14px;
  color: rgba(255,255,255,0.3);
}
</style>