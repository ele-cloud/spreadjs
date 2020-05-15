import random from './randomcode';

let workbook = null;
let worksheet = null;

/**
 * method 添加 tagid 主要函数.
 * @param {Object} data Worksheet json.
 * @param {Number} index Sheet index.
 */
function handleExcelJson(data, index) {
  if (!data.data.dataTable || data.name === 'Evaluation Version') {
    workbook.removeSheet(index);
    return;
  }
  const rowCount = data.rowCount || 200;
  const columnCount = data.columnCount || 20;
  const datatable = data.data.dataTable;
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < columnCount; col++) {
      if (datatable.hasOwnProperty(row)) { // 验证行
        if (datatable[row].hasOwnProperty(col)) { // 验证列
          if (!datatable[row][col].hasOwnProperty('tag')) { // 验证tag
            worksheet.setTag(row, col, {
              tagId: random(),
            });
          }
        } else {
          worksheet.setTag(row, col, {
            tagId: random(),
          });
        }
      } else {
        addRow(datatable, row, columnCount);
      }

      // 将formula单元格dataType设置为5 2018-07-25 14:31:50
      if (worksheet.getFormula(row, col)) {
        worksheet.setTag(row, col, {
          tagId: random(),
          dataType: '5',
        });
      }
    }
  }
}

/**
 * method 某些行在spreadjs中未存在于json，而此时我们需要主动加入此行.
 * @param {Object} datatable Worksheet datatable.
 * @param {Object} row Target row.
 * @param {Number} columnCount Columon count.
 */
function addRow(datatable, row, columnCount) {
  for (let col = 0; col < columnCount; col++) {
    // worksheet.setValue(row, col, '');
    worksheet.setTag(row, col, {
      tagId: random(),
    });
  }
}

/**
 * method 为【下拉框类型】单元格 tag 的 dataType 设置为 4,.
 * @param {Object} json Worksheet json.
 */
function addSelectCellTag(json) {
  if (json.hasOwnProperty('validations')) {
    json.validations.forEach(arr => {
      for (const i in arr.condition) {
        if (i === 'ranges') {
          arr.condition[i].forEach(range => {
            for (let row = range.row; row < (range.row + range.rowCount); row++) {
              for (let col = range.col; col < (range.col + range.colCount); col++) {
                const tag = worksheet.getTag(row, col) || { tagId: random() };
                tag.dataType = '4';
                worksheet.setTag(row, col, tag);
              }
            }
          });
        }
      }
    });
  }
}

/**
 * method worksheet 添加 tagid.
 */
function addSheetTagId() {
  const workbookData = workbook.toJSON();
  for (const key in workbookData.sheets) {
    if (workbookData.sheets.hasOwnProperty(key)) {
      workbookData.sheets[key].tag = {
        tagId: random(),
      };
      // theme 统一成"Office"
      workbookData.sheets[key].theme = 'Office';
    }
  }
  if (!workbookData.sheetCount) {
    workbookData.sheetCount = workbook.getSheetCount();
  }
  return workbookData;
}

/**
 * method 为 workbook 添加 tagid 入口函数.
 * @param {Object} wb.
 * @return {Object} return 处理后的 workbook json.
 */
export default function addWorkBookTag(wb) {
  workbook = wb;
  for (let index = workbook.getSheetCount() - 1; index >= 0; index--) {
    worksheet = workbook.getSheet(index);

    // 对select单元格添加标识
    if (worksheet.toJSON().hasOwnProperty('validations')) {
      addSelectCellTag(worksheet);
    }

    handleExcelJson(worksheet.toJSON(), index);
  }

  return addSheetTagId();
}
