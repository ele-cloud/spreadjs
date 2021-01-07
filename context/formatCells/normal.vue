<template>
  <span>常规格式不包含任何特殊的数字格式。</span>
</template>

<script>
  export default {
    name: 'normal',
    props: ['data', 'currentIndex', 'spread'],
    watch: {
      currentIndex: function(newVal) {
        if (newVal === 0) {
          this.data.value = 'normal';
          this.spread.getActiveSheet().getCell(0, 0).formatter(this.data.value);
          this.data.sampleText = this.spread.getActiveSheet().getText(0, 0);
        }
      }
    }
  }
</script>

<style scoped>

</style>
