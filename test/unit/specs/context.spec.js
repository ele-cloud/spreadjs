import { createElm, rightClick, waitImmediate } from '../util';
import initSpread  from 'main/index.js';

describe('Tookit File', () => {
  let workbook;
  const exceldom = createElm();
  
  it('context loaded', () => {
    workbook = initSpread(exceldom, {}, {
      context: true,
    });
    rightClick(document.querySelector('canvas'));
    expect(document.querySelector('.gc-popup')).to.exist; // no use
  });
});


