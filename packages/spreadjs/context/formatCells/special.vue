<template>
  <div>
    <div class="format-types-part">
      <div class="part-title">类型</div>
      <ul class="format-types-list">
        <li v-for="(date, index) in specialList"
            :key="date.value"
            :class="index === seletedIndex && 'selected'"
            @click="selectSpecialType(index)"
        >{{date.label}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {specialFormats} from '../../src/options';

  export default {
    name: 'special',
    props: ['data', 'spread', 'currentIndex'],
    data() {
      return {
        seletedIndex: 0,
        specialList: [],
        specialType: [
          "邮政编码",
          "中文小写字母",
          "中文大写字母"
        ],
      }
    },
    computed: {},
    methods: {
      getSpecialFormat(format) {
        for (var i = 0; i < specialFormats.length; i++) {
          if (format === specialFormats[i]) {
            this.seletedIndex = i;
            return specialFormats[i];
          }
        }
        this.seletedIndex = 0;
        return specialFormats[0];
      },
      getSpecialList() {
        var list = [];
        for (var i = 0; i < specialFormats.length; i++) {
          list.push({
            value: specialFormats[i],
            label: this.specialType[i]
          });
        }
        return list;
      },
      refreshSampleText() {
        var allFormats = specialFormats;
        this.data.value = allFormats[this.seletedIndex];
        this.spread.getActiveSheet().setFormatter(0, 0, this.data.value);
        this.data.sampleText = this.spread.getActiveSheet().getText(0, 0);
      },
      selectSpecialType(index) {
        this.seletedIndex = index;
        this.refreshSampleText();
      }
    },
    watch: {
      currentIndex: function (newVal) {
        if (newVal === 10) {
          this.data.value = this.getSpecialFormat(this.data.value);
          this.specialList = this.getSpecialList();
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
