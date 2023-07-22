var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1KCjTUDQNuSYSg45KgV-Vw-RfbOTRBTosCo9bFs-jjPw/edit#gid=0");
var sheet = ss.getSheetByName("daily_attendance");

function doGet(e) {
  var action = e.parameter.action;
  if (action == "manualAttendance")
    return showManualAttendance();
    else if (action == "calculate")
    return calculateAttendance();
  else
    return ContentService.createTextOutput("Invalid action parameter").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var action = e.parameter.action;
  if (action == "in" || action == "out")
    return inOutTime(e);
      else if (action == "calculate")
    return calculateAttendance();
  else
    return ContentService.createTextOutput("Invalid action parameter").setMimeType(ContentService.MimeType.TEXT);
}

function showManualAttendance() {
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var currentDate = new Date();
  var columnIndex = headers.findIndex(function (header) {
    return new Date(header).toDateString() === currentDate.toDateString();
  });

  var htmlOutput = HtmlService.createHtmlOutput();

  // Create the HTML form
  var form = '<form id="attendanceForm" class="centered">';

  for (var i = 1; i < values.length; i++) {
    var studentId = values[i][0];
    form += '<label>';
    form += '<input type="checkbox" name="attendance[]" value="' + studentId + '"> ' + studentId;
    form += '</label><br>';
  }

  form += '<select name="qr">';
  form += '<option value="FOC">FOC</option>';
  form += '<option value="MATHS">MATHS</option>';
  form += '<option value="FEEE">FEEE</option>';
  form += '<option value="EVS">EVS</option>';
  form += '</select>';
  form += '<input type="button" value="Mark Attendance" onclick="submitForm()">';
  form += '<a href="https://imgbb.com/"><img  id = "right" src="https://i.ibb.co/V2x6GCW/images.png" alt="images" border="0"></a>';
  form += '<a href="https://imgbb.com/"><img id = "right" src="https://i.ibb.co/2788DGx/polc.jpg" alt="polc" border="0"></a>';
  form += '</form>';

  // Create the CSS styles for centering the form
  var styles = '<style>';
  styles += '.centered {';
  styles += '  display: flex;';
  styles += '  flex-direction: column;';
  styles += '  align-items: center;';
  styles += 'object-position: top;';
  styles += 'bottom 10px';
  styles += '}';
  styles += '#right { ';
  styles += 'object-fit: none;';
  styles += 'object-position: left top;';
  styles += ' position: absolute;';
  styles += 'top 10px';
  styles += '}  ';
  styles += '</style>';

  // Create the JavaScript function to submit the form
  var script = '<script>';
  script += 'function submitForm() {';
  script += 'var form = document.getElementById("attendanceForm");';
  script += 'var checkboxes = form.elements["attendance[]"];';
  script += 'var qr = form.elements["qr"].value;';
  script += 'var ids = [];';
  script += 'for (var i = 0; i < checkboxes.length; i++) {';
  script += '  if (checkboxes[i].checked) {';
  script += '    ids.push(checkboxes[i].value);';
  script += '  }';
  script += '}';
  script += 'google.script.run.markAttendance(ids, qr);';
  script += '}';
  script += '</script>';

  // Combine the form, script, and styles in the HTML output
  htmlOutput.setContent(styles + form + script);

  // Return the HTML output
  return htmlOutput;
}


function inOutTime(sheet, e) {
  var id = e.parameter.id;
  var qr = e.parameter.qr;

  // Array of valid QR codes
  var validQrCodes = ["FOC", "MATHS", "FEEE", "EVS"];

  // Check if the QR code is valid
  if (!validQrCodes.includes(qr)) {
    return ContentService.createTextOutput("Invalid QR code").setMimeType(ContentService.MimeType.TEXT);
  }

  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var currentDate = new Date();
  var columnIndex = headers.findIndex(function (header) {
    return new Date(header).toDateString() === currentDate.toDateString();
  });
  var existingAttendance = "";
  var rowIndex = -1;
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] == id) {
      existingAttendance = values[i][columnIndex];
      rowIndex = i;
      break;
    }
  }

  // Check if the student has already been marked for the same class
  if (existingAttendance.includes(qr)) {
    return ContentService.createTextOutput("Attendance already marked for class " + qr).setMimeType(ContentService.MimeType.TEXT);
  }

  var newAttendance = qr;
  if (rowIndex === -1) {
    // Add a new row for the student
    rowIndex = values.length;
    sheet.insertRowAfter(rowIndex);
    sheet.getRange(rowIndex + 2, 1).setValue(id);
    sheet.getRange(rowIndex + 2, 2).setValue(""); // added to ensure there is an empty value for student name
  }
  sheet.getRange(rowIndex + 2, columnIndex + 1).setValue(newAttendance);
  return ContentService.createTextOutput("Thank you! Your attendance has been marked for class " + qr).setMimeType(ContentService.MimeType.TEXT);
}

