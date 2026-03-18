// Google Apps Script - API for Fitness App
// Paste this in: Google Sheet > Extensions > Apps Script

const SHEET_NAME = 'Sheet1';

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  return ContentService
    .createTextOutput(JSON.stringify({ success: true, data: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const body = JSON.parse(e.postData.contents);

  if (body.action === 'add') {
    sheet.appendRow([
      body.date || new Date().toLocaleDateString('he-IL'),
      body.exercise,
      body.sets,
      body.reps,
      body.weight || '',
      body.notes || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Added' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'delete') {
    const rowIndex = body.rowIndex + 2; // +1 header, +1 zero-based
    if (rowIndex > 1 && rowIndex <= sheet.getLastRow()) {
      sheet.deleteRow(rowIndex);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Deleted' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ success: false, message: 'Unknown action' }))
    .setMimeType(ContentService.MimeType.JSON);
}
