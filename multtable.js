/*
File: multtable.js
Created by sejager
This is a JavaScript file to make the dynamic multiplication table dynamic.
*/

// Thanks to various w3schools pages for helping.

function tableCreate() {
    // Get the values from the submission form to make a table
    var mincol = document.getElementById("mincol").value;
    var maxcol = document.getElementById("maxcol").value;
    var minrow = document.getElementById("minrow").value;
    var maxrow = document.getElementById("maxrow").value;

    // Get rid of the old table or validation message if necessary.
    // Thanks to https://stackoverflow.com/a/32777600
    if (document.getElementById("tableContainer")) {
        var oldContainer = document.getElementById("tableContainer");
        oldContainer.parentElement.removeChild(oldContainer);
    }

    if (document.getElementById("validmsg")) {
        var oldMsg = document.getElementById("validmsg");
        oldMsg.parentElement.removeChild(oldMsg);
    }

    // Exit the function if the values aren't valid
    if (validateForm() == false)
        return 0;

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

/* Prevents the program from accepting too large a workload and also
lets the user know what to do differently. */

function validateForm() {
    var mincol = Number(document.getElementById("mincol").value);
    var maxcol = Number(document.getElementById("maxcol").value);
    var minrow = Number(document.getElementById("minrow").value);
    var maxrow = Number(document.getElementById("maxrow").value);

    // Possible error cases, textContent explains each case
    if (mincol >= maxcol || minrow >= maxrow) {
        const msg = document.createElement("p");
        msg.setAttribute("id", "validmsg");
        msg.textContent = "The minimum values must be lower than the maximum values.";
        document.body.appendChild(msg);
        return false;
    }
    else if((maxrow - minrow) > 100 || (maxcol - mincol) > 100) {
        const msg = document.createElement("p");
        msg.setAttribute("id", "validmsg");
        msg.textContent = "The difference between the minimum and maximum values must not exceed 100.";
        document.body.appendChild(msg);
        return false;
    }
    else if (Math.abs(minrow) > 999 || Math.abs(maxrow) > 999 || Math.abs(mincol) > 999 || Math.abs(maxcol) > 999) {
        const msg = document.createElement("p");
        msg.setAttribute("id", "validmsg");
        msg.textContent = "The values must be numbers between -999 and 999.";
        document.body.appendChild(msg);
        return false;
    }

    // Good to go!
    else {
        return true;
    }
}

// Have the submit button be the trigger to create the table
// Thanks to https://stackoverflow.com/a/69773796
var btn = document.getElementById("subbtn");
btn.addEventListener("click", () => {
    tableCreate();
})