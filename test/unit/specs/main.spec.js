import { createElm, rightClick, createTest, createVue, destroyVM } from '../util';
import initSpread  from 'main/index.js';

describe('Entry File', () => {
  let workbook;
  const exceldom = createElm();
  
  it('create workbook', (done) => {
    workbook = initSpread(exceldom, {});
    expect(Boolean(workbook)).to.be.true;
    done();
  });
});


