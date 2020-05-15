/**
 * method create worker.
 * @param {Function} f The function that will be exec in worker.
 * @return {Object} return Worker.
 */
function createWorker(f) {
  const blob = new Blob([`(${f.toString()})()`]);
  const url = window.URL.createObjectURL(blob);
  const worker = new Worker(url);
  return worker;
}

/**
 * method calculate workbook formula.
 * @param {Object} wb Workbook.
 * @return {Object} return Worker.
 */
export default function (wb) {
  const calcWorker = createWorker(() => {
    self.onmessage = function(e) {
      const workbook = e.data;
      workbook.getActiveSheet().recalcAll();
      self.postMessage('done');
    };
  });

  calcWorker.postMessage(wb);

  return calcWorker;
}
