import {numberFormats,timeFormats,dateFormats,specialFormats} from './options';

export function whichFormatBelong(format) {
  if (specialFormats.includes(format)) {
    return 10;
  } else if (format === '@') {
    return 9;
  } else if (format.includes('0E+00')) {
    return 8;
  } else if (format.includes('# ?')) {
    return 7;
  } else if (format.includes('%')) {
    return 6;
  } else if (timeFormats.includes(format)) {
    return 5;
  } else if (dateFormats.includes(format)) {
    return 4
  } else if (format.includes('@') && format.includes('-')) {
    return 3;
  } else if (format.includes('$#,##0') || format.includes('$¥')) {
    return 2;
  } else if(numberFormats.includes(format)) {
    return 1;
  }
  else {
    return 0;
  }
}
