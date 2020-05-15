// for toolkit
export const formatterOptions = [
  {
    label: '常规',
    value: 'normal',
  },
  {
    label: '数值',
    value: '0.00',
  },
  {
    label: '货币',
    value: '$#,##0.00',
  },
  {
    label: '会计专用',
    value: '$ #,##0.00;$ (#,##0.00);$ "-"??;@',
  },
  {
    label: '短日期',
    value: '[$]m/d/yyyy',
  },
  {
    label: '长日期',
    value: '[$-x-systime]h:mm:ss AM/PM',
  },
  {
    label: '时间',
    value: 'h:mm:ss AM/PM',
  },
  {
    label: '百分比',
    value: '0.00%',
  },
  {
    label: '分数',
    value: '# ?/?',
  },
  {
    label: '科学计数',
    value: '0.00E+00',
  },
  {
    label: '文本',
    value: '@',
  },
];
export const fontOptions = [
  {
    label: '华文宋体',
    value: 'STSong',
  },
  {
    label: '华文黑体',
    value: 'STHeiti',
  },
  {
    label: '华文仿宋',
    value: 'STFangsong',
  },
  {
    label: '华文楷体',
    value: 'STKaiti',
  },
  {
    label: 'Arial',
    value: 'Arial',
  }
];
export const fontsizeOptions = [
  {
    label: '10',
    value: '10px',
  },
  {
    label: '11',
    value: '11px',
  },
  {
    label: '12',
    value: '12px',
  },
  {
    label: '13',
    value: '13px',
  },
  {
    label: '14',
    value: '14px',
  },
  {
    label: '15',
    value: '15px',
  },
  {
    label: '16',
    value: '16px',
  },
  {
    label: '17',
    value: '17px',
  },
  {
    label: '18',
    value: '18px',
  },
  {
    label: '19',
    value: '19px',
  },
  {
    label: '20',
    value: '20px',
  },
  {
    label: '21',
    value: '21px',
  },
  {
    label: '22',
    value: '22px',
  },
  {
    label: '23',
    value: '23px',
  },
  {
    label: '24',
    value: '24px',
  },
  {
    label: '25',
    value: '25px',
  },
  {
    label: '26',
    value: '26px',
  },
  {
    label: '27',
    value: '27px',
  },
  {
    label: '28',
    value: '28px',
  },
  {
    label: '29',
    value: '29px',
  },
  {
    label: '30',
    value: '30px',
  },
];
export const numberFormats = [
  '0',
  '0;[Red]0',
  '0_);(0)',
  '0_);[Red](0)',
  '#,##0',
  '#,##0;[Red]#,##0',
  '#,##0_);(#,##0)',
  '#,##0_);[Red](#,##0)'
];
export const currencyFormats = [
  "#,##0",
  "#,##0;[Red]#,##0",
  "#,##0;-#,##0",
  "#,##0;[Red]-#,##0"
];

export const accountingFormats = [
  "_(* #,##0_);_(* (#,##0);_(* \"-\"_);_(@_)",
  '_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)',
  ' $* #,##0.00 ; $* #,##0.00 ; $* "-" ; @ ',
  '_-[$¥-804]* #,##0.00_-;-[$¥-804]* #,##0.00_-;_-[$¥-804]* "-"_-;_-@_-',
  '_-[$¥-411]* #,##0.00_-;-[$¥-411]* #,##0.00_-;_-[$¥-411]* "-"_-;_-@_-',
  '_-[$₩-412]* #,##0.00_-;-[$₩-412]* #,##0.00_-;_-[$₩-412]* "-"_-;_-@_-'
];

export const dateFormats = [
  "m/d/yyyy",
  "[$-409]dddd, mmmm dd, yyyy",
  "m/d;@",
  "m/d/yy;@",
  "mm/dd/yy;@",
  "[$-409]d-mmm;@",
  "[$-409]d-mmm-yy;@",
  "[$-409]dd-mmm-yy;@",
  "[$-409]mmm-yy;@",
  "[$-409]mmmm-yy;@",
  "[$-409]mmmm d, yyyy;@",
  "[$-409]m/d/yy h:mm AM/PM;@",
  "m/d/yy h:mm;@",
  "[$-409]mmmmm;@",
  "[$-409]mmmmm-yy;@",
  "m/d/yyyy;@",
  "[$-409]d-mmm-yyyy;@",//
  "yyyy-mm-dd;@",
  '[DBNum1][$-804]yyyy"年"m"月"d"日";@',
  '[DBNum1][$-804]yyyy"年"m"月";@',
  '[DBNum1][$-804]m"月"d"日";@',
  "[$-409]yyyy/m/d h:mm AM/PM;@",
  'yyyy"年"m"月"d"日";@',
  'yyyy"年"m"月";@',
  'm"月"d"日";@',
  "yyyy/m/d h:mm AM/PM;@",
  "yyyy/m/d h:mm;@",
  "[$-409]m",
  "[$-409]m-d;@"
];

export const timeFormats = [
  "[$-409]h:mm:ss AM/PM",
  "h:mm;@",
  "[$-409]h:mm AM/PM;@",
  "h:mm:ss;@",
  "[$-409]h:mm:ss AM/PM;@",
  "mm:ss.0;@",
  "[h]:mm:ss;@",
  "[$-409]m/d/yy h:mm AM/PM;@",
  "m/d/yy h:mm;@", //
  'h"时"mm"分";@',
  'h"时"mm"分"ss"秒";@',
  '[$-804]AM/PM h"时"mm"分";;@',
  '[$-804]AM/PM h"时"mm"分"ss"秒";@',
  '[DBNum1][$-804]h"时"mm"分";@',
  '[DBNum1][$-804]AM/PM h"时"mm"分";@'
];

export const percentageFormats = [
  "0%"
];

export const fractionFormats = [
  "# ?/?",
  "# ??/??",
  "# ???/???",
  "# ?/2",
  "# ?/4",
  "# ?/8",
  "# ??/16",
  "# ?/10",
  "# ??/100"
];

export const scientificFormats = [
  "0E+00"
];

export const specialFormats = [
  "000000",
  "[DBNum1][$-804]General",
  "[DBNum2][$-804]General"
];

