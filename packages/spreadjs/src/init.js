import GC from '@grapecity/spread-sheets';
import Excel from '@grapecity/spread-excelio';
import ZH from '@grapecity/spread-sheets-resources-zh';
import '@grapecity/spread-sheets-print';
import $ from 'jquery';
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import '../style/cssprogress.css';
import context from '../context';
import comment from './comment';
import toolkit from '../toolkit';
import excel from './excel';
import calc from './calc';

let workbook = null;
let exceldom = null;
let processNode = null;
const sheetCache = [];

/**
 * method sheet changed event and recalc formula.
 */
function bindSheetChanged() {
  // workbook.bind(GC.Spread.Sheets.Events.ActiveSheetChanged, (e, args) => {
  //   if (!sheetCache.includes(args.newSheet.name())) {
  //     sheetCache.push(args.newSheet.name());
  //     calcCurrentSheetFormula();
  //   }
  // });

  // 由于存在代码主动切换sheet页的情况，而ActiveSheetChanged不会触发，所以我们只能通过轮循来同步
  setInterval(() => {
    const currentSheetName = workbook.getActiveSheet().name();
    if (!sheetCache.includes(currentSheetName)) {
      sheetCache.push(currentSheetName);
      calcCurrentSheetFormula();
    }
  }, 500);
}

/**
 * method calculate current sheet formula.
 */
function calcCurrentSheetFormula() {
  if (!$(processNode).parents(exceldom).length > 0) {
    $(exceldom).prepend(processNode);
  }

  setTimeout(() => {
    const worksheet = workbook.getActiveSheet();
    worksheet.recalcRange(0, 0, worksheet.getRowCount(), worksheet.getColumnCount());
    // worksheet.recalcAll();
    $(processNode).remove();
  }, 500);
}

/**
 * method recalc all sheets formula.
 */
function recalcAllFormula() {
  $(exceldom).prepend(processNode);
  setTimeout(() => {
    const worksheet = workbook.getActiveSheet();
    worksheet.recalcAll();
    $(processNode).remove();
  });
}

/**
 * method initialize the excel.
 * @param {Object} dom The dom that excel will be rendered.
 * @param {JSON} json Spread json.
 * @param {JSON} options Apply feature.
 * @return {Object} return Spread workbook object.
 */
function initSpread(dom, json = {}, options = {}) {
  exceldom = dom || exceldom;
  GC.Spread.Common.CultureManager.culture('zh-cn');
  workbook = new GC.Spread.Sheets.Workbook(dom);
  json.activeSheetIndex = 0;
  workbook.fromJSON(json, { doNotRecalculateAfterLoad: true });
  processNode = $(`
    <div class="cssProgress">
      <div class="progress1">
        <div class="cssProgress-bar cssProgress-active" data-percent="100" style="width: 100%;">
          <span class="cssProgress-label" style="color: white">公式计算中，请稍后...</span>
        </div>
      </div>
    </div>
    `);

  // 滚动条是否对齐视图中表单的最后一行或一列
  workbook.options.scrollbarMaxAlign = true;

  // 重新计算公式
  // workbook.options.calcOnDemand = true;

  // feature
  if (options.async) {
    bindSheetChanged();
  } else {
    recalcAllFormula();
  }

  if (options.context) {
    context();
  }

  if (options.comment) {
    comment();
  }

  if (options.toolkit) {
    toolkit(options.toolkit);
  }

  return workbook;
}

export { GC, Excel, excel, workbook };

export default initSpread;
