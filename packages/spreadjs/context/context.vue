<template>
  <div>
    <!--插入dialog-->
    <Modal
      v-model="insertDialogVisible"
      title="插入"
      size="small"
      width="250"
      @on-ok="insert"
      @on-cancel="insertDialogVisible = false">
      <RadioGroup v-model="insertValue" vertical size="small">
        <Radio label="shiftcellsright">
          <span>活动单元格右移</span>
        </Radio>
        <Radio label="shiftcellsdown">
          <span>活动单元格下移</span>
        </Radio>
        <Radio label="entirerow">
          <span>整行</span>
        </Radio>
        <Radio label="entirecolumn">
          <span>整列</span>
        </Radio>
      </RadioGroup>
    </Modal>

    <!--删除dialog-->
    <Modal
      v-model="deleteDialogVisible"
      title="删除"
      size="small"
      width="250"
      @on-ok="remove"
      @on-cancel="deleteDialogVisible = false">
      <RadioGroup v-model="deleteValue" vertical size="small">
        <Radio label="shiftcellsleft">
          <span>右侧单元格左移</span>
        </Radio>
        <Radio label="shiftcellsup">
          <span>下方单元格上移</span>
        </Radio>
        <Radio label="entirerow">
          <span>整行</span>
        </Radio>
        <Radio label="entirecolumn">
          <span>整列</span>
        </Radio>
      </RadioGroup>
    </Modal>

    <!--设置单元格格式dialog-->
    <Modal
      v-model="formatCellsDialogVisible"
      title="设置单元格格式"
      size="small"
      @on-ok="setFormat"
      @on-cancel="formatCellsDialogVisible = false">
      <div class="format-wrapper">
        <div class="left-part">
          <div class="part-title">分类</div>
          <ul class="format-category-list focused">
            <li v-for="(item, index) in formatCellInfo.options"
                :class="selectIndex === index && 'selected'"
                @click="changeFormat(index)"
            >{{item.label}}
            </li>
          </ul>
        </div>
        <div class="right-part">
          <div class="format-example-part">
            <div class="part-title">示例</div>
            <Input class="format-example-input" v-model="formatCellInfo.sampleText" disabled></Input>
          </div>
          <div class="format-category-tip">
            <normal
              v-show="selectIndex === 0"
              :spread="spread"
              :data.sync="formatCellInfo"
              :currentIndex="selectIndex"
            ></normal>
            <number
              v-show="selectIndex === 1"
              :spread="spread"
              :data.sync="formatCellInfo"
              :currentIndex="selectIndex"
            ></number>
            <currency
              v-show="selectIndex === 2"
              :data.sync="formatCellInfo"
              :currentIndex="selectIndex"
              :spread="spread"
            ></currency>
            <accounting
              v-show="selectIndex === 3"
              :data.sync="formatCellInfo"
              :currentIndex="selectIndex"
              :spread="spread"
            ></accounting>
            <date
              v-show="selectIndex === 4"
              :data.sync="formatCellInfo"
              :currentIndex="selectIndex"
              :spread="spread"
            ></date>
            <times
              v-show="selectIndex === 5"
              :data.sync="formatCellInfo"
              :currentIndex="selectIndex"
              :spread="spread"
            ></times>
            <percentage
              v-show="selectIndex === 6"
              :data.sync="formatCellInfo"
              :currentIndex="selectIndex"
              :spread="spread"
            ></percentage>
            <fraction
              v-show="selectIndex === 7"
              :data.sync="formatCellInfo"
              :currentIndex="selectIndex"
              :spread="spread"
            ></fraction>
            <scientific
              v-show="selectIndex === 8"
              :data.sync="formatCellInfo"
              :currentIndex="selectIndex"
              :spread="spread"
            ></scientific>
            <texts
              v-show="selectIndex === 9"
              :data.sync="formatCellInfo"
              :currentIndex="selectIndex"
              :spread="spread"
            ></texts>
            <special
              v-show="selectIndex === 10"
              :data.sync="formatCellInfo"
              :currentIndex="selectIndex"
              :spread="spread"
            ></special>
          </div>
        </div>
      </div>
    </Modal>

    <!--spread-->
    <div id="ele-cloud-spreadjs_context" style="display: none"></div>
  </div>
