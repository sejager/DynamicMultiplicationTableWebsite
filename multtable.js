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
        return parseInt(value) < parseInt($(param).val()) + 101;
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

    // Slider settings
    // Thanks to https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/jQueryUI1.8_Ch06_SliderWidget.pdf
    // The slide function updates the numeric value in the input field as the slider moves
    // Thanks to the comment by chrisrbailey on this answer https://stackoverflow.com/a/621202
    // which I found thanks to https://stackoverflow.com/a/2157466
    var mincolslider = {
        value: $('#mincol').val(),
        min: -999,
        max: 998,
        step: 1,
        animated: true,
        slide: function(event, ui) {
            $('#mincol').val(ui.value)
        }
    }
    var maxcolslider = {
        value: $('#maxcol').val(),
        min: -998,
        max: 999,
        step: 1,
        animated: true,
        slide: function(event, ui) {
            $('#maxcol').val(ui.value)
        }
    }
    var minrowslider = {
        value: $('#minrow').val(),
        min: -999,
        max: 998,
        step: 1,
        animated: true,
        slide: function(event, ui) {
            $('#minrow').val(ui.value)
        }
    }
    var maxrowslider = {
        value: $('#maxrow').val(),
        min: -998,
        max: 999,
        step: 1,
        animated: true,
        slide: function(event, ui) {
            $('#maxrow').val(ui.value)
        }
    }

    $('#mincolslider').slider(mincolslider);
    $('#maxcolslider').slider(maxcolslider);
    $('#minrowslider').slider(minrowslider);
    $('#maxrowslider').slider(maxrowslider);

    // With .change it only updates once you exit the input field if you're typing
    // in a number, so to make it as dynamic as possible a setInterval function was used.
    // Thanks to https://stackoverflow.com/q/9218885
    setInterval(function() {$('#mincol').each(function() {
        $('#mincolslider').slider('value', $('#mincol').val())
    })}, 1)

    setInterval(function() {$('#maxcol').each(function() {
        $('#maxcolslider').slider('value', $('#maxcol').val())
    })}, 1)

    setInterval(function() {$('#minrow').each(function() {
        $('#minrowslider').slider('value', $('#minrow').val())
    })}, 1)

    setInterval(function() {$('#maxrow').each(function() {
        $('#maxrowslider').slider('value', $('#maxrow').val())
    })}, 1)
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