<template>
  <div>
    <div class="format-types-part">
      <div class="part-title">类型</div>
      <ul class="format-types-list">
        <li v-for="(date, index) in fractionList"
            :key="date.value"
            :class="index === seletedIndex && 'selected'"
            @click="selectFractionType(index)"
        >{{date.label}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {fractionFormats} from '../../src/options';

  export default {
    name: 'fraction',
    props: ['data', 'spread', 'currentIndex'],
    data() {
      return {
        seletedIndex: 0,
        fractionList: [],
        fractionType: [
          "分母为一位数(1/4)",
          "分母为两位数(21/25)",
          "分母为三位数(312/943)",
          "以2为分母(1/2)",
          "以4为分母(2/4)",
          "以8为分母(4/8)",
          "以16为分母(8/16)",
          "以10为分母(3/10)",
          "百分之几(30/100)"
        ],
      }
    },
    computed: {},
    methods: {
      getFractionFormat(format) {
        for (var i = 0; i < fractionFormats.length; i++) {
          if (format === fractionFormats[i]) {
            this.seletedIndex = i;
            return fractionFormats[i];
          }
        }
        this.seletedIndex = 0;
        return fractionFormats[0];
      },
      getFractionList() {
        var list = [];
        for (var i = 0; i < fractionFormats.length; i++) {
          list.push({
            value: fractionFormats[i],
            label: this.fractionType[i]
          });
        }
        return list;
      },
      refreshSampleText() {
        var allFormats = fractionFormats;
        this.data.value = allFormats[this.seletedIndex];
        this.spread.getActiveSheet().setFormatter(0, 0, this.data.value);
        this.data.sampleText = this.spread.getActiveSheet().getText(0, 0);
      },
      selectFractionType(index) {
        this.seletedIndex = index;
        this.refreshSampleText();
      }
    },
    watch: {
      currentIndex: function (newVal) {
        if (newVal === 7) {
          this.data.value = this.getFractionFormat(this.data.value);
          this.fractionList = this.getFractionList();
          this.spread.getActiveSheet().setFormatter(0, 0, this.data.value);
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

  .format-types-part {
    margin-top: 20px;
  }

  .format-dialog-content .part-title {
    line-height: 1;
    margin-bottom: 8px;
  }

  .format-types-part .format-types-list {
    background-color: #fff;
    border: 1px solid #ececed;
    border-radius: 2px;
    padding: 5px 0;
    height: 180px;
    max-height: 180px;
    overflow: hidden;
    overflow-y: scroll;
  }

  .format-types-part .format-types-list li {
    height: 26px;
    line-height: 26px;
    padding-left: 9px;
    cursor: pointer;
    user-select: none;
  }

  .format-types-part .format-types-list li.selected {
    background-color: #f7f7f7;
  }
</style>
