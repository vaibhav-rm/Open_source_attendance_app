var ss = SpreadsheetApp.openByUrl("dailySheet");
var sheet = ss.getSheetByName("daily_attendance");

function doGet(e){
  var action  = e.parameter.action;

  if(action == "in")
    return inTime(e);

  if(action == "out")var ss = SpreadsheetApp.openByUrl("dailySheet");
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

    // Check if the current date has a column
    if (columnIndex > -1) {
      // Set the value "P" in the column for the current date
      sheet.getRange(rowIndex + 2, columnIndex + 1).setValue("P");

      // Return a success message
      return ContentService.createTextOutput("Thank You! Your attendance has been marked as present").setMimeType(ContentService.MimeType.TEXT);
    } else {
      // Return an error message if the current date does not have a column
      return ContentService.createTextOutput("Attendance has not been taken today").setMimeType(ContentService.MimeType.TEXT);
    }
  }

  // Return an error message if the ID was not found
  return ContentService.createTextOutput("ID Not Found").setMimeType(ContentService.MimeType.TEXT);
}

function outTime(e){
  var id = e.parameter.id;
  var values = sheet.getRange(2,1,sheet.getLastRow(),1).getValues();
  
  for(var i = 0 ; i<values.length ; i++){
    if(values[i][0] == id){
      i=i+2;
      sheet.getRange(i,3).setValue("Not_Valid");
      return ContentService.createTextOutput("This is not a valid qr").setMimeType(ContentService.MimeType.TEXT);
    }
  }
  return ContentService.createTextOutput("Id Not Found").setMimeType(ContentService.MimeType.TEXT);
}
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
