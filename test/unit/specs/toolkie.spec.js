import { createElm, waitImmediate } from '../util';
import initSpread  from 'main/index.js';

describe('Tookit File', () => {
  let workbook;
  const exceldom = createElm();
  const toolkitdom = createElm();
  
  it('toolkit loaded', () => {
    workbook = initSpread(exceldom, {}, {
      toolkit: toolkitdom,
    });
    expect(document.querySelector('#ele-cloud-spreadjs-toolkit')).to.exist;
  });
});


