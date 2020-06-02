import { GC, workbook } from '../src/init';
import { formatterOptions, fontOptions, fontsizeOptions } from '../src/options';

export default {
    data() {
      return {
        GC,
        workbook,
        formatterOptions, fontOptions, fontsizeOptions,
        worksheet: null,
        // 格式刷
        formatPainter: {
          isPainting: false,
          fromSheet: null,
          fromRange: null,
        },
        // 单元格样式
        cellStyle: {
          cellBold: false,
          cellItalic: false,
          cellUnderline: false,
          cellLeft: false,
          cellCenter: false,
          cellRight: false,
          cellTop: false,
          cellMiddle: false,
          cellBottom: false,
          cellFormatter: 'normal',
          cellFont: 'SimSun',
          cellFontsize: '12px',
          cellMicrometerOperator: false,
          cellColor: '',
          cellBgColor: '',
          isLocked: '',
          wordWrap: false,
        },
        tooltip: {
          cellFont: false,
          cellFontSize: false,
          cellFormatter: false,
        },
        clickCell: {},
        visibleCellColorPicker: false,
        visibleCellBgColorPicker: false,
        colors: [
          {
            key: 'FFFFFF',
            value: '白色'
          },
          {
            key: '000000',
            value: '黑色'
          },
          {
            key: 'EE7976',
            value: '粉色'
          },
          {
            key: 'FF9900',
            value: '橙色'
          },
          {
            key: 'FFD900',
            value: '黄色'
          },
          {
            key: 'F4F4F5',
            value: '灰色'
          },
          {
            key: 'A3E043',
            value: '绿色'
          },
          {
            key: '37D9F0',
            value: '天蓝色'
          },
          {
            key: '4DA8EE',
            value: '深蓝色'
          },
          {
            key: '956FE7',
            value: '紫色'
          }
        ],
        tipsDelay: 0,
        listOptions: '',
        listValidatorVisible: false,
        viewport: 'large' // small default large
      }
    },
    methods: {
      /**
       * method cell changed event.
       */
      bindEvent() {
        this.workbook.bind(this.GC.Spread.Sheets.Events.CellClick, (e, args) => {
          this.clickCell.row = args.row;
          this.clickCell.col = args.col;

          this.painterPaste();

          Object.assign(this.cellStyle, this.getCellStyle());
        });

        this.workbook.bind(this.GC.Spread.Sheets.Events.ActiveSheetChanged, (e, args) => {
          this.syncSpread();
          Object.assign(this.cellStyle, this.getCellStyle());
        });

        // 由于存在代码主动切换sheet页的情况，而ActiveSheetChanged不会触发，所以我们只能通过轮循来同步样式
        setInterval(() => {
          this.syncSpread();
          Object.assign(this.cellStyle, this.getCellStyle());
        }, 500);
      },
      /**
       * method update spread current status.
       */
      syncSpread() {
        this.worksheet = this.workbook.getActiveSheet();
        this.clickCell.row = this.worksheet.getActiveRowIndex();
        this.clickCell.col = this.worksheet.getActiveColumnIndex();
      },
      /**
       * method get current checked cell style.
       */
      getCellStyle() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        if (sel.length > 0) {

          this.cellStyle.isLocked = sheet.getCell(sel[0].row, sel[0].col).locked();
          this.cellStyle.wordWrap = sheet.getCell(sel[0].row, sel[0].col).wordWrap();

          const style = sheet.getStyle(sel[0].row, sel[0].col) || new this.GC.Spread.Sheets.Style();

          if (!style) {
            return;
          }

          // 粗体
          this.cellStyle.cellBold = !!((style.font && style.font.indexOf('bold') > -1));

          // 倾斜
          this.cellStyle.cellItalic = !!((style.font && style.font.indexOf('italic') > -1));

          // 下划线
          this.cellStyle.cellUnderline = style.textDecoration === this.GC.Spread.Sheets.TextDecorationType.underline;

          // 水平对齐方式
          this.cellStyle.cellLeft = style.hAlign === this.GC.Spread.Sheets.HorizontalAlign.left;
          this.cellStyle.cellCenter = style.hAlign === this.GC.Spread.Sheets.HorizontalAlign.center;
          this.cellStyle.cellRight = style.hAlign === this.GC.Spread.Sheets.HorizontalAlign.right;

          // 垂直对齐方式
          this.cellStyle.cellTop = style.vAlign === this.GC.Spread.Sheets.VerticalAlign.top;
          this.cellStyle.cellMiddle = style.vAlign === this.GC.Spread.Sheets.VerticalAlign.center;
          this.cellStyle.cellBottom = style.vAlign === this.GC.Spread.Sheets.VerticalAlign.bottom;

          // 单元格格式
          this.cellStyle.cellFormatter = !style.formatter ? 'normal' : style.formatter;

          // 字体
          if (style.font) {
            const fontArray = style.font.split(' ');
            for (const [index, elem] of fontArray.entries()) {
              if (elem.indexOf('px') > -1) {
                this.cellStyle.cellFont = fontArray[index + 1];
                break;
              } else {
                this.cellStyle.cellFont = '';
              }
            }
          } else {
            this.cellStyle.cellFont = '';
          }

          // 字体大小
          if (style.font) {
            const fontArray = style.font.split(' ');
            for (const [index, elem] of fontArray.entries()) {
              if (elem.indexOf('px') > -1) {
                this.cellStyle.cellFontsize = elem.match(/(\S*)px/)[0];
                break;
              } else {
                this.cellStyle.cellFontsize = '';
              }
            }
          } else {
            this.cellStyle.cellFontsize = '';
          }

          this.cellStyle.cellColor = style.foreColor || '#000000';
          this.cellStyle.cellBgColor = style.backColor || '#ffffff';

          return this.cellStyle;
        }
      },

      /**
       * method change checked or unchecked color.
       * @param {String} toolItem Tool item etc: painter.
       * @param {Boolean} checked Wheather checked.
       */
      checked(toolItem, checked) {
        this.status[toolItem] = checked ? 'primary' : 'text';
      },

      /**
       * method painter copy.
       */
      painterCopy() {
        this.formatPainter.fromRange = this.worksheet.getSelections()[0];
        this.formatPainter.fromSheet = this.worksheet;
        this.formatPainter.isPainting = true;
      },

      /**
       * method painter paste.
       */
      painterPaste() {
        if (!this.formatPainter.isPainting) {
          return;
        }
        this.formatPainter.isPainting = false;
        const sheet = this.worksheet;
        sheet.suspendPaint();
        const toRange = sheet.getSelections()[0];
        const fromRange = this.formatPainter.fromRange;
        const fromSheet = this.formatPainter.fromSheet;
        // toRange biger than fromRange
        if (fromRange.rowCount > toRange.rowCount) {
          toRange.rowCount = fromRange.rowCount;
        }
        if (fromRange.colCount > toRange.colCount) {
          toRange.colCount = fromRange.colCount;
        }
        // toRange must in Sheet
        if (toRange.row + toRange.rowCount > sheet.getRowCount()) {
          toRange.rowCount = sheet.getRowCount() - toRange.row;
        }
        if (toRange.col + toRange.colCount > sheet.getColumnCount()) {
          toRange.colCount = sheet.getColumnCount() - toRange.col;
        }
        const rowStep = fromRange.rowCount;
        const colStep = fromRange.colCount;
        const endRow = toRange.row + toRange.rowCount - 1;
        const endCol = toRange.col + toRange.colCount - 1;

        // if toRange bigger than fromRange, repeat paint
        for (let startRow = toRange.row; startRow <= endRow; startRow += rowStep) {
          for (let startCol = toRange.col; startCol <= endCol; startCol += colStep) {
            const rowCount = startRow + rowStep > endRow + 1 ? endRow - startRow + 1 : rowStep;
            const colCount = startCol + colStep > endCol + 1 ? endCol - startCol + 1 : colStep;
            const fromRanges = new this.GC.Spread.Sheets.Range(fromRange.row, fromRange.col, rowCount, colCount);
            const pastedRange = new this.GC.Spread.Sheets.Range(startRow, startCol, rowCount, colCount);
            this.workbook.commandManager()
              .execute({
                cmd: 'clipboardPaste',
                sheetName: sheet.name(),
                fromSheet,
                fromRanges: [fromRanges],
                pastedRanges: [pastedRange],
                isCutting: false,
                clipboardText: '',
                pasteOption: this.GC.Spread.Sheets.ClipboardPasteOptions.formatting,
              });
          }
        }
        sheet.resumePaint();
      },

      /**
       * method bold.
       */
      boldCell() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              const style = sheet.getStyle(row, col) || new this.GC.Spread.Sheets.Style();
              if (!style.font) {
                style.font = 'normal normal 12px 宋体';
              }
              const fontArray = style.font.split(' ');
              if (this.cellStyle.cellBold) {
                for (const [index, elem] of fontArray.entries()) {
                  if (elem === 'bold') {
                    fontArray[index] = 'normal';
                    break;
                  }
                }
              } else if (!this.cellStyle.cellBold && fontArray.length >= 4) {
                for (const [index, elem] of fontArray.entries()) {
                  if (elem === 'normal' && index <= 1) {
                    fontArray[index] = 'bold';
                    break;
                  }
                }
              } else {
                fontArray.unshift('bold');
              }
              const newFont = fontArray.join(' ');
              sheet.getCell(row, col).font(newFont);
            }
          }
          this.cellStyle.cellBold = !this.cellStyle.cellBold;
        }
        sheet.resumePaint();
      },

      /**
       * method italic.
       */
      italicCell() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              const style = sheet.getStyle(row, col) || new this.GC.Spread.Sheets.Style();
              if (!style.font) {
                style.font = 'normal normal 12px 宋体';
              }
              const fontArray = style.font.split(' ');
              if (this.cellStyle.cellItalic) {
                for (const [index, elem] of fontArray.entries()) {
                  if (elem === 'italic') {
                    fontArray[index] = 'normal';
                    break;
                  }
                }
              } else if (!this.cellStyle.cellItalic && fontArray.length >= 4) {
                for (const [index, elem] of fontArray.entries()) {
                  if (elem === 'normal' && index <= 1) {
                    fontArray[index] = 'italic';
                    break;
                  }
                }
              } else {
                fontArray.unshift('italic');
              }
              const newFont = fontArray.join(' ');
              sheet.getCell(row, col).font(newFont);
            }
          }
          this.cellStyle.cellItalic = !this.cellStyle.cellItalic;
        }
        sheet.resumePaint();
      },

      /**
       * method underline.
       */
      underlineCell() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              if (this.cellStyle.cellUnderline) {
                sheet.getCell(row, col).textDecoration(undefined);
              } else {
                sheet.getCell(row, col).textDecoration(this.GC.Spread.Sheets.TextDecorationType.underline);
              }
            }
          }
          this.cellStyle.cellUnderline = !this.cellStyle.cellUnderline;
        }
        sheet.resumePaint();
      },

      /**
       * method set font.
       * @param {Object | String} e Selected font.
       */
      setFont(e) {
        let value;
        if (typeof e === 'object') {
          value = e.target.value;
        } else {
          value = e;
        }
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              const style = sheet.getStyle(row, col) || new this.GC.Spread.Sheets.Style();
              if (!style.font) {
                style.font = 'normal normal 12px 宋体';
              }
              const fontArray = style.font.split(' ');
              for (const [index, elem] of fontArray.entries()) {
                if (elem.indexOf('px') > -1) {
                  fontArray[index + 1] = value;
                  break;
                }
              }
              const newFont = fontArray.join(' ');
              sheet.getCell(row, col).font(newFont);
            }
          }
          this.cellStyle.cellFont = value;
        }
        sheet.resumePaint();
      },

      /**
       * method set font size.
       * @param {Object | String} e Selected font size.
       */
      setFontsize(e) {
        let value;
        if (typeof e === 'object') {
          value = e.target.value;
        } else {
          value = e;
        }
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              const style = sheet.getStyle(row, col) || new this.GC.Spread.Sheets.Style();
              if (!style.font) {
                style.font = 'normal normal 12px 宋体';
              }
              const fontArray = style.font.split(' ');
              for (const [index, elem] of fontArray.entries()) {
                if (elem.indexOf('px') > -1) {
                  fontArray[index] = value;
                  break;
                }
              }
              const newFont = fontArray.join(' ');
              sheet.getCell(row, col).font(newFont);
            }
          }
          this.cellStyle.cellFontsize = value;
        }
        sheet.resumePaint();
      },

      /**
       * method Horizontal alignment.
       * @param {String} align Align the direction.
       */
      hAlignCell(align = 'center') {
        this.cellStyle.cellLeft = false;
        this.cellStyle.cellRight = false;
        this.cellStyle.cellCenter = false;
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              sheet.getCell(row, col).hAlign(this.GC.Spread.Sheets.HorizontalAlign[align]);
            }
          }
        }
        switch (align) {
          case 'center':
            this.cellStyle.cellCenter = true;
            break;
          case 'left':
            this.cellStyle.cellLeft = true;
            break;
          case 'right':
            this.cellStyle.cellRight = true;
            break;
        }
        sheet.resumePaint();
      },

      /**
       * method Vertical alignment.
       * @param {String} align Align the direction.
       */
      vAlignCell(align = 'center') {
        this.cellStyle.cellTop = false;
        this.cellStyle.cellMiddle = false;
        this.cellStyle.cellBottom = false;
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              sheet.getCell(row, col).vAlign(this.GC.Spread.Sheets.VerticalAlign[align]);
            }
          }
        }
        switch (align) {
          case 'center':
            this.cellStyle.cellMiddle = true;
            break;
          case 'top':
            this.cellStyle.cellTop = true;
            break;
          case 'bottom':
            this.cellStyle.cellBottom = true;
            break;
        }
        sheet.resumePaint();
      },

      /**
       * method get cell range.
       */
      getActualCellRange(cellRange, rowCount, columnCount) {
        const spreadNS = this.GC.Spread.Sheets;
        if (cellRange.row === -1 && cellRange.col === -1) {
          return new spreadNS.Range(0, 0, rowCount, columnCount);
        }
        if (cellRange.row === -1) {
          return new spreadNS.Range(0, cellRange.col, rowCount, cellRange.colCount);
        }
        if (cellRange.col === -1) {
          return new spreadNS.Range(cellRange.row, 0, cellRange.rowCount, columnCount);
        }

        return cellRange;
      },

      mergeFunc(value) {
        this[value]();
      },
      /**
       * method merge cell.
       */
      mergeCell() {
        const sheet = this.worksheet;
        sheet.suspendPaint();
        sheet.options.allowCellOverflow = true;
        let sel = sheet.getSelections();
        if (sel.length > 0) {
          sel = this.getActualCellRange(sel[sel.length - 1], sheet.getRowCount(), sheet.getColumnCount());
          sheet.addSpan(sel.row, sel.col, sel.rowCount, sel.colCount);
        }
        sheet.resumePaint();
      },

      /**
       * method unmerge cell.
       */
      unmergeCell() {
        const sheet = this.worksheet;
        sheet.suspendPaint();
        sheet.options.allowCellOverflow = true;
        let sel = sheet.getSelections();
        if (sel.length > 0) {
          sel = this.getActualCellRange(sel[sel.length - 1], sheet.getRowCount(), sheet.getColumnCount());
          for (let i = 0; i < sel.rowCount; i++) {
            for (let j = 0; j < sel.colCount; j++) {
              sheet.removeSpan(i + sel.row, j + sel.col);
            }
          }
        }
        sheet.resumePaint();
      },

      /**
       * method auto word wrap.
       */
      setWordWrap() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              sheet.getCell(row, col).wordWrap(!this.cellStyle.wordWrap);
            }
          }
        }
        this.cellStyle.wordWrap = !this.cellStyle.wordWrap;
        sheet.resumePaint();
      },

      borderFunc(value) {
        this[value]();
      },

      /**
       * method add border.
       */
      addBorder() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          const lineBorder = new this.GC.Spread.Sheets.LineBorder('black', this.GC.Spread.Sheets.LineStyle.thin);
          range.setBorder(lineBorder, {all: true});
        }
        sheet.resumePaint();
      },

      /**
       * method delete border.
       */
      delBorder() {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          range.setBorder(null, {all: true});
        }
        sheet.resumePaint();
      },

      /**
       * method set cell formatter.
       * @param {String} e Will be set type.
       */
      setFormatter(e) {
        let value;
        if (typeof e === 'object') {
          value = e.target.value;
        } else {
          value = e;
        }
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          for (let row = range.row; row < (range.row + range.rowCount); row++) {
            for (let col = range.col; col < (range.col + range.colCount); col++) {
              if (value === 'normal') {
                sheet.getCell(row, col).formatter(undefined);
              } else if (value === '#,##0.00') { // 千分符
                if (this.cellStyle.cellMicrometerOperator) {
                  value = 'normal';
                  sheet.getCell(row, col).formatter(undefined);
                } else {
                  sheet.getCell(row, col).formatter(value);
                }
              } else {
                sheet.getCell(row, col).formatter(value);
              }
            }
          }
          this.cellStyle.cellMicrometerOperator = !this.cellStyle.cellMicrometerOperator;
        }
        sheet.resumePaint();
        this.cellStyle.cellFormatter = value;
      },

      getSelections () {
        return this.worksheet.getSelections();
      },

      /**
       * method increase decimal.
       */
      increaseDecimal() {
        var self = this, formatString, zero, numberSign, decimalPoint, zeroPointZero;
        var _selections = this.getSelections();
        for (var p = 0; p < _selections.length; p++) {
          var selectCells = _selections[p];
          var defaultActiveCell = self.worksheet.getCell(selectCells.row, selectCells.col);
          var defaultFormatter = defaultActiveCell.formatter();
          var defaultText = defaultActiveCell.value();
          var i;
          if (defaultText !== undefined && defaultText !== null) {
            zero = "0";
            numberSign = "#";
            decimalPoint = ".";
            zeroPointZero = "0" + decimalPoint + "0";

            var scientificNotationCheckingFormatter = self.getScientificNotationCheckingFormattter(defaultFormatter);
            if (!defaultFormatter || (defaultFormatter === "General" || (scientificNotationCheckingFormatter && (scientificNotationCheckingFormatter.indexOf("E") >= 0 || scientificNotationCheckingFormatter.indexOf('e') >= 0)))) {
              scientificNotationCheckingFormatter = zeroPointZero;
              if ((!isNaN(defaultText)) && ((defaultText + "").split(".").length > 1)) {

                var afterPointZero = (defaultText + "").split(".")[1].length;
                for (var m = 0; m < afterPointZero; m++) {
                  scientificNotationCheckingFormatter = scientificNotationCheckingFormatter + "0";
                }
              }
            } else {
              formatString = defaultFormatter;
              var formatters = formatString.split(';');
              for (i = 0; i < formatters.length && i < 2; i++) {
                if (formatters[i] && formatters[i].indexOf("/") < 0 && formatters[i].indexOf(":") < 0 && formatters[i].indexOf("?") < 0) {
                  var indexOfDecimalPoint = formatters[i].lastIndexOf(decimalPoint);
                  if (indexOfDecimalPoint !== -1) {
                    formatters[i] = formatters[i].slice(0, indexOfDecimalPoint + 1) + zero + formatters[i].slice(indexOfDecimalPoint + 1);
                  } else {
                    var indexOfZero = formatters[i].lastIndexOf(zero);
                    var indexOfNumberSign = formatters[i].lastIndexOf(numberSign);
                    var insertIndex = indexOfZero > indexOfNumberSign ? indexOfZero : indexOfNumberSign;
                    if (insertIndex >= 0) {
                      formatters[i] = formatters[i].slice(0, insertIndex + 1) + decimalPoint + zero + formatters[i].slice(insertIndex + 1);
                    }
                  }
                }
              }
              formatString = formatters.join(";");
              scientificNotationCheckingFormatter = formatString;
            }
            for (var r = selectCells.row; r < selectCells.rowCount + selectCells.row; r++) {
              for (var c = selectCells.col; c < selectCells.colCount + selectCells.col; c++) {
                var style = self.worksheet.getActualStyle(r, c);
                style.formatter = scientificNotationCheckingFormatter;
                self.worksheet.setStyle(r, c, style);
              }
            }
          }
        }
      },

      getSubStrings(source, beginChar, endChar) {
        if (!source) {
          return [];
        }

        var subStrings = [], tempSubString = '', inSubString = false;
        for (var index = 0; index < source.length; index++) {
          if (!inSubString && source[index] === beginChar) {
            inSubString = true;
            tempSubString = source[index];
            continue;
          }
          if (inSubString) {
            tempSubString += source[index];
            if (source[index] === endChar) {
              subStrings.push(tempSubString);
              tempSubString = "";
              inSubString = false;
            }
          }
        }
        return subStrings;
      },

      getScientificNotationCheckingFormattter(formatter) {
        if (!formatter) {
          return formatter;
        }

        var self = this, i;
        var signalQuoteSubStrings = self.getSubStrings(formatter, '\'', '\'');
        for (i = 0; i < signalQuoteSubStrings.length; i++) {
          formatter = formatter.replace(signalQuoteSubStrings[i], '');
        }
        var doubleQuoteSubStrings = self.getSubStrings(formatter, '\"', '\"');
        for (i = 0; i < doubleQuoteSubStrings.length; i++) {
          formatter = formatter.replace(doubleQuoteSubStrings[i], '');
        }
        var colorStrings = this.getSubStrings(formatter, '[', ']');
        for (i = 0; i < colorStrings.length; i++) {
          formatter = formatter.replace(colorStrings[i], '');
        }
        return formatter;
      },

      /**
       * method decrease decimal.
       */
      decreaseDecimal() {
        var self = this, decimalPoint;
        var _selections = this.getSelections();
        for (var p = 0; p < _selections.length; p++) {
          var selectCells = _selections[p];
          var defaultActiveCell = self.worksheet.getCell(selectCells.row, selectCells.col);
          var defaultFormatter = defaultActiveCell.formatter();
          var defaultText = defaultActiveCell.value();
          decimalPoint = ".";
          var i;
          if (defaultText !== undefined && defaultText !== null) {
            var formatString = null;
            if (!defaultFormatter || defaultFormatter === "General") {
              if (!isNaN(defaultText)) {
                var result = defaultText.split('.');
                if (result.length === 2) {
                  result[0] = "0";
                  var isScience = false;
                  var sb = "";
                  for (i = 0; i < result[1].length - 1; i++) {
                    if ((i + 1 < result[1].length) && (result[1].charAt(i + 1) === 'e' || result[1].charAt(i + 1) === 'E')) {
                      isScience = true;
                      break;
                    }
                    sb = sb + ('0');
                  }

                  if (isScience) {
                    sb = sb + ("E+00");
                  }
                  result[1] = sb.toString();
                  formatString = result[0] + (result[1] !== "" ? decimalPoint + result[1] : "");
                }
              }
            } else {
              formatString = defaultFormatter;
              var formatters = formatString.split(';');
              for (i = 0; i < formatters.length && i < 2; i++) {
                if (formatters[i] && formatters[i].indexOf("/") < 0 && formatters[i].indexOf(":") < 0 && formatters[i].indexOf("?") < 0) {
                  var indexOfDecimalPoint = formatters[i].lastIndexOf(decimalPoint);
                  if (indexOfDecimalPoint !== -1 && indexOfDecimalPoint + 1 < formatters[i].length) {
                    formatters[i] = formatters[i].slice(0, indexOfDecimalPoint + 1) + formatters[i].slice(indexOfDecimalPoint + 2);
                    var tempString = indexOfDecimalPoint + 1 < formatters[i].length ? formatters[i].substr(indexOfDecimalPoint + 1, 1) : "";
                    if (tempString === "" || tempString !== "0") {
                      formatters[i] = formatters[i].slice(0, indexOfDecimalPoint) + formatters[i].slice(indexOfDecimalPoint + 1);
                    }
                  } else {
                    //do nothing.
                  }
                }
              }
              formatString = formatters.join(";");
            }
            for (var r = selectCells.row; r < selectCells.rowCount + selectCells.row; r++) {
              for (var c = selectCells.col; c < selectCells.colCount + selectCells.col; c++) {
                var style = self.worksheet.getActualStyle(r, c);
                style.formatter = formatString;
                self.worksheet.setStyle(r, c, style);
              }
            }
          }
        }
      },

      /**
       * method lock & unlock.
       * @param {Boolean} isLock Lock or unlock.
       */
      lock(isLock) {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount).locked(isLock);
        }
        sheet.resumePaint();

        this.cellStyle.isLocked = isLock;
      },

      /**
       * method frozen cell.
       */
      frozen(value) {
        switch (value) {
          case 'frozenCell':
            this.worksheet.suspendPaint();

            this.worksheet.frozenRowCount(this.clickCell.row);
            this.worksheet.frozenColumnCount(this.clickCell.col);
            this.worksheet.options.frozenlineColor = 'red';

            this.worksheet.resumePaint();
            break;
          case 'removeFrozenCell':
            this.worksheet.suspendPaint();

            this.worksheet.frozenRowCount(0);
            this.worksheet.frozenColumnCount(0);

            this.worksheet.resumePaint();
            break;
          default:
            break;
        }
      },

      cellColorFunc(e) {
        this.visibleCellColorPicker = !this.visibleCellColorPicker;
      },

      cellColorBgFunc(e) {
        this.visibleCellBgColorPicker = !this.visibleCellBgColorPicker;
      },

      /**
       * method set cell font color.
       * @param {String} value Color value.
       */
      setFontColor(value) {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          range.foreColor(value);
        }
        sheet.resumePaint();
        this.cellStyle.cellColor = value;
        this.visibleCellColorPicker = false;
      },

      /**
       * method set cell background color.
       * @param {String} value Color value.
       */
      setBgColor(value) {
        const sheet = this.worksheet;
        const sel = sheet.getSelections();
        sheet.suspendPaint();
        if (sel.length > 0) {
          const range = sheet.getRange(sel[0].row, sel[0].col, sel[0].rowCount, sel[0].colCount);
          range.backColor(value);
        }
        sheet.resumePaint();
        this.cellStyle.cellColor = value;
        this.visibleCellBgColorPicker = false;
      },

      /**
       * method undo action.
       */
      undoCommand() {
        this.workbook.undoManager().undo();
      },

      /**
       * method redo action.
       */
      redoCommand() {
        this.workbook.undoManager().redo();
      },

      /**
       * method list validator.
       * @param {String} valueList The value that will be set, eg: 1,2,3.
       */
      setListValidator(valueList) {
        valueList = valueList.replace(/，/g, ',');
        const sheet = this.worksheet;
        const spreadNS = this.GC.Spread.Sheets;

        const gcdv = spreadNS.DataValidation;
        let ddv = null;
        ddv = gcdv.createListValidator(valueList);
        ddv.inCellDropdown(true);

        if (ddv != null) {
          ddv.errorMessage('数据有误!');
          ddv.errorStyle('0');
          ddv.showErrorMessage(true);
          ddv.ignoreBlank(true);
          ddv.showInputMessage(false);

          sheet.suspendPaint();
          const sels = sheet.getSelections();
          for (let i = 0; i < sels.length; i++) {
            const sel = sels[i];
            sheet.setDataValidator(sel.row, sel.col, sel.rowCount, sel.colCount, ddv);
          }

          sheet.resumePaint();
        }

        this.listOptions = '';
        this.listValidatorVisible = false;
      },

      setListValidatorVisible() {
        this.listValidatorVisible = !this.listValidatorVisible;
      },

      reflow() {
        const root = document.getElementById('ele-cloud-spreadjs-toolkit');
        const groupdoms = root.getElementsByClassName('toolkit-group');
        const group1 = groupdoms[0];
        const group2 = groupdoms[1];
        const group3 = groupdoms[2];
        const moreInner = document.getElementsByClassName('toolkit-more')[0];
        const moreWrapper = document.getElementsByClassName('toolkit-more_wrapper')[0];
        let bodyWidth = document.body.getBoundingClientRect().width;
        if (bodyWidth <= 1260 && bodyWidth >= 1060) {
          root.insertBefore(group1, moreWrapper);
          moreInner.appendChild(group2);
          moreInner.appendChild(group3);
        } else if (bodyWidth > 1260) {
          root.insertBefore(group2, moreWrapper);
          root.insertBefore(group1, group2);
          moreInner.appendChild(group3);
        } else if (bodyWidth < 1060){
          moreInner.appendChild(group1);
          moreInner.appendChild(group2);
          moreInner.appendChild(group3);
        }
      },
    },
    mounted() {
      this.syncSpread();
      this.bindEvent();
      Object.assign(this.cellStyle, this.getCellStyle());

      this.reflow();

      window.onresize = (() => {
        let canRun = true;
        return () => {
          if (!canRun) return;
          canRun = false;
          setTimeout(() => {
            this.reflow();
            canRun = true;
          }, 500);
        };
      })()
    },
    beforeDestroy() {

    },
    watch: {
      // visibleCellColorPicker: function (newVal) {
      //   this.$refs.cellColorPicker.$el.children[0].click()
      // },
      // visibleCellBgColorPicker: function (newVal) {
      //   this.$refs.cellBgColorPicker.$el.children[0].click()
      // },
    }
  }


