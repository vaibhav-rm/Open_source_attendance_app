var ss = SpreadsheetApp.openById("Sheet_where_ss_data_is_Stored");
var sheet = ss.getSheetByName("Sheet1");


function createMontlySheet(){
  
  var cur_month = Utilities.formatDate(new Date(),"IST", "MMMM YYYY");
  
  var new_monthly_sheet = SpreadsheetApp.create("Attendance Sheet "+cur_month);
  
  var sheet_file = DriveApp.getFileById(new_monthly_sheet.getId());
  
  var cur_folder = DriveApp.getFolderById("1i-Ax4oEZyNzysPXrdc0NZlzMKg2dV3hY");
  
  cur_folder.addFile(sheet_file);
  
  sheet.getRange(3,2).setValue(new_monthly_sheet.getId());
  
}

function insertDateColumn() {
  // Get the current date
  var now = new Date();

  var dss = SpreadsheetApp.openById(sheet.getRange(2,2).getValue());

  // Get the active sheet in the current spreadsheet
  var dsss = dss.getSheetByName("daily_attendance");

  // Calculate the number of days in the current month
  var numDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  // Insert a new column after the second column and set the header to the first day of the month
  dsss.insertColumnAfter(2);
  var newColumn = dsss.getRange(1, 3);
  newColumn.setValue(new Date(now.getFullYear(), now.getMonth(), 1).toDateString());

for (var i = numDays; i > 1; i--) {
  var nextDate = new Date(now.getFullYear(), now.getMonth(), i);
  dsss.insertColumnAfter(3);
  newColumn = dsss.getRange(1, 4);
  newColumn.setValue(nextDate.toDateString());
}
}

function copyToMonthly() {
  // Set the ID of the daily sheet and the monthly sheet
  var dailySheetId = SpreadsheetApp.openById(sheet.getRange(2,2).getValue());
  var monthlySheetId = SpreadsheetApp.openById(sheet.getRange(3,2).getValue());

  // Get the current date
  var now = new Date();

  // Check if the current date is the last day of the month
  if (now.getDate() == new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()) {
    // Get the daily sheet and the monthly sheet
    var dailySheet = SpreadsheetApp.openById(dailySheetId).getSheetByName("daily_attendance");
    var monthlySheet = SpreadsheetApp.openById(monthlySheetId).getSheetByName("Sheet1");

    // Get the range of data to copy from the daily sheet
    var dataRange = dailySheet.getRange(1, 1, dailySheet.getLastRow(), dailySheet.getLastColumn());

    // Get the last row in the monthly sheet
    var lastRow = monthlySheet.getLastRow();

    // Copy the data from the daily sheet and paste it into the monthly sheet
    dataRange.copyTo(monthlySheet.getRange(lastRow + 1, 1), {contentsOnly: true});

     // Delete the columns after the second column in the daily sheet
    dailySheet.deleteColumns(3, dailySheet.getLastColumn() - 2);
  }
}