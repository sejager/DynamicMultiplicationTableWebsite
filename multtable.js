/*
File: multtable.js
Created by sejager
This is a JavaScript file to make the dynamic multiplication table dynamic.
*/


const MINVALUE = -99;
const MAXVALUE = 99;
const selectedTabs = [];

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

    $('#dltBtn').click(function () {
        if (selectedTabs.length > 0)
                deleteTabs();
    });

    // Thanks to https://stackoverflow.com/a/23852114
    $(document).on('click', '.tabDltBtn', function() {
        // Get just the id number without the btn
        this.classList.add('pushed')
        selectedTabs.push(this.id.slice(3));
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
        return parseInt(value) >= MINVALUE && parseInt(value) <= MAXVALUE;
    }, jQuery.validator.format('The value must be a number between ' + MINVALUE
        + ' and ' + MAXVALUE + '.'));

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
        min: MINVALUE,
        max: MAXVALUE - 1,
        step: 1,
        animated: true,
        slide: function(event, ui) {
            $('#mincol').val(ui.value)
        }
    }
    var maxcolslider = {
        value: $('#maxcol').val(),
        min: MINVALUE + 1,
        max: MAXVALUE,
        step: 1,
        animated: true,
        slide: function(event, ui) {
            $('#maxcol').val(ui.value)
        }
    }
    var minrowslider = {
        value: $('#minrow').val(),
        min: MINVALUE,
        max: MAXVALUE - 1,
        step: 1,
        animated: true,
        slide: function(event, ui) {
            $('#minrow').val(ui.value)
        }
    }
    var maxrowslider = {
        value: $('#maxrow').val(),
        min: MINVALUE + 1,
        max: MAXVALUE,
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
    // Not much thanks to https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/jQueryUI1.8_Ch03_TabsWidget.pdf
    // Half of the functions don't even work anymore.
    $('#tabs').tabs();
    $('#tabs').hide();
}

function tableCreate(tabNum) {
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
        // Instead highlight the tab and switch to it
        // To ensure we don't have multiple highlighted tabs remove the attribute
        // Thanks to https://stackoverflow.com/a/64354717
        if (document.getElementById('tabAlert') != null)
            document.getElementById('tabAlert').removeAttribute('id');
        if (document.getElementById(tabId) != null) {
            // Surely there's a better way...
            document.getElementsByClassName('ui-tabs-nav')[0].querySelector('[aria-controls="'+ tabId + '"]').setAttribute('id', 'tabAlert');
            $('#tabs').tabs('option', 'active', $('#' + tabId).index('.ui-tabs-panel'));
            return;
        }

        // Check that there aren't already 10 tabs, otherwise display an error message
        else if (($('#tabs li').length >= 10)) {
            if (!document.getElementById('tabError'))
                $('#tabs').before("<div id='tabError' class='error'>You can't have more than 10 tabs open.</div>");
            return;
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
        tblCntnr.appendChild(tbl);

        // Append the newly created table to the new tab and switch to it
        // Thanks to https://jqueryui.com/upgrade-guide/1.9/#deprecated-add-and-remove-methods-and-events-use-refresh-method
        // Each tab also has a delete button
        $('#tabs').find('ul').append('<li><a href="#' + tabId + '">'+ tabName
            + '</a><button class="tabDltBtn" id="btn' + tabId + '"><div class="btnX">x</div></button></li>');
        $('#tabs').append('<div id="' + tabId + '"></div>');
        $('#' + tabId).append(tblCntnr);
        $('#tabs').tabs('refresh');
        $('#tabs').tabs('option', 'active', $('#' + tabId).index('.ui-tabs-panel'));
        $('#tabs').show();
};

function deleteTabs() {
    // Delete all the tabs that have been selected
    while (selectedTabs.length != 0) {
        var tabIndex = $('#' + selectedTabs.pop()).index('.ui-tabs-panel');
        console.log()
        // Remove the tab
        var tab = $('#tabs').find( '.ui-tabs-nav li:eq(' + tabIndex + ')').remove();
        // Find the id of the associated panel
        var panelId = tab.attr('aria-controls');
        // Remove the panel
        $('#' + panelId).remove();
    }
    // Refresh the tabs widget
    $('tabs').tabs('refresh');
    // Remove tab alert warning
    if (document.getElementById('tabAlert') != null)
        document.getElementById('tabAlert').removeAttribute('id');
    // Remove warning if tabs can now be added
    if (($('#tabs li').length < 10) && document.getElementById('tabError')) 
        document.getElementById('tabError').parentElement.removeChild(tabError);
    // Hide the tabs if needed
    if ($('#tabs li').length == 0)
        $('#tabs').hide();
};