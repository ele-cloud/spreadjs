import GC from '@grapecity/spread-sheets';
import Excel from '@grapecity/spread-excelio';
import pako from 'pako';
import FaverSaver from 'file-saver';
import addWorkBookTag from '../legacy/tagId';

const excelIo = new Excel.IO();

/**
 * base64 to blob.
 * @param {String} b64data.
 * @return {Object} return Blob object.
 */
function base64ToBlob (b64data, contentType, sliceSize) {
  sliceSize || (sliceSize = 512);
  return new Promise((resolve, reject) => {
    // 使用 atob() 方法将数据解码
    const byteCharacters = atob(b64data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = [];
      for (let i = 0; i < slice.length; i++) {
        byteNumbers.push(slice.charCodeAt(i));
      }
      // 8 位无符号整数值的类型化数组。内容将初始化为 0。
      // 如果无法分配请求数目的字节，则将引发异常。
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    resolve(new Blob(byteArrays, {
      type: contentType,
    }));
  });
}

/**
 * method fill filename suffix.
 * @param {String} target Target string.
 * @param {String} suffix.
 * @return {String} return Filled string.
 */
function fillSuffix (target, suffix) {
  if (!target.includes(suffix)) {
    return target + '.' + suffix
  } else {
    return target
  }
}

/**
 * method export.
 * @param {Object} data 数据源 josn.
 * @param {Object} options 选项.
 * @return {String} return Promise.
 */
function exportFunc (data, options = { filename: '未命名文件.xlsx', pako: false }) {
  return new Promise((resolve, reject) => {
    function download (json, fileName) {
      fileName = fillSuffix(fileName, 'xlsx');
      excelIo.save(json, (blob) => {
        // 使用 npm faie-server 替代原生写法
        FaverSaver.saveAs(blob, fileName);
        // // for IE
        // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //   window.navigator.msSaveOrOpenBlob(blob, fileName);
        // }
        // // for Non-IE (chrome, firefox etc.)
        // else {
        //   const a = document.createElement('a');
        //   a.download = `${fileName}`;
        //   const url = window.URL.createObjectURL(blob);
        //   a.href = url;
        //   document.body.appendChild(a);
        //   a.click();
        //   window.URL.revokeObjectURL(url);
        //   a.remove();
        // }
        resolve(fileName);
      }, (e) => {
        // process error
        reject(e);
      });
    }
    
    if (options.pako) {
      const reader = new FileReader();
      reader.onload = e => {
        data = JSON.parse(pako.inflate(e.target.result, { to: 'string' }));
        download(data, options.filename || data.workbookName || '未命名文件.xlsx');
      };
      base64ToBlob(data).then(blob => {
        reader.readAsArrayBuffer(blob);
      });
    } else {
      download(data, options.filename || data.workbookName || '未命名文件.xlsx');
    }
  });
}

/**
 * method import.
 * @param {String} type 需要的文件类型.
 * @param {Object} options 选项.
 * @return {String} return Promise.
 */
function importFunc (type, options = { tagId: false, pako: false }) {
  return new Promise((resolve, reject) => {
    function uploadFile (event) {
      const file = event.target.files[0];
      if (file && validFile(file)) {
        // 获取文件后缀
        const fileType = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
        if (fileType === 'xlsx') {
          excelIo.open(file, (json) => {
            if (options.tagId) {
              const dom = document.createElement('div');
              const workbook = new GC.Spread.Sheets.Workbook(dom);
              workbook.fromJSON(json);
              json = addWorkBookTag(workbook);
            }
            
            if (options.pako) {
              resolve({ json: btoa(pako.gzip(JSON.stringify(json), { to: 'string' })), filename: file.name });
            } else {
              resolve({ json, filename: file.name });
            }
          }, (e) => {
            reject(e);
          });
        } else {
          var reader = new FileReader();
          reader.onload = (e) => {
            var json = e.target.result;
            resolve({ json: btoa(pako.gzip(json, { to: 'string' })), filename: file.name });
          }
          reader.readAsText(file);
        }
      } else {
        reject(`请上传类型为${type}的文件`);
      }
    }
    
    function validFile (file) {
      const fileName = file.name;
      const fileType = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
      const typeList = type;
      return typeList.indexOf(fileType) >= 0;
    }
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    fileInput.click();
    const userAgent = window.navigator.userAgent;
    const isIE = userAgent.indexOf('Trident/7.0') > -1; // 判断是否IE浏览器
    const isEdge = userAgent.indexOf('Edge') > -1; // 判断是否IE的Edge浏览器
    if (fileInput.addEventListener) {
      if (isIE || isEdge) {
        fileInput.addEventListener('input', (event) => {
          uploadFile(event);
          document.body.removeChild(fileInput);
        });
      } else {
        fileInput.addEventListener('change', (event) => {
          uploadFile(event);
          document.body.removeChild(fileInput);
        });
      }
    } else if (fileInput.attachEvent) {
      fileInput.attachEvent('oninput', (event) => {
        uploadFile(event);
        document.body.removeChild(fileInput);
      });
    }
  });
}

export default {
  exportFunc, importFunc,
};
