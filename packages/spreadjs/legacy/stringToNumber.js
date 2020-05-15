export default function handleJsonStringToNumber(json) {
  let data = null;
  for (const sheet in json.sheets) {
    if (json.sheets.hasOwnProperty(sheet)) {
      data = json.sheets[sheet];
      const rowCount = data.rowCount || 200;
      const columnCount = data.columnCount || 20;
      const datatable = data.data.dataTable;
      for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < columnCount; col++) {
          if (datatable[row][col] && datatable[row][col].hasOwnProperty('value')) {
            if (!isNaN(datatable[row][col].value)) {
              datatable[row][col].value = Number(datatable[row][col].value);
            }
          }
        }
      }
    }
  }
  return json;
}
