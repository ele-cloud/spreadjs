<template>
  <div>
    <div class="format-precision-part">
      <label>小数位数：</label>
      <InputNumber size="small" :editable="false" :max="16" :min="0" v-model="data.decimalPlace" @on-change="refresh"></InputNumber>
    </div>
    <div class="format-currency-part">
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
    <div class="format-negative-part">
      <div class="part-title">负数</div>
      <ul class="format-negative-list">
        <li v-for="(item, index) in currencyList" :key="item.value" :class="{
          'text-red': item.value.includes('red'),
          'selected': index === negativeIndex
        }"
            @click="selectNegative(index)"
        >{{item.label}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { currencyFormats } from '../../src/options';
  export default {
    name: 'number',
    props: ['data', 'spread', 'currentIndex'],
    data() {
      return {
        currencyNegativeNumbers: {
          "number1": "-1,234.10",
          "red:number2": "1,234.10",
          "number3": "-1,234.10",
          "red:number4": "-1,234.10"
        },
        symbolList: [
          ["$", "$", "en-US"],
          ["¥", "¥", "zh-cn"],
        ],
        cultureNameToIdMap: {
          'zh-cn': '804',
          'ja-jp': '411',
          'ko-kr': '412'
        },
        currencyList: [],
        negativeIndex: 0,
        symbolIndex: 0,
      }
    },
    computed: {},
    methods: {
      getCurrencyList() {
        var decimalPlace = this.data.decimalPlace;
        var groupItems = this.currencyNegativeNumbers;
        var numberValue = '1,234.10';
        var symbolSelectIndex = this.symbolIndex;
        if (decimalPlace > 0) {
          var decimalPart = "";
          for (var i = 0; i < decimalPlace; i++) {
            decimalPart = (i % 10).toString() + decimalPart.substring(0);
          }
          numberValue = numberValue.substring(0, numberValue.indexOf('.') + 1) + decimalPart;
        } else {
          numberValue = numberValue.substring(0, numberValue.indexOf('.'));
        }

        var symbol = this.symbolList[symbolSelectIndex][1];
        // if (symbol === this.symbolList[0][1]) {
        //   symbol = "";
        // }
        var target = [];
        var isFirstNegative = true;
        for (var name in groupItems) { /* NOSONAR: Forin*/
          var result = numberValue;
          var item = groupItems[name];
          if (item.indexOf('-') !== -1 && isFirstNegative) {
            result = '-' + symbol + result;
            isFirstNegative = false;
          } else if (item.indexOf('-') !== -1) {
            result = symbol + '-' + result;
          } else {
            result = symbol + result;
          }
          target.push({
            value: name,
            label: result
          });
        }
        return target;
      },
      getCurrencyFormatter() {
        var decimalPlace = this.data.decimalPlace;
        var currencyIndex = this.negativeIndex;
        var symbolCode;
        var symbolStr;
        if (currencyIndex === -1) {
          currencyIndex = 0;
        }
        var format = currencyFormats[currencyIndex];
        var i;
        if (decimalPlace > 0) {
          var decimalDigits = "";
          for (i = 0; i < decimalPlace; i++) {
            decimalDigits += '0';
          }
          format = format.replace(/#0/g, '#0.' + decimalDigits);
        }
        var splitsFormats = format.split(';');
        var symbols = this.symbolList;
        var selectIndex = this.symbolIndex;
        symbolCode = symbols[selectIndex][1];
        var cultureName = symbols[selectIndex][2];
        var cultureId = this.cultureNameToIdMap[cultureName && cultureName.toLowerCase()] || cultureName;
        var formatPiece, redIndex, charLength, temp;
        if (symbolCode === null) {
          return format;
        } else if (symbolCode === "$") {
          format = "";
          symbolStr = "$";
          for (i = 0; i < splitsFormats.length; i++) {
            formatPiece = splitsFormats[i];
            redIndex = formatPiece.indexOf('[Red]');
            charLength = 5;
            if (redIndex !== -1) {
              temp = formatPiece.substring(0, redIndex + charLength) + symbolStr + formatPiece.substring(redIndex + charLength);
              format = format + temp + ";";
            } else {
              format = format + symbolStr + formatPiece + ";";
            }
          }
        } else {
          format = "";
          for (i = 0; i < splitsFormats.length; i++) {
            formatPiece = splitsFormats[i];
            redIndex = formatPiece.indexOf('[Red]');
            charLength = 5;
            if (redIndex !== -1) {
              temp = formatPiece.substring(0, redIndex + charLength) + '[$' + symbolCode + '-' + cultureId + ']' + formatPiece.substring(redIndex + charLength);
              format = format + temp + ";";
            } else {
              format = format + '[$' + symbolCode + '-' + cultureId + ']' + formatPiece + ";";
            }
          }
        }

        if (format !== "" && format.charAt(format.length - 1) === ";") {
          format = format.substring(0, format.length - 1);
        }
        return format;
      },
      refresh() {
        this.data.value = this.getCurrencyFormatter();
        this.spread.getActiveSheet().getCell(0, 0).formatter(this.data.value);
        this.data.sampleText = this.spread.getActiveSheet().getText(0, 0);
        this.currencyList = this.getCurrencyList();
      },
      selectNegative(index) {
        this.negativeIndex = index;
        this.refresh();
      },
      selectSymbol(index) {
        this.symbolIndex = index;
        this.refresh();
      },
      getNegativeIndexAndSymbolIndex(format) {
        if (format === 'normal') {
          this.negativeIndex = 0;
          return;
        }
        var replaceStr = format.substring(format.indexOf('.'), format.indexOf('.') + this.data.decimalPlace + 1);
        var tempFormat = format.replace(new RegExp(replaceStr, 'g'), '');
        var hasMatched = false;
        if (format.indexOf('$') !== -1) {
          tempFormat = tempFormat.replace(/\$/g, "");
        }
        var tempCurrencyFormat = tempFormat.replace(/\[¥-804]|\[¥-411]/g, "");
        for (var i = 0; i < currencyFormats.length; i++) {
          if (tempCurrencyFormat === currencyFormats[i]) {
            this.negativeIndex = (i % 4);
            if (tempFormat.indexOf('¥-804') >= 0) {
              this.symbolIndex = 1;
            } else if (tempFormat.indexOf('¥-411') >= 0) {
              this.symbolIndex = 1;
            } else {
              this.symbolIndex = 0;
            }
            hasMatched = true;
            return;
          }
        }
        if (!hasMatched) {
          this.negativeIndex = 0;
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
        if (newVal === 2) {
          this.getDecimalPlace(this.data.value);
          this.getNegativeIndexAndSymbolIndex(this.data.value);
          this.currencyList = this.getCurrencyList();
          this.data.value = this.getCurrencyFormatter();
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

  .format-currency-part {
    height: 19px;
    line-height: 19px;
    margin-top: 12px;
  }

  .format-currency-part label {
    width: 62px;
    font-weight: 400;
  }

  .format-currency-part span.currency-symbol {
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

  .format-currency-part span.currency-symbol.selected {
    opacity: 1;
    background-image: linear-gradient(-180deg,#676b6f 0,#a0a2a5 100%);
  }

  .format-currency-part span.currency-symbol.dollar {
    margin-right: 8px;
  }

  .format-negative-part {
    margin-top: 15px;
  }

  .format-negative-part .format-negative-list {
    background-color: #fff;
    border: 1px solid #ececed;
    border-radius: 2px;
    padding: 5px 0;
    height: 176px;
  }

  .format-negative-part .format-negative-list li {
    height: 26px;
    line-height: 26px;
    padding-left: 9px;
    cursor: pointer;
  }

  .format-negative-part .format-negative-list li.text-red {
    color: #e95555;
  }

  .format-negative-part .format-negative-list li.selected {
    background-color: #f7f7f7;
  }
</style>
