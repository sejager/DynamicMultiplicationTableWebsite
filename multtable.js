/*
File: multtable.js
Created by sejager
This is a JavaScript file to make the dynamic multiplication table dynamic.
*/


// Have the needed functions be run once the document has loaded.
$(document).ready(function() {
    validator();
    sliders();
    tabs();

    // Create a new tab with a table if the form is valid upon clicking of submit
    $('#subbtn').click(function () {
        if ($('#numValues').valid() == true)
            tableCreate();
    });
});

function validator() {
    // Thanks to https://jqueryvalidation.org for helping with jQuery validation
    // Create the needed error methods and assign them to the relevant elements.
    // Thanks to https://stackoverflow.com/a/29451695 for how to compare values
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

}

function sliders() {
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
}

function tabs() {
    // Tab settings
    // Thanks to https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/jQueryUI1.8_Ch03_TabsWidget.pdf
    $('#tabs').tabs();
}

function tableCreate() {
        // Get the latest values
        var mincol = $('#mincol').val()
        var maxcol = $('#maxcol').val()
        var minrow = $('#minrow').val()
        var maxrow = $('#maxrow').val()
        // Create a tab name and ID based on the values
        var tabName = 'col: ' + mincol + ' ' + maxcol + '<br>'
            + ' row: ' + minrow + ' ' + maxrow;
        var tabId = mincol + maxcol + minrow + maxrow;

        // Don't create a new tab if we already have a tab with those values
        if (document.getElementById(tabId) != null) {
            console.log('Tab already exists.');
            return;
        }

        $('#tabs').find('ul').append('<li><a href="' + tabId + '">' + '<div>'
            + tabName + '</div>' + '</a></li>');

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
        tblCntnr.appendChild(tbl);

        // Append the newly created table to the new tab
        // Thanks to https://stackoverflow.com/a/18076415 and https://stackoverflow.com/a/21515395
        $('#tabs').append('<div id="' + tabId + '">hey</div>')
        $('#tabs').append(tblCntnr);
        $('#tabs').append('</div>');
        $('#tabs').tabs('refresh');
};