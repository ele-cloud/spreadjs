import { GC, workbook } from './init';

var bind = false;
let worksheet = null;
const clickCell = {};

/**
 * method update spread current status.
 */
function syncSpread() {
  worksheet = workbook.getActiveSheet();
  clickCell.row = worksheet.getActiveRowIndex();
  clickCell.col = worksheet.getActiveColumnIndex();
}

/**
 * method cell changed event and recall comment func.
 */
function bindCellChanged() {
  workbook.bind(GC.Spread.Sheets.Events.CellClick, (e, args) => {
    comment();
  });

  workbook.bind(GC.Spread.Sheets.Events.ActiveSheetChanged, (e, args) => {
    comment();
  });

  // 由于存在代码主动切换sheet页的情况，而ActiveSheetChanged不会触发，所以我们只能通过轮循来同步
  // 存在bug：待处理
  // setInterval(() => {
  //   comment();
  // }, 500);
}

/**
 * method 插入批注.
 */
function insertCommentRightKey() {
  const commandManager = workbook.commandManager();
  const insertComment = {
    command: 'insertComment',
    iconClass: 'gc-spread-insertComment',
    name: 'insertComment',
    text: '插入批注',
    workArea: 'viewportcorner',
  };
  workbook.contextMenu.menuData.push(insertComment);
  const insertCommentCommand = {
    canUndo: false,
    execute: (spread, options) => {
      const sheet = spread.getActiveSheet();
      sheet.suspendPaint();

      sheet.options.isProtected = false;
      const comments = sheet.comments.add(clickCell.row, clickCell.col, '');
      comments.displayMode(GC.Spread.Sheets.Comments.DisplayMode.alwaysShown);

      // update comment status
      comment(false);

      sheet.resumePaint();
    },
  };
  commandManager.register('insertComment', insertCommentCommand, null, false, false, false, false);
}

/**
 * method 编辑批注.
 */
function editCommentRightKey() {
  const commandManager = workbook.commandManager();
  const editComment = {
    command: 'editComment',
    iconClass: 'gc-spread-editComment',
    name: 'editComment',
    text: '编辑批注',
    workArea: 'viewportcorner',
  };
  workbook.contextMenu.menuData.push(editComment);
  const editCommentCommand = {
    canUndo: false,
    execute: (spread, options) => {
      const sheet = spread.getActiveSheet();
      sheet.suspendPaint();

      sheet.options.isProtected = false;
      const comments = sheet.comments.get(clickCell.row, clickCell.col);
      comments.displayMode(GC.Spread.Sheets.Comments.DisplayMode.alwaysShown);

      sheet.resumePaint();
    },
  };
  commandManager.register('editComment', editCommentCommand, null, false, false, false, false);
}

/**
 * method 删除批注.
 */
function deleteCommentRightKey() {
  const commandManager = workbook.commandManager();
  const deleteComment = {
    command: 'deleteComment',
    iconClass: 'gc-spread-deleteComment',
    name: 'deleteComment',
    text: '删除批注',
    workArea: 'viewportcorner',
  };
  workbook.contextMenu.menuData.push(deleteComment);
  const deleteCommentCommand = {
    canUndo: false,
    execute: (spread, options) => {
      const sheet = spread.getActiveSheet();
      sheet.suspendPaint();

      sheet.comments.remove(clickCell.row, clickCell.col);

      // update comment status
      comment();

      sheet.resumePaint();
    },
  };
  commandManager.register('deleteComment', deleteCommentCommand, null, false, false, false, false);
}

/**
 * method 批注状态管理.
 * @param {Boolean} clearDisplay hide comments .
 */
export default function comment(clearDisplay = true) {
  syncSpread();

  if (!bind) {
    bindCellChanged();
    bind = true;
  }

  if (clearDisplay) {
    worksheet.options.isProtected = true;
    const comments = worksheet.comments.all();
    comments.forEach(cm => {
      cm.displayMode(GC.Spread.Sheets.Comments.DisplayMode.hoverShown);
    });
  }

  const comments = worksheet.comments.get(clickCell.row, clickCell.col);
  if (comments) {
    for (let i = workbook.contextMenu.menuData.length; i >= 0; i--) {
      const item = workbook.contextMenu.menuData[i];
      // delete 插入批注
      if (item && item.name === 'insertComment') {
        workbook.contextMenu.menuData.splice(i, 1);
      }
    }

    if (!workbook.contextMenu.menuData.some(item => item.name === 'editComment'
      || item.name === 'deleteComment')) {
      editCommentRightKey();
      deleteCommentRightKey();
    }
  } else {
    if (!workbook.contextMenu.menuData.some(item => item.name === 'insertComment')) {
      insertCommentRightKey();
    }

    for (let i = workbook.contextMenu.menuData.length; i >= 0; i--) {
      const item = workbook.contextMenu.menuData[i];
      // delete 编辑批注、删除批注
      if (item && (item.name === 'editComment' || item.name === 'deleteComment')) {
        workbook.contextMenu.menuData.splice(i, 1);
      }
    }
  }
}
