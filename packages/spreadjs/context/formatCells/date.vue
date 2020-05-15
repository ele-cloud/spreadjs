<template>
  <div>
    <div class="format-types-part">
      <div class="part-title">类型</div>
      <ul class="format-types-list">
        <li v-for="(date, index) in dateList"
            :key="date.value"
            :class="index === seletedIndex && 'selected'"
            @click="selectDateType(index)"
        >{{date.label}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {dateFormats} from '../../src/options';

  export default {
    name: 'date',
    props: ['data', 'spread', 'currentIndex'],
    data() {
      return {
        seletedIndex: 0,
        defaultTime: '3/14/2001 13:30:00',
        dateList: [],
        dateFormats,
      }
    },
    computed: {},
    methods: {
      getDateFormat(format) {
        var allFormats = dateFormats;
        var text = this.data.originText;
        var i;
        for (i = 0; i < allFormats.length; i++) {
          if (this.getTextBySpread(this.spread.getActiveSheet().getValue(0, 0), allFormats[i]) === text) {
            this.seletedIndex = i;
            return allFormats[i];
          }
        }
        this.seletedIndex = 0;
        return allFormats[0];
      },
      getTextBySpread(value, format) {
        var sheet = this.spread.getActiveSheet();
        sheet.setFormatter(1, 1, format);
        sheet.setValue(1, 1, value);
        return sheet.getText(1, 1);
      },
      getDateList() {
        var dates = [];
        var enFormats = dateFormats;
        for (var i = 0; i < enFormats.length; i++) {
          dates.push({
            value: enFormats[i],
            label: this.getTextBySpread(this.defaultTime, enFormats[i])
          });
        }
        return dates;
      },
      refreshSampleText() {
        var allFormats = dateFormats;
        this.data.value = allFormats[this.seletedIndex];
        this.spread.getActiveSheet().setFormatter(0, 0, this.data.value);
        this.data.sampleText = this.spread.getActiveSheet().getText(0, 0);
      },
      selectDateType(index) {
        this.seletedIndex = index;
        this.refreshSampleText();
      }
    },
    watch: {
      currentIndex: function (newVal) {
        if (newVal === 4) {
          this.dateList = this.getDateList();
          this.data.value = this.getDateFormat(this.data.value);
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
