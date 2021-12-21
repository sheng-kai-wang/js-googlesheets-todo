// const spreadsheetId = '1DXopJjSb5Ig8VEhITJoI87x2YRNZQWvm9X6OADGGOLQ';
let spreadsheet;
let sheet;

// initial by Active
function initial() {
  spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  sheet = spreadsheet.getSheets()[0]; // 要第幾個sheet？ 0 就是第一個
}

// initial by Static (need add Service)
// function initial () {
//   spreadsheet = SpreadsheetApp.openById(spreadsheetId);
//   sheet = spreadsheet.getSheets()[0]; // 要第幾個sheet？ 0 就是第一個
// }

// GET 方法 （read）
function doGet() {
  // 先初始化取得 spreadsheet 與 sheet
  initial();

  // 讀取的資料
  let data = sheet.getDataRange().getValues();
  let dataExportFormat = JSON.stringify(data);
  return ContentService.createTextOutput(dataExportFormat).setMimeType(
    ContentService.MimeType.JSON
  );
}

// POST 方法 (create, update, delete)
function doPost(e) {
  initial();

  if (e.parameter.method == "DELETE") {
    doDelete(e);
  }

  if (e.parameter["method"] == "UPDATE") {
    doUpdate(e);
    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // 先 lock 起來，避免多人同時操作 API
  let lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // 取得表格標題陣列
    let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // 取得最後一個 row 的下一個 row，也就是要新增資料的 row
    let nextRow = sheet.getLastRow() + 1;

    // 用 arrow function 把輸入的資料與表格的標題 map 起來
    let newRow = headers.map((header) => e.parameter[header]);

    // 寫入資料
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", row: nextRow })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: e })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    // 解開 lock
    lock.releaseLock();
  }
}

// update
function doUpdate(e) {
  let lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    let updateRow = e.parameter["updateRow"];

    let newRow = headers.map(function (header) {
      return e.parameter[header];
    });

    sheet.getRange(updateRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", row: newRow })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: e })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
