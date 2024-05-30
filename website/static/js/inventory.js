$(function () {
    console.log("inventory.js loaded");
    const HeadersItem = ['Items','In Stock(vials)', 'Tests/Vial',  'Category', 'Bench'];
    const ColumnsItem = ['item',  'in stock', 'tests/vial', 'category', 'bench'];

    const ColumnsRequest = ['bench','item', 'in_stock', 'tests_per_day', 'total_tests_in_stock', 'quantity_test_requested', 'total_days_to_last', 'amount_needed'];
    const HeadersRequest = ['Bench','Item', 'In Stock(vials)', 'Tests/Day', 'Total Stock(tests)', 'Quantity Requested(tests)', 'In-Stock To Last(days)', 'Amount needed(vials)'];

    const columnsLot = ['item', 'lot_numb', 'expiration', 'quantity', 'created at'];
    const headersLot = ['Item', 'Lot','Expiration', 'Quantity', 'Created At'];
    BaseUrl = "http://16.171.42.4:3000/api"
    // BaseUrl = "http://0.0.0.0:3000/api";


    $('#inventory_b').click(function() {
        console.log("drawer clicked");
        $("#request_invent").hide()  ;
        $("#drawer_invent ").show();
        $("#tabel_request").hide();


    });

    $('#request_b').click(function() {
        $("#drawer_invent ").hide();
        $("#request_invent").show() ;
        // $("#tabel_request").hide();

    });

    $("#submit_request").click(function() {
        // Retrieve selected bench, categories, and number of days
        var bench = $("#bench_filter").val();
        var categories = $(".category_filter:checked").map(function() {
            return $(this).val();
        }).get();
        var days = $("#quantity").val();

        if (!bench || !days) {
            // Display an error message or perform any other action
            alert("Please enter the bench and number of days to proceed.");
            return; // Exit the function early
        }

        // Prepare data to send to the API
        var requestData = {
            bench: bench,
            categories: categories,
            days: days
        };
        console.log("Request data:", requestData);
        // Send the requisition data to the API using AJAX
        $.ajax({
            url: `${BaseUrl}/items/requisite/`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                // Handle successful response from the API
                console.log("Requisition submitted successfully:", response);
                // You can display a success message or perform any other action here
                $("#ex-request_invent_table").show();
                renderTable('request_invent_table', 'ex-request_invent_table', response.requested, ColumnsRequest, HeadersRequest);``
            },
            error: function(xhr, status, error) {
                // Handle errors from the API
                console.error("Error submitting requisition:", error);
                // You can display an error message or perform any other action here
            }
        });
    });

    // Function to display the response data in a table
    function fetchData(url) {
        // Fetch data from the provided URL
        return $.get(url);
    }
    // Function to render a DataTable instance for the specified table ID
    function renderTable(tableId, exTableId, data, columns, headers) {
    // Check if DataTable is already initialized and destroy it if it is
    if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
        var table = $(`#${tableId}`).DataTable();
        table.clear().destroy();
    }

    // Clear the table headers
    $(`#${tableId}_head`).empty();

    // Append new headers to the table
    headers.forEach(function(header) {
        $(`#${tableId}_head`).append(`<th>${header}</th>`);
    });

    // Initialize a new DataTable instance for the specified table ID
    $(`#${tableId}`).DataTable({
        data: data,
        columns: columns.map(col => ({ data: col })),
        // Add any other DataTable options as needed
    });

    // Create buttons
    var exportButton = $('<button>').text(' Export').addClass('button fas fa-file-export');
    var printButton = $('<button>').text(' Print').addClass('button fas fa-print');
    var deleteDB = $('<button>').text(' Delete').addClass('button fas fa-trash-alt');

    // Define button actions
    exportButton.click(function() {
        exportJSONData(data);
    });

    printButton.click(function() {
        printJSONDataAsCSV(data);
    });

    deleteDB.click(function() {
        fetch(`${BaseUrl}/items/deleteall/`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Items deleted successfully!');
            renderTable(tableId, exTableId, [], columns, headers); // Re-render table with empty data
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error deleting items');
        });
    });

    // Append buttons to exTableId if not already appended
    var buttonContainer = $(`#${exTableId}`);
    if (buttonContainer.find('.button').length === 0) {
        buttonContainer.append(exportButton).append(printButton).append(deleteDB);
    }
    }

    $('#importButton').click(function() {
        alert('Please select a CSV file to import data');
        
        // Create hidden file input
        var fileInput = $('<input>').attr('type', 'file').attr('accept', '.csv').css('display', 'none');
        $('body').append(fileInput); // Append to body
        
        // Bind change event before triggering click
        fileInput.on('change', function(event) {
            var file = event.target.files[0];
            if (file) {
                readCSVFile(file);
            }
        });
        
        // Trigger file input click
        fileInput.click();
    });

    function readCSVFile(file) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var csvData = event.target.result;
            var jsonData = convertCSVToJSON(csvData);
            sendJSONDataToAPI(jsonData);
        };
        reader.readAsText(file);
    }

    function sendJSONDataToAPI(jsonData) {
        fetch(`${BaseUrl}/items/bulkpush/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Data imported successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error importing data');
        });
    }


    function exportJSONData(data) {
        // Convert JSON data to CSV format
        var csvContent = convertJSONToCSV(data);

        // Create a blob object from the CSV content
        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create a temporary anchor element to trigger the download
        var link = document.createElement('a');
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);

        // Trigger the download
        link.click();
        document.body.removeChild(link);
    }

    // Function to convert JSON data to CSV format
    function convertJSONToCSV(data) {
        var csv = [];
        // Extract column headers from the first object in the array
        var headers = Object.keys(data[0]);
        csv.push(headers.join(','));

        // Iterate over each object in the array
        data.forEach(function(obj) {
            var row = [];
            // Iterate over each property in the object
            headers.forEach(function(header) {
                // Add the property value to the row array
                row.push(obj[header]);
            });
            // Join row array with comma and push to CSV array
            csv.push(row.join(','));
        });

        // Combine rows into a single CSV string
        var csvContent = csv.join('\n');
        return csvContent;
    }

    function convertCSVToJSON(csvData) {
        var lines = csvData.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines
        var result = [];
        var headers = lines[0].split(',').map(header => header.trim()); // Trim headers
        
        // Set of fields that should be converted to numbers
        var numericFields = new Set(['in stock', 'tests/vial', 'vials/pack', 'reOrderLevel', 'tests/day']);

        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentLine = lines[i].split(',').map(cell => cell.trim()); // Trim cell values

            for (var j = 0; j < headers.length; j++) {
                var header = headers[j];
                var value = currentLine[j];
                // Convert numeric fields to numbers
                if (numericFields.has(header)) {
                    obj[header] = Number(value);
                } else {
                    obj[header] = value;
                }
            }
            result.push(obj);
        }
        return result;
    }

    // Function to print the table content
    function printJSONDataAsCSV(jsonData) {
        // Add header row
        var headerRow = [];
        for (var key in jsonData[0]) {
            if (jsonData[0].hasOwnProperty(key)) {
                headerRow.push(key);
            }
        }
        var csvContent = '<table border="2">';
        // Add header row to CSV content
        csvContent += '<thead><tr>';
        headerRow.forEach(function(header) {
            csvContent += `<th>${header}</th>`;
        });
        csvContent += '</tr></thead>';

        // Convert JSON data to CSV format
        jsonData.forEach(function(item) {
            var row = [];
            for (var key in item) {
                if (item.hasOwnProperty(key)) {
                    row.push(item[key]);
                }
            }
            csvContent += '<tr>'; // Add row start tag
            row.forEach(function(cell) {
                csvContent += `<td>${cell}</td>`;
            });
            csvContent += '</tr>'; // Add row end tag
            csvContent += '<tr><td colspan="' + headerRow.length + '"><hr></td></tr>'; // Add horizontal line
        });
        csvContent += '</table>';

        // Open a new window to display the CSV content
        var printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Table Print</title></head><body>');
        printWindow.document.write(csvContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }

    function convertCSVToJSON(csvData) {
        var lines = csvData.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines
        var result = [];
        var headers = lines[0].split(',').map(header => header.trim()); // Trim headers
        
        // Set of fields that should be converted to numbers
        var numericFields = new Set(['in stock', 'tests/vial', 'vials/pack', 'reOrderLevel', 'tests/day']);

        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentLine = lines[i].split(',').map(cell => cell.trim()); // Trim cell values

            for (var j = 0; j < headers.length; j++) {
                var header = headers[j];
                var value = currentLine[j];
                // Convert numeric fields to numbers
                if (numericFields.has(header)) {
                    obj[header] = Number(value);
                } else {
                    obj[header] = value;
                }
            }
            result.push(obj);
        }
        return result;
    }

// Function to print the table content
// function printJSONDataAsCSV(jsonData) {
//     // Add header row
//     var headerRow = [];
//     for (var key in jsonData[0]) {
//         if (jsonData[0].hasOwnProperty(key)) {
//             headerRow.push(key);
//         }
//     }
//     var csvContent = '<table border="2">';
//     // Add header row to CSV content
//     csvContent += '<thead><tr>';
//     headerRow.forEach(function(header) {
//         csvContent += `<th>${header}</th>`;
//     });
//     csvContent += '</tr></thead>';

//     // Convert JSON data to CSV format
//     jsonData.forEach(function(item) {
//         var row = [];
//         for (var key in item) {
//             if (item.hasOwnProperty(key)) {
//                 row.push(item[key]);
//             }
//         }
//         csvContent += '<tr>'; // Add row start tag
//         row.forEach(function(cell) {
//             csvContent += `<td>${cell}</td>`;
//         });
//         csvContent += '</tr>'; // Add row end tag
//         csvContent += '<tr><td colspan="' + headerRow.length + '"><hr></td></tr>'; // Add horizontal line
//     });
//     csvContent += '</table>';

//     // Open a new window to display the CSV content
//     var printWindow = window.open('', '_blank');
//     printWindow.document.write('<html><head><title>Table Print</title></head><body>');
//     printWindow.document.write(csvContent);
//     printWindow.document.write('</body></html>');
//     printWindow.document.close();
//     printWindow.print();
// }

    // Event listeners for export and print buttons
    $('#export_request_button').click(function() {
        console.log("export button clicked");
        exportTableToCSV('request_invent_table');
    });

    $('#print_request_button').click(function() {
        printTable('request_invent_table');
    });

    function renderInventoryTable(data, columns) {
        if ($.fn.DataTable.isDataTable('#inventory_table')) {
            $('#inventory_table').DataTable().clear().destroy();
        }
        // const items = data.items;
        $('#inventory_table').DataTable({
            data: data,
            columns: columns.map(col => ({ data: col })),
            // responsive: true
        });
        }

    async function loadInventoryData() {
        try {
            const data = await fetchData(`${BaseUrl}/items/get/`);
            // console.log(data);
            renderTable('inventory_table', 'ex-inventory_table', data.items, ColumnsItem, HeadersItem);
            }
        catch (error) {
            console.error("Error fetching data:", error);
            }
        };
    loadInventoryData();   
    $('#all-items').click(async function() {
        console.log("All items clicked");
        try {
            const data = await fetchData(`${BaseUrl}/items/get/`);
            renderTable('inventory_table', 'ex-inventory_table', data.items, ColumnsItem, HeadersItem);
            console.log(data.items);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });
        // Replace the existing click event with change event for the dropdown
    $('#reorderable').click(async function() {
        console.log("reorderable clicked");
        try {
            const data = await fetchData(`${BaseUrl}/items/get/`);
            const reorderableItems = data.items.filter(item => item['in stock'] <= item['reOrderLevel']);
            renderTable('inventory_table', 'ex-inventory_table', reorderableItems, ColumnsItem, HeadersItem);
            console.log(reorderableItems);
            }
        catch (error) {
            console.error("Error fetching data:", error);
            }
        });

    function refreshTable() {
        fetchData(`${BaseUrl}/channels/get/`).then(data => {
            dataTableInstance.clear();
            dataTableInstance.rows.add(data.channels);
            dataTableInstance.draw();
        }).catch(error => {
            console.error("Error fetching data:", error);
        });
    }
});