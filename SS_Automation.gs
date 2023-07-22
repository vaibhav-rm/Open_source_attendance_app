var ss = SpreadsheetApp.openById("1TAUSfR0Tu2UcE4nNZLnsNTaeAMNmm18ct9QrzOydQyA");
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
  var dailySheetId = sheet.getRange(2,2).getValue();
  var monthlySheetId = sheet.getRange(3,2).getValue();

  // Get the current date
  var now = new Date();

  // Check if the current date is the last day of the month
  if (now.getDate() == new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()) {
    // Get the daily sheet and the monthly sheet
    var dailySheet = SpreadsheetApp.openById(dailySheetId).getSheetByName("daily_attendance");
    var monthlySheet = SpreadsheetApp.openById(monthlySheetId).getSheetByName("Sheet1");

    // Get the range of data to copy from the daily sheet
    var dataRange = dailySheet.getDataRange();

    // Get the values in the range
    var data = dataRange.getValues();

    // Get the last row in the monthly sheet
    var lastRow = monthlySheet.getLastRow();

    // Set the values in the monthly sheet equal to the values in the daily sheet
    monthlySheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);

    // Delete the columns after the second column in the daily sheet
    dailySheet.deleteColumns(3, dailySheet.getLastColumn() - 2);
  }
}

function updateAttendance(registerNumber, date, classID) {
  // Get the sheet where attendance is stored
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Attendance');

  // Find the row corresponding to the given register number
  var rows = sheet.getDataRange().getValues();
  var row = -1;
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] == registerNumber) {
      row = i;
      break;
    }
  }

  if (row == -1) {
    // Register number not found
    return 'Register number not found';
  }

  // Find the column corresponding to the given date
  var columns = sheet.getDataRange().getValues()[0];
  var column = columns.indexOf(date);
  if (column == -1) {
    // Date not found
    return 'Date not found';
  }

  // Get the class schedule for the given date
  var dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  var classSchedule = getClassSchedule(dayOfWeek);

  // Check if the student attended the class and update the cell accordingly
  if (classSchedule[classID] != undefined) {
    sheet.getRange(row, column + 1 + classID).setValue('P');
  }

  // Update the cell for the student's overall attendance for the given date
  var totalAttendanceColumn = columns.indexOf("Total Attendance");
  sheet.getRange(row, totalAttendanceColumn).setValue(calculateTotalAttendance(row, columns));

  return 'Attendance updated';
}

function getClassSchedule(dayOfWeek) {
  // Define the weekly schedule
  var weeklySchedule = {
    'Monday': {
      1: 'Class A',
      3: 'Class B'
    },
    'Tuesday': {
      2: 'Class C',
      4: 'Class D'
    },
    'Wednesday': {
      1: 'Class A',
      2: 'Class C',
      3: 'Class B'
    },
    'Thursday': {
      2: 'Class D',
      4: 'Class C'
    },
    'Friday': {
      1: 'Class B',
      3: 'Class A'
    },
    'Saturday': {
      // Leave empty for days without classes
    },
    'Sunday': {
      // Leave empty for days without classes
    }
  };

  // Use the weekly schedule to fetch the schedule for the given day
  var schedule = weeklySchedule[dayOfWeek];

  return schedule;
}