function markAttendance(ids, qr) {
  var validQrCodes = ["FOC", "MATHS", "FEEE", "EVS"];

  // Check if the QR code is valid
  if (!validQrCodes.includes(qr)) {
    return "Invalid QR code";
  }

  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var currentDate = new Date();
  var columnIndex = headers.findIndex(function (header) {
    return new Date(header).toDateString() === currentDate.toDateString();
  });

  for (var i = 0; i < ids.length; i++) {
    var existingAttendance = "";
    var rowIndex = -1;
    for (var j = 0; j < values.length; j++) {
      if (values[j][0] == ids[i]) {
        existingAttendance = values[j][columnIndex];
        rowIndex = j;
        break;
      }
    }

    // Check if the student has already been marked for the same class
    if (existingAttendance.includes(qr)) {
      Logger.log("Attendance already marked for class " + qr + " for student " + ids[i]);
    } else {
      var newAttendance = qr;
      if (rowIndex === -1) {
        // Add a new row for the student
        rowIndex = values.length;
        sheet.insertRowAfter(rowIndex);
        sheet.getRange(rowIndex + 2, 1).setValue(ids[i]);
        sheet.getRange(rowIndex + 2, 2).setValue(""); // added to ensure there is an empty value for student name
      } else {
        // Check if the cell already has attendance marked for other classes
        if (existingAttendance.length > 0) {
          // Add a comma if attendance for other classes exists
          newAttendance = existingAttendance + "," + newAttendance;
        }
      }

      sheet.getRange(rowIndex + 2, columnIndex + 1).setValue(newAttendance);
      Logger.log("Attendance marked for class " + qr + " for student " + ids[i]);
    }
  }

  return "Thank you! Your attendance has been marked for class " + qr;
}



function getStudentData() {
  
  var range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2); // Assuming student IDs in column 1 and names in column 2
  var values = range.getValues();

  var students = [];
  
  for (var i = 0; i < values.length; i++) {
    var studentId = values[i][0];
    var studentName = values[i][1];
    students.push({ id: studentId, name: studentName });
  }

  return students;
}

function calculateAttendance() {
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  var attendanceData = {};
  var classes = ["FOC", "MATHS", "FEEE", "EVS"];

  for (var i = 0; i < values.length; i++) {
    var studentId = values[i][0];
    var studentName = values[i][1];
    var attendance = values[i].slice(2); // Exclude the first two columns (ID and Name)

    if (!attendanceData.hasOwnProperty(studentId)) {
      attendanceData[studentId] = {
        studentName: studentName,
        present: 0,
        absent: 0,
        classAttendance: {},
      };

      for (var j = 0; j < classes.length; j++) {
        attendanceData[studentId].classAttendance[classes[j]] = 0;
      }
    }

    for (var j = 0; j < attendance.length; j++) {
      if (attendance[j] !== "") {
        attendanceData[studentId].classAttendance[classes[j]]++;
        attendanceData[studentId].present++;
      } else {
        attendanceData[studentId].absent++;
      }
    }
  }

  var htmlOutput = HtmlService.createHtmlOutput();
  var tableStyle = 'style="border-collapse: collapse; border: 1px solid black; margin: auto;"';
  var cellStyle = 'style="border: 1px solid black; padding: 5px;"';

  htmlOutput.append('<table ' + tableStyle + '>');
  htmlOutput.append('<tr>');
  htmlOutput.append('<th ' + cellStyle + '>Student ID</th>');
  htmlOutput.append('<th ' + cellStyle + '>Student Name</th>');
  htmlOutput.append('<th ' + cellStyle + '>Absent</th>');

  for (var j = 0; j < classes.length; j++) {
    htmlOutput.append('<th ' + cellStyle + '>' + classes[j] + '</th>');
  }

  htmlOutput.append('<th ' + cellStyle + '>Present</th>');
  htmlOutput.append('</tr>');

  for (var studentId in attendanceData) {
    var studentName = attendanceData[studentId].studentName;
    var presentCount = attendanceData[studentId].present;
    var absentCount = attendanceData[studentId].absent;
    var classAttendance = attendanceData[studentId].classAttendance;

    htmlOutput.append('<tr>');
    htmlOutput.append('<td ' + cellStyle + '>' + studentId + '</td>');
    htmlOutput.append('<td ' + cellStyle + '>' + studentName + '</td>');
    htmlOutput.append('<td ' + cellStyle + '>' + absentCount + '</td>');

    for (var j = 0; j < classes.length; j++) {
      htmlOutput.append('<td ' + cellStyle + '>' + classAttendance[classes[j]] + '</td>');
    }

    htmlOutput.append('<td ' + cellStyle + '>' + presentCount + '</td>');
    htmlOutput.append('</tr>');
  }

  htmlOutput.append('</table>');

  return htmlOutput;
}
