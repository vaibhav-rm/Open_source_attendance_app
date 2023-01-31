var ss = SpreadsheetApp.openByUrl("dailySheet");
var sheet = ss.getSheetByName("daily_attendance");

function doGet(e){
  var action  = e.parameter.action;

  if(action == "in")
    return inTime(e);

  if(action == "out")
    return outTime(e);

}


function doPost(e){
  var action  = e.parameter.action;

  if(action == "in")
    return inTime(e);

  if(action == "out")
    return outTime(e);

}

function inTime(e) {
  // Get the ID of the user from the request parameters
  var id = e.parameter.id;

  // Get all the values in the first column of the sheet
  var values = sheet.getRange(2, 1, sheet.getLastRow(), 1).getValues();

  // Find the row that contains the provided ID
  var rowIndex = values.findIndex(function(row) {
    return row[0] == id;
  });

  // Check if the ID was found
  if (rowIndex > -1) {
    // Get the current date
    var currentDate = new Date();

    // Get the values in the first row of the sheet (i.e. the headers)
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Find the index of the column whose header matches the current date
    var columnIndex = headers.findIndex(function(header) {
      return new Date(header).toDateString() == currentDate.toDateString();
    });
