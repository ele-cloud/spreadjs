<template>
  <span>文本格式将单元格中数字作为文本处理，单元格显示的内容与输入的内容完全一致。</span>
</template>

<script>
  export default {
    name: 'texts',
    props: ['data', 'currentIndex', 'spread'],
    watch: {
      currentIndex: function(newVal) {
        if (newVal === 0) {
          this.data.value = '@';
          this.spread.getActiveSheet().getCell(0, 0).formatter(this.data.value);
          this.data.sampleText = this.spread.getActiveSheet().getText(0, 0);
        }
      }
    }
  }
</script>

<style scoped>

</style>
