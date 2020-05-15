<template>
  <div>
    <div class="format-precision-part">
      <label>小数位数：</label>
      <InputNumber size="small" :editable="false" :max="16" :min="0" v-model="data.decimalPlace" @on-change="refresh"></InputNumber>
    </div>
    <div class="format-accounting-part">
      <label>符号：</label>
      <span v-for="(item, index) in symbolList" :class="{
        'currency-symbol': true,
        'rmb': index === 1,
        'dollar': index === 0,
        'selected': index === symbolIndex
      }"
            @click="selectSymbol(index)"
      >{{item[1]}}</span>
    </div>
  </div>
</template>

<script>
  import { accountingFormats } from '../../src/options';
  export default {
    name: 'accounting',
    props: ['data', 'spread', 'currentIndex'],
    data() {
      return {
        cultureNameToIdMap: {
          'zh-cn': '804',
          'ja-jp': '411',
          'ko-kr': '412'
        },
        symbolList: [
          ["$", "$", "en-US"],
          ["¥", "¥", "zh-cn"],
        ],
        symbolIndex: 0,
      }
    },
    computed: {},
    methods: {
      getAccountingFormatter() {
        var decimalPlace = this.data.decimalPlace;
        var selectIndex = this.symbolIndex;
        var symbols = this.symbolList;
        var format = accountingFormats[0];
        var symbolCode = symbols[selectIndex][1];
        var cultureName = symbols[selectIndex][2];
        var symbolStr;
        var cultureId = this.cultureNameToIdMap[cultureName && cultureName.toLowerCase()] || cultureName;
        if (decimalPlace > 0) {
          var decimalDigits = "";
          for (var i = 0; i < decimalPlace; i++) {
            decimalDigits += '0';
          }
          format = format.replace(/#0/g, "#0." + decimalDigits);
        }
        var splitsFormats = format.split(';');
        var formatPiect0, formatPiect1, formatPiect2, formatPiect3;
        if (symbolCode === null) {
          return format;
        } else if (symbolCode === "$") {
          symbolStr = " " + "$";
          formatPiect0 = splitsFormats[0].replace(/_\(\*/g, symbolStr + "*");
          formatPiect0 = formatPiect0.replace(/_\)/g, " ");

          formatPiect1 = splitsFormats[1].replace(/_\(\*/g, symbolStr + "*");
          formatPiect1 = formatPiect1.replace(/\(/g, "");
          formatPiect1 = formatPiect1.replace(/\)/g, " ");

          formatPiect2 = splitsFormats[2].replace(/_\(\*/, symbolStr + "*");
          formatPiect2 = formatPiect2.replace(/_\)/g, " ");

          formatPiect3 = splitsFormats[3].replace(/_\(/g, " ");
          formatPiect3 = formatPiect3.replace(/_\)/g, " ");

          format = formatPiect0 + ";" + formatPiect1 + ";" + formatPiect2 + ";" + formatPiect3;
        } else {
          formatPiect0 = splitsFormats[0].replace(/_\(\*/g, "_-[$" + symbolCode + "-" + cultureId + "]*");
          formatPiect0 = formatPiect0.replace(/_\)/, "_-");

          formatPiect1 = splitsFormats[1].replace(/_\(\*/g, "-[$" + symbolCode + "-" + cultureId + "]*");
          formatPiect1 = formatPiect1.replace(/\(/g, "");
          formatPiect1 = formatPiect1.replace(/\)/g, "_-");

          formatPiect2 = splitsFormats[2].replace(/_\(\*/g, "_-[$" + symbolCode + "-" + cultureId + "]*");
          formatPiect2 = formatPiect2.replace(/_\)/g, "_-");

          formatPiect3 = splitsFormats[3].replace(/_\(/g, "_-");
          formatPiect3 = formatPiect3.replace(/_\)/g, "_-");

          format = formatPiect0 + ";" + formatPiect1 + ";" + formatPiect2 + ";" + formatPiect3;
        }
        return format;
      },
      refresh() {
        this.data.value = this.getAccountingFormatter();
        this.spread.getActiveSheet().getCell(0, 0).formatter(this.data.value);
        this.data.sampleText = this.spread.getActiveSheet().getText(0, 0);
      },
      selectSymbol(index) {
        this.symbolIndex = index;
        this.refresh();
      },
      getSymbolIndex(format) {
        // var hasMatched = false;
        // var accountingFormatsLength = accountingFormats.length;
        // for (var j = 0; j < accountingFormatsLength; j++) {
        //   if (tempFormat === accountingFormats[j]) {
        //     this.symbolIndex = (j % accountingFormatsLength) - 1;
        //     hasMatched = true;
        //     return;
        //   }
        // }
        // if (!hasMatched) {
        //   this.symbolIndex = 0;
        // }
        if (format.includes('¥')) {
          this.symbolIndex = 1;
        } else {
          this.symbolIndex = 0;
        }
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
        if (newVal === 3) {
          this.getDecimalPlace(this.data.value);
          this.getSymbolIndex(this.data.value);
          this.data.value = this.getAccountingFormatter();
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

  .format-accounting-part {
    height: 19px;
    line-height: 19px;
    margin-top: 12px;
  }

  .format-accounting-part label {
    width: 62px;
    font-weight: 400;
  }

  .format-accounting-part span.currency-symbol {
    width: 19px;
    height: 19px;
    line-height: 19px;
    display: inline-block;
    background-image: linear-gradient(-180deg,#a0a2a5 0,#c6c7c9 100%);
    color: #fff;
    text-align: center;
    border-radius: 2px;
    opacity: .65;
    cursor: pointer;
  }

  .format-accounting-part span.currency-symbol.selected {
    opacity: 1;
    background-image: linear-gradient(-180deg,#676b6f 0,#a0a2a5 100%);
  }

  .format-accounting-part span.currency-symbol.dollar {
    margin-right: 8px;
  }
</style>
