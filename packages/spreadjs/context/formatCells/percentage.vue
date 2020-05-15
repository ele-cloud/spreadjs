<template>
  <div>
    <div class="format-precision-part">
      <label>小数位数：</label>
      <InputNumber size="small" :editable="false" :max="16" :min="0" v-model="data.decimalPlace" @on-change="refresh"></InputNumber>
    </div>
  </div>
</template>

<script>
  import { percentageFormats } from '../../src/options';
  export default {
    name: 'percentage',
    props: ['data', 'spread', 'currentIndex'],
    data() {
      return {

      }
    },
    computed: {},
    methods: {
      getPercentageFormatter() {
        var decimalPlace = this.data.decimalPlace;
        var decimalPart = "";
        var format;
        if (decimalPlace > 0) {
          for (var i = 0; i < decimalPlace; i++) {
            decimalPart += '0';
          }
          format = '0.' + decimalPart + '%';
        } else {
          format = '0%';
        }
        return format;
      },
      refresh() {
        this.data.value = this.getPercentageFormatter();
        this.spread.getActiveSheet().getCell(0, 0).formatter(this.data.value);
        this.data.sampleText = this.spread.getActiveSheet().getText(0, 0);
      },
      getDecimalPlace(format) {
        this.data.decimalPlace = 0;
        if (format.indexOf('.') !== -1) {
          var n = format.indexOf('.');
          for (var i = n + 1; i < format.length; i++) {
            if (format.substring(i, i + 1) === '0') {
              this.data.decimalPlace++;
            } else {
              break;
            }
          }
        } else {
          this.data.decimalPlace = 0;
        }
      },
    },
    watch: {
      currentIndex: function (newVal) {
        if (newVal === 6) {
          this.getDecimalPlace(this.data.value);
          this.data.value = this.getPercentageFormatter();
          this.spread.getActiveSheet().getCell(0, 0).formatter(this.data.value);
          this.data.sampleText = this.spread.getActiveSheet().getText(0, 0);
        }
      }
    }
  }
</script>

<style scoped>
  .format-precision-part {
    display: flex;
    align-items: center;
    margin-top: 15px;
  }

  .format-precision-part label {
    width: 62px;
    font-weight: 400;
    vertical-align: top;
  }
</style>
