<template>
  <div>
    <div class="format-precision-part">
      <label>小数位数：</label>
      <InputNumber size="small" :editable="false" :max="16" :min="0" v-model="data.decimalPlace" @on-change="refresh"></InputNumber>
    </div>
    <div class="format-thousandth-part">
      <Checkbox v-model="data.useSeparator" @on-change="refresh">使用千分位分隔符（ , ）</Checkbox>
    </div>
    <div class="format-negative-part">
      <div class="part-title">负数</div>
      <ul class="format-negative-list">
        <li v-for="(item, index) in numberList" :key="item.value" :class="{
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
  export default {
    name: 'number',
    props: ['data', 'spread', 'currentIndex'],
    data() {
      return {
        numberFormats: [
          '0',
          '0;[Red]0',
          '0_);(0)',
          '0_);[Red](0)',
          '#,##0',
          '#,##0;[Red]#,##0',
          '#,##0_);(#,##0)',
          '#,##0_);[Red](#,##0)'
        ],
        negativeNumbers: {
          '-1234.10': '-1234.10',
          'red:1234.10': '1234.10',
          '(1234.10)': '(1234.10)',
          'red:(1234.10)': '(1234.10)'
        },
        numberList: [],
        negativeIndex: 0,
      }
    },
    computed: {
    },
    methods: {
      getNumberList() {
        var numberValue = '1234.10';
        var decimalPlace = this.data.decimalPlace;

        if (decimalPlace > 0) {
          var decimalPart = '';
          for (var i = 0; i < decimalPlace; i++) {
            decimalPart = (i % 10).toString() + decimalPart.substring(0);
          }
          numberValue = numberValue.substring(0, numberValue.indexOf('.') + 1) + decimalPart;
        } else {
          numberValue = numberValue.substring(0, numberValue.indexOf('.'));
        }
        if (this.data.useSeparator) {
          var index = numberValue.indexOf('1');
          numberValue = numberValue.substring(0, index + 1) + ',' + numberValue.substring(index + 1);
        }

        var target = [];
        for (var name in this.negativeNumbers) { /* NOSONAR: Forin*/
          var result = numberValue;
          var item = this.negativeNumbers[name];
          if (item.indexOf('-') !== -1) {
            result = '-' + result;
          }
          if (item.indexOf(')') !== -1) {
            result = '(' + result + ')';
          }
          target.push({
            value: name,
            label: result
          });
        }

        return target;
      },
      getNumberFormatter(negativeIndex) {
        var numberFormats = this.numberFormats;
        var decimalPlace = this.data.decimalPlace;
        var useSeparator = this.data.useSeparator;
        var numberFormatCount = numberFormats.length / 2;
        var format = numberFormats[negativeIndex];
        if (useSeparator) {
          format = numberFormats[negativeIndex + numberFormatCount];
        }
        if (decimalPlace > 0) {
          var decimalDigits = "";
          for (var i = 0; i < decimalPlace; i++) {
            decimalDigits += '0';
          }
          format = format.replace(/0/g, '0.' + decimalDigits);
        }
        return format;
      },
      refresh() {
        this.data.value = this.getNumberFormatter(this.negativeIndex);
        this.spread.getActiveSheet().getCell(0, 0).formatter(this.data.value);
        this.data.sampleText = this.spread.getActiveSheet().getText(0, 0);
        this.numberList = this.getNumberList();
      },
      selectNegative(index) {
        this.negativeIndex = index;
        this.refresh();
      },
      getNegativeIndex(format) {
        if (format === 'normal') {
          this.negativeIndex = 0;
          return;
        }
        var replaceStr = format.substring(format.indexOf('.'), format.indexOf('.') + this.data.decimalPlace + 1);
        var tempFormat = format.replace(new RegExp(replaceStr, 'g'), "");
        var hasMatched = false;
        for (var i = 0; i < this.numberFormats.length; i++) {
          if (tempFormat === this.numberFormats[i]) {
            this.negativeIndex = (i % 4);
            hasMatched = true;
            return;
          }
        }
        if (!hasMatched) {
          this.negativeIndex = 0;
        }
      },
      getIsSeparator(format) {
        this.data.useSeparator = format.indexOf('#,') !== -1 ? true : false;
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
      currentIndex: function(newVal) {
        if (newVal === 1) {
          this.getDecimalPlace(this.data.value);
          this.getIsSeparator(this.data.value);
          this.getNegativeIndex(this.data.value);
          this.numberList = this.getNumberList();
          this.data.value = this.getNumberFormatter(this.negativeIndex);
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

  .format-thousandth-part {
    height: 14px;
    line-height: 14px;
    margin-top: 12px;
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