</template>

<script>
  import {formatterOptions, numberFormats, currencyFormats} from '../src/options';
  import normal from './formatCells/normal';
  import number from './formatCells/number';
  import currency from './formatCells/currency';
  import accounting from './formatCells/accounting';
  import date from './formatCells/date';
  import times from './formatCells/time';
  import percentage from './formatCells/percentage';
  import fraction from './formatCells/fraction';
  import scientific from './formatCells/scientific';
  import texts from './formatCells/text';
  import special from './formatCells/special';
  import GC from '@grapecity/spread-sheets';
  import {whichFormatBelong} from '../src/utils';

  const menus = require('./menu.json');

  export default {
    name: 'ContextCore',
    components: {
      normal,
      number,
      currency,
      accounting,
      date,
      times,
      percentage,
      fraction,
      scientific,
      texts,
      special,
    },
    props: {
      GC: Object,
      workbook: Object,
    },
    data() {
      return {
        clickCell: {},
        worksheet: null,

        // 插入
        insertDialogVisible: false,
        insertValue: 'shiftcellsdown',

        // 删除
        deleteDialogVisible: false,
        deleteValue: 'shiftcellsup',

        // 设置单元格格式
        formatCellsDialogVisible: false,
        formatCellInfo: {
          options: [
            {
              label: '常规',
              value: 'normal',
            },
            {
              label: '数值',
              value: '0.00',
            },
            {
              label: '货币',
              value: '$#,##0.00',
            },
            {
              label: '会计专用',
              value: '$ #,##0.00;$ (#,##0.00);$ "-"??;@',
            },
            {
              label: '日期',
              value: '[$]m/d/yyyy',
            },
            {
              label: '时间',
              value: 'h:mm:ss AM/PM',
            },
            {
              label: '百分比',
              value: '0.00%',
            },
            {
              label: '分数',
              value: '# ?/?',
            },
            {
              label: '科学计数',
              value: '0.00E+00',
            },
            {
              label: '文本',
              value: '@',
            },
            {
              label: '特殊',
              value: '000000',
            },
          ],
          originText: '',
          value: 'normal',
          decimalPlace: 0,
          useSeparator: false,
          sampleText: ''
        },

        selectIndex: -1,

        // 占位spread
        spread: null,
      }
    },
    computed: {},
    methods: {
      syncSpread() {
        this.worksheet = this.workbook.getActiveSheet();
        this.clickCell.row = this.worksheet.getActiveRowIndex();
        this.clickCell.col = this.worksheet.getActiveColumnIndex();
      },
      getSelectionTypeWithSelections(selections) {
        var selectionType;
        for (var i = 0; i < selections.length; i++) {
          var selection = selections[i];
          if (selection.col === -1 && selection.row === -1) {
            return 0 /* Sheet */;
          } else if (selection.row === -1) {
            if (selectionType === undefined) {
              selectionType = 2 /* OnlyColumn */;
            } else if (selectionType != 2 /* OnlyColumn */) {
              return 4 /* Mixture */;
            }
          } else if (selection.col === -1) {
            if (selectionType === undefined) {
              selectionType = 1 /* OnlyRow */;
            } else if (selectionType != 1 /* OnlyRow */) {
              return 4 /* Mixture */;
            }
          } else {
            if (selectionType === undefined) {
              selectionType = 3 /* OnlyCells */;
            } else if (selectionType != 3 /* OnlyCells */) {
              return 4 /* Mixture */;
            }
          }
        }
        return selectionType;
      },
      getSortedColumnSelections() {
        var sortedRanges = this.getSelections();
        for (var i = 0; i < sortedRanges.length - 1; i++) {
          for (var j = i + 1; j < sortedRanges.length; j++) {
            if (sortedRanges[i].col < sortedRanges[j].col) {
              var temp = sortedRanges[i];
              sortedRanges[i] = sortedRanges[j];
              sortedRanges[j] = temp;
            }
          }
        }
        return sortedRanges;
      },
      getSortedRowSelections() {
        var sortedRanges = this.getSelections();
        for (var i = 0; i < sortedRanges.length - 1; i++) {
          for (var j = i + 1; j < sortedRanges.length; j++) {
            if (sortedRanges[i].row < sortedRanges[j].row) {
              var temp = sortedRanges[i];
              sortedRanges[i] = sortedRanges[j];
              sortedRanges[j] = temp;
            }
          }
        }
        return sortedRanges;
      },
      getSelections() {
        return this.worksheet.getSelections();
      },
      getUnFilteredRows(range, filterInfo) {
        var zone = [], start = -1, index;
        for (index = range.row; index < range.row + range.rowCount; index++) {
          if (filterInfo[index] !== false && start === -1) {
            start = index;
          }
          if (filterInfo[index] === false && start !== -1) {
            zone.push([start, index - start]);
            start = -1;
          }
        }
        if (start !== -1) {
          zone.push([start, index - start]);
        }
        return zone;
      },
      insert() {
        this.syncSpread();
        switch (this.insertValue) {
          case 'shiftcellsdown':
            if (this.getSelectionTypeWithSelections(this.getSelections()) === 3 /* OnlyCells */) {
              var sortedRanges = this.getSortedRowSelections();
              var rowCount = this.worksheet.getRowCount();
              for (var i = 0; i < sortedRanges.length; i++) {
                var r = sortedRanges[i];
                var option = this.GC.Spread.Sheets.CopyToOptions.all;
                this.worksheet.addRows(rowCount, r.rowCount);
                this.worksheet.moveTo(r.row, r.col, r.row + r.rowCount, r.col, rowCount - r.row, r.colCount, option);
              }
            }
            break;
          case 'shiftcellsright':
            if (this.getSelectionTypeWithSelections(this.getSelections()) === 3 /* OnlyCells */) {
              var sortedRanges = this.getSortedColumnSelections();
              var colCount = this.worksheet.getColumnCount();
              for (var i = 0; i < sortedRanges.length; i++) {
                var r = sortedRanges[i];
                var option = this.GC.Spread.Sheets.CopyToOptions.all;
                this.worksheet.addColumns(colCount, r.colCount);
                this.worksheet.moveTo(r.row, r.col, r.row, r.col + r.colCount, r.rowCount, colCount - r.col, option);
              }
            }
            break;
          case 'entirerow':
            var sortedRanges = this.getSortedRowSelections();
            for (var i = 0; i < sortedRanges.length; i++) {
              if (sortedRanges[i].row === -1 && sortedRanges[i].rowCount === 0) {
                sortedRanges[i].row = 0;
                sortedRanges[i].rowCount = 1;
              }
              this.worksheet.addRows(sortedRanges[i].row, sortedRanges[i].rowCount);
            }
            break;
          case 'entirecolumn':
            var sortedRanges = this.getSortedColumnSelections();
            for (var i = 0; i < sortedRanges.length; i++) {
              if (sortedRanges[i].col === -1 && sortedRanges[i].colCount === 0) {
                sortedRanges[i].col = 0;
                sortedRanges[i].colCount = 1;
              }
              this.worksheet.addColumns(sortedRanges[i].col, sortedRanges[i].colCount);
            }
            break;
          default:
            break;
        }
        this.insertDialogVisible = false;
      },
      remove() {
        this.syncSpread();
        switch (this.deleteValue) {
          case 'shiftcellsleft':
            var sortedRanges = this.getSortedColumnSelections();
            for (var i = 0; i < sortedRanges.length; i++) {
              var r = sortedRanges[i];
              var option = this.GC.Spread.Sheets.CopyToOptions.all;
              var copyColCount = this.worksheet.getColumnCount() - (r.col + r.colCount);
              this.worksheet.moveTo(r.row, r.col + r.colCount, r.row, r.col, r.rowCount, copyColCount, option);
              if (copyColCount <= r.colCount) { // means copyRowCount is not enough
                var clearRow = r.row;
                var clearCol = r.col + copyColCount;
                var clearRangeColCount = r.col + r.colCount;
                var clearRangeRowCount = r.rowCount;
                this.worksheet.clear(clearRow, clearCol, clearRangeRowCount, clearRangeColCount, 3, 32 /* Axis */ | 64 /* BindingPath */ | 1 /* Data */ | 16 /* Sparkline */ | 2 /* Style */ | 4 /* Comment */);
              }
            }
            break;
          case 'shiftcellsup':
            var sortedRanges = this.getSortedRowSelections();
            for (var i = 0; i < sortedRanges.length; i++) {
              var r = sortedRanges[i];
              var option = this.GC.Spread.Sheets.CopyToOptions.all;
              var copyRowCount = this.worksheet.getRowCount() - (r.row + r.rowCount);
              this.worksheet.moveTo(r.row + r.rowCount, r.col, r.row, r.col, copyRowCount, r.colCount, option);
              if (copyRowCount <= r.rowCount) { // means copyRowCount is not enough
                var clearRow = r.row + copyRowCount;
                var clearCol = r.col;
                var clearRangeColCount = r.colCount;
                var clearRangeRowCount = r.row + r.rowCount;
                this.worksheet.clear(clearRow, clearCol, clearRangeRowCount, clearRangeColCount, 3, 32 /* Axis */ | 64 /* BindingPath */ | 1 /* Data */ | 16 /* Sparkline */ | 2 /* Style */ | 4 /* Comment */);
              }
            }
            break;
          case 'entirerow':
            var sortedRanges = this.getSortedRowSelections();
            var sheet = this.worksheet;
            var filterInfo = sheet.filterRowsVisibleInfo && sheet.filterRowsVisibleInfo.rowsVisibleInfo;
            var haveFilter = filterInfo && Object.keys(filterInfo).length > 0;
            for (var i = 0; i < sortedRanges.length; i++) {
              var range = sortedRanges[i];
              if (haveFilter) { //Fix SJS-1217 that delete rows should skip the filtered rows.
                var zone = this.getUnFilteredRows(range, filterInfo);
                for (var index = zone.length - 1; index >= 0; index--) {
                  sheet.deleteRows(zone[index][0], zone[index][1]);
                }
              } else {
                sheet.deleteRows(range.row, range.rowCount);
              }
            }
            break;
          case 'entirecolumn':
            var sortedRanges = this.getSortedColumnSelections();
            for (var i = 0; i < sortedRanges.length; i++) {
              this.worksheet.deleteColumns(sortedRanges[i].col, sortedRanges[i].colCount);
            }
            break;
          default:
            break;
        }
        this.deleteDialogVisible = false;
      },
      changeFormat(index) {
        this.selectIndex = index;
      },
      setFormat() {
        const res = this.formatCellInfo.value === 'normal' ? undefined : this.formatCellInfo.value;
        this.worksheet.getCell(this.clickCell.row, this.clickCell.col).formatter(res);
        this.formatCellsDialogVisible = false;
      },
      getSelectedIndex(format) {
        this.selectIndex = whichFormatBelong(format);
      },
    },
    mounted() {
    },
    created() {
      const self = this;
      // clear rightkey
      for (let i = this.workbook.contextMenu.menuData.length; i >= 0; i--) {
        const item = this.workbook.contextMenu.menuData[i];
        // delete 清除、过滤、排序、批注
        if (item && (item.name === 'gc.spread.clearContents' || item.name === 'gc.spread.filter'
          || item.name === 'gc.spread.sort' || item.name === 'gc.spread.insertComment'
          || item.name === 'gc.spread.editComment' || item.name === 'gc.spread.deleteComment'
          || item.name === 'gc.spread.toggleComment')) {
          this.workbook.contextMenu.menuData.splice(i, 1);
        }
      }
      const commandManager = this.workbook.commandManager();

      menus.forEach(menu => {
        self.workbook.contextMenu.menuData.push(menu);
      })

      const Commands = {};

      // 筛选
      Commands.filter = {
        canUndo: false,
        execute: (spread, options) => {
          self.syncSpread();
          self.worksheet.suspendPaint();
          const rowCount = self.worksheet.getRowCount();
          const selections = self.worksheet.getSelections();
          if (selections.length <= 0) {
            return;
          }
          self.worksheet.resumePaint();
          self.worksheet.rowFilter(new self.GC.Spread.Sheets.Filter.HideRowFilter(
            new self.GC.Spread.Sheets.Range(
              self.clickCell.row + 1, self.clickCell.col,
              rowCount - self.clickCell.row - 1, selections[0].colCount,
            ),
          ));
        },
      }

      // 插入...
      Commands.insertDialog = {
        canUndo: false,
        execute: function (context, options, isUndo) {
          self.insertDialogVisible = true;
        }
      }

      // 删除...
      Commands.deleteDialog = {
        canUndo: false,
        execute: function (context, options, isUndo) {
          self.deleteDialogVisible = true;
        }
      }

      // 清除内容
      Commands.clearContent = {
        canUndo: false,
        execute: function (context, options, isUndo) {
          self.syncSpread();
          var selections = self.getSelections();
          for (var i = 0; i < selections.length; i++) {
            var selection = selections[i];
            self.worksheet.clear(selection.row, selection.col, selection.rowCount, selection.colCount, self.GC.Spread.Sheets.SheetArea.viewport /* viewport */, self.GC.Spread.Sheets.StorageType.data /* Data */);
          }
        }
      }

      // 设置单元格格式...
      Commands.formatCells = {
        canUndo: false,
        execute: function (context, options, isUndo) {
          self.syncSpread();
          self.formatCellInfo.value = self.worksheet.getCell(self.clickCell.row, self.clickCell.col).formatter() || 'normal';
          const value = self.worksheet.getValue(self.clickCell.row, self.clickCell.col);
          self.formatCellInfo.originText = self.worksheet.getText(self.clickCell.row, self.clickCell.col);
          self.spread.getActiveSheet().setValue(0, 0, value);
          self.getSelectedIndex(self.formatCellInfo.value);
          self.formatCellsDialogVisible = true;
        }
      }

      for (let key of Object.keys(Commands)) {
        commandManager.register(key, Commands[key], null, false, false, false, false);
      }

      self.syncSpread();

      this.spread = new GC.Spread.Sheets.Workbook(document.getElementById('ele-cloud-spreadjs_context'));
    },
    beforeDestroy() {

    },
    watch: {
      formatCellsDialogVisible: function (newVal) {
        if (!newVal) {
          this.selectIndex = -1;
        }
      }
    }
  }
</script>
<style>
  .format-wrapper {
    display: flex;
  }

  .left-part {
    width: 132px;
    margin-right: 17px;
  }

  .part-title {
    line-height: 1;
    margin-bottom: 8px;
  }

  .format-category-list {
    background-color: #fff;
    border: 1px solid #ececed;
    border-radius: 2px;
    padding: 5px 0;
    font-size: 12px;
  }

  .format-category-list li {
    height: 26px;
    line-height: 26px;
    padding-left: 12px;
    cursor: pointer;
  }

  .format-category-list li.selected {
    background-color: #f7f7f7;
    font-weight: 700;
  }

  .right-part {
    width: 320px;
  }

  .format-category-tip {
    height: 40px;
    line-height: 20px;
    margin-top: 10px;
    font-size: 12px;
    user-select: none;
  }
</style>
