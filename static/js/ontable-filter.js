// **************************************** Diesel details filter ******************************************************
function populateFilters() {


    var rowcount1 = parseInt(document.getElementById('rowcount1').innerText);
    var rowcount2 = parseInt(document.getElementById('rowcount2').innerText);



    const table = document.getElementById("dataTable");
    const rows = table.getElementsByTagName("tr");
    const selects = document.querySelectorAll(".table-filter select");
    const uniqueValues = Array.from({length: rowcount2}, () => new Set()); // 7 columns with filters

    console.log("Rows found:", rows.length); // Debug: Number of rows found

    // Collect unique values for the first 7 columns
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        if (cells.length === rowcount1) { // Only rows with 8 cells
            for (let j = 0; j < rowcount2; j++) { // Only the first 7 columns
                const textValue = cells[j].textContent.trim();
                if (textValue && textValue !== "-" && textValue !== "No data to display") {
                    uniqueValues[j].add(textValue);
                }
            }
        }
    }

    console.log("Unique values:", uniqueValues); // Debug: Unique values collected

    // Populate dropdown menus
    selects.forEach((select, index) => {
        select.innerHTML = '<option value="">همه</option>';
        uniqueValues[index].forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    });
}

function filterTable() {

    var rowcount1 = parseInt(document.getElementById('rowcount1').innerText);
    var rowcount2 = parseInt(document.getElementById('rowcount2').innerText);

    const table = document.getElementById("dataTable");
    const rows = table.getElementsByTagName("tr");
    const selects = document.querySelectorAll(".table-filter select");

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        if (cells.length === rowcount2) { // Only rows with 8 cells
            let showRow = true;
            selects.forEach((select, column) => {
                const filterValue = select.value;
                if (filterValue !== "") { // Apply only if filter is not empty
                    const textValue = cells[column].textContent.trim();
                    if (textValue !== filterValue) {
                        showRow = false;
                    }
                }
            });
            rows[i].style.display = showRow ? "" : "none";
        }
    }
}

// Run populateFilters and add event listeners for selects after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    populateFilters();
    const selects = document.querySelectorAll(".table-filter select");
    selects.forEach(select => {
        select.addEventListener("change", filterTable);
    });
});

// *********************************************************************************************************************
