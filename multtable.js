/*
File: multtable.js
Created by sejager
This is a JavaScript file to make the dynamic multiplication table dynamic.
*/


// Thanks to https://jqueryvalidation.org for helping with jQuery validation

// Once the document is ready create the needed error methods and assign them to the relevant elements.
$(document).ready(function() {
    // https://stackoverflow.com/a/29451695 how to compare values
    jQuery.validator.addMethod('greaterThan', function (value, element, param) {
        return parseInt(value) > parseInt($(param).val());
    }, jQuery.validator.format('The minimum value must be lower than the maximum value.'));

    jQuery.validator.addMethod('notFartherApartThan', function (value, element, param) {
        return parseInt(value) < parseInt($(param).val()) + 100;
    }, jQuery.validator.format('The difference between the minimum and maximum values must not exceed 100.'));

    jQuery.validator.addMethod('withinBoundaries', function (value, element) { 
        return parseInt(value) > -1000 && value < 1000;
    }, jQuery.validator.format('The value must be a number between -999 and 999.'));

    $('#numValues').validate({
        // Thanks to https://stackoverflow.com/a/27430858
        errorElement: 'div',
        rules: {
            mincol: {
                withinBoundaries: true
            },
            maxcol: {
                withinBoundaries: true,
                greaterThan: '#mincol',
                notFartherApartThan: '#mincol'
            },
            minrow: {
                withinBoundaries: true
            },
            maxrow: {
                withinBoundaries: true,
                greaterThan: '#minrow',
                notFartherApartThan: '#minrow'
            }
        }
    })
});

// Thanks to various w3schools pages for helping.
function tableCreate() {
    // Get the values from the submission form to make a table
    var mincol = document.getElementById("mincol").value;
    var maxcol = document.getElementById("maxcol").value;
    var minrow = document.getElementById("minrow").value;
    var maxrow = document.getElementById("maxrow").value;

    // Get rid of the old table if necessary.
    // Thanks to https://stackoverflow.com/a/32777600
    if (document.getElementById("tableContainer")) {
        var oldContainer = document.getElementById("tableContainer");
        oldContainer.parentElement.removeChild(oldContainer);
    }

    // Create a new table container with all its contents

    const tblCntnr = document.createElement("div");
    tblCntnr.setAttribute("id", "tableContainer");

    // Create a new table
    const tbl = document.createElement("table");
    tbl.setAttribute("id", "tbl");
    tbl.setAttribute("overflow", "scroll");

    const tblBody = document.createElement("tbody");

    var row, cell, cellNo;
    
    /* Create the table cell by cell, column by column, row by row by
    creating elements for each cell and then inserting text nodes within them
    and then inserting the cell into the row. Next insert the row into the
    table body until it is complete before placing the table body within the
    table. */
    // Thanks to https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Traversing_an_HTML_table_with_JavaScript_and_DOM_Interfaces
    for (let i = minrow - 1; i <= maxrow; i++) {
        row = document.createElement("tr");
        for (let j = mincol - 1; j <= maxcol; j++) {
            // Exceptions for header rows and columns
            if (i == minrow - 1) {
                cell = document.createElement("th");
                if (j == mincol - 1) {
                    cellNo = document.createTextNode("");
                } else {
                    cellNo = document.createTextNode(j)
                }
            } else if (j == mincol - 1) {
                cell = document.createElement("th");
                cellNo = document.createTextNode(i)
            } else {
                cell = document.createElement("td");
                cellNo = document.createTextNode(i * j);
            }
            cell.appendChild(cellNo);
            row.appendChild(cell);
        }
    
        tblBody.appendChild(row);
    }
    tbl.appendChild(tblBody);

    // Attach the newly created table onto the document
    document.body.appendChild(tblCntnr);
    document.getElementById("tableContainer").appendChild(tbl);
}

// Have the submit button be the trigger to create the table, but first check that the form is valid
// Thanks to https://stackoverflow.com/a/69773796
var btn = document.getElementById("subbtn");
btn.addEventListener("click", () => {
    if ($('#numValues').valid() == true) {
        tableCreate();
    }
})