/* eslint-disable */
import {Excel, GC} from './init';

/**
 * @file spreadjs v12
 * @date 2019/12/30
 */

/**
 * method inject the spreadjs license key.
 * @param {String} key SpreadJs license key.
 */
function injectLicenseKey(key) {
  GC.Spread.Sheets.LicenseKey = key;
  Excel.LicenseKey = key;
}

export default injectLicenseKey;
