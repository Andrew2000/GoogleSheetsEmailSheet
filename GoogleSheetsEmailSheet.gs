function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Send EOD",
    functionName : "sendEmail"
  }];
  sheet.addMenu("Send Email", entries);
};

function sendEmail() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var range = sheet.getDataRange();
  var date = new Date();
  var subject = "Weekly Report- Andrew Lee";

  // uncomment if you need to specify range or add or subtract lastrow and column based on offset
  // var schedRange = sheet.getRange("A1:E24");
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();

  // Dynamically get whole sheet based on lastrow and lastcolumn
  var schedRange = sheet.getRange(1, 1, lastRow, lastColumn);

  // We only want the schedule within borders, so
  // these are handled separately.
  var body = '<div style="text-align:center;display: inline-block;font-family: arial,sans,sans-serif">'
  body += '<H1>'+ "Weekly Report- Andrew Lee" +'</H1>';
  body += '<H2>'
        + date
        + '</H2>';
  body += getHtmlTable(schedRange);
  body += '</div>';
  debugger;
  //Logger.log(body);
  recipient = 'YOUR_EMAIL_HERE'+","+"ADDITIONAL_CCs_HERE";
  GmailApp.sendEmail(recipient, subject, "Requires HTML", {htmlBody:body})
}

/**
 * Return a string containing an HTML table representation
 * of the given range, preserving style settings.
 */
function getHtmlTable(range){
  var ss = range.getSheet().getParent();
  var sheet = range.getSheet();
  startRow = range.getRow();
  startCol = range.getColumn();
  lastRow = range.getLastRow();
  lastCol = range.getLastColumn();

  // Read table contents
  var data = range.getValues();

  // Get css style attributes from range
  var fontColors = range.getFontColors();
  var backgrounds = range.getBackgrounds();
  var fontFamilies = range.getFontFamilies();
  var fontSizes = range.getFontSizes();
  var fontLines = range.getFontLines();
  var fontWeights = range.getFontWeights();
  var horizontalAlignments = range.getHorizontalAlignments();
  var verticalAlignments = range.getVerticalAlignments();

  // Get column widths in pixels
  var colWidths = [];
  for (var col=startCol; col<=lastCol; col++) {
    colWidths.push(sheet.getColumnWidth(col));
  }
  // Get Row heights in pixels
  var rowHeights = [];
  for (var row=startRow; row<=lastRow; row++) {
    rowHeights.push(sheet.getRowHeight(row));
  }

  // Future consideration...
  var numberFormats = range.getNumberFormats();

  // Build HTML Table, with inline styling for each cell
  var tableFormat = 'style="border:1.5px solid black;border-collapse:collapse;text-align:center" border = 1.5 cellpadding = 5';
  var html = ['<table '+tableFormat+'>'];
  // Column widths appear outside of table rows
  for (col=0;col<colWidths.length;col++) {
    html.push('<col width="'+colWidths[col]+'">')
  }
  // Populate rows
  for (row=0;row<data.length;row++) {
    html.push('<tr height="'+rowHeights[row]+'">');
    for (col=0;col<data[row].length;col++) {
      // Get formatted data
      var cellText = data[row][col];
      if (cellText instanceof Date) {
        cellText = Utilities.formatDate(
                     cellText,
                     ss.getSpreadsheetTimeZone(),
                     'MMM/d EEE');
      }
      var style = 'style="'
                + 'color: ' + fontColors[row][col]+'; '
                + 'font-family: ' + fontFamilies[row][col]+'; '
                + 'font-size: ' + fontSizes[row][col]+'; '
                + 'font-weight: ' + fontWeights[row][col]+'; '
                + 'background-color: ' + backgrounds[row][col]+'; '
                + 'text-align: ' + horizontalAlignments[row][col]+'; '
                + 'vertical-align: ' + verticalAlignments[row][col]+'; '
                +'"';
      html.push('<td ' + style + '>'
                +cellText
                +'</td>');
    }
    html.push('</tr>');
  }
  html.push('</table>');

  return html.join('');
}
