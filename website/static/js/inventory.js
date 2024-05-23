$(function () {
    console.log("inventory.js loaded");
    const HeadersItem = ['Item','In Stock(vials)', 'Tests/Vial',  'Category', 'Bench'];
    const ColumnsItem = ['item',  'in stock', 'tests/vial', 'category', 'bench', ];
    const ColumnsRequest = ['bench','item', 'in_stock', 'tests_per_day', 'total_tests_in_stock', 'quantity_test_requested', 'total_days_to_last', 'amount_needed'];
    const HeadersRequest = ['Bench','Item', 'In Stock(vials)', 'Tests/Day', 'Total Stock(tests)', 'Quantity Requested(tests)', 'In-Stock To Last(days)', 'Amount needed(vials)'];

    const columnsLot = ['item', 'lot_numb', 'expiration', 'quantity', 'created at'];
    const headersLot = ['Item', 'Lot','Expiration', 'Quantity', 'Created At'];
    BaseUrl = "http://116.171.42.4:3000/api"
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
                renderTable('request_invent_table', 'ex-request_invent_table', response.requested, ColumnsRequest, HeadersRequest);
                // var exportButton = $('<button>').text(' Export').addClass('button fas fa-file-export');
                // var printButton = $('<button>').text(' Print').addClass('button fas fa-print');
                // exportButton.click(function() {
                //     exportJSONData(response.requested);
                // });
                // printButton.click(function() {
                //     printJSONDataAsCSV(response.requested);
                // });
                // $('#table_request').append(exportButton).append(printButton);
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
        // Destroy the existing DataTable instance for the specified table ID (if it exists)
        if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
            $(`#${tableId}`).DataTable().clear().destroy();
            $(`#${tableId}_head`).empty(); // Remove all children elements
        }
        // Function to append headers to the table
        headers.forEach(function (header) {
            h = $(`#${tableId}_head`);
            $(`#${tableId}_head`).append(`<th>${header}</th>`);
        });
        // Initialize a new DataTable instance for the specified table ID
        $(`#${tableId}`).DataTable({
            data: data,
            columns: columns.map(col => ({ data: col })),
            // Add any other DataTable options as needed
        });
        var exportButton = $('<button>').text(' Export').addClass('button fas fa-file-export');
        var printButton = $('<button>').text(' Print').addClass('button fas fa-print');
        exportButton.click(function() {
            exportJSONData(data);
        });
        printButton.click(function() {
            printJSONDataAsCSV(data);
        });
        if ($(`#${exTableId}`).find('.button').length === 0) {
            $(`#${exTableId}`).append(exportButton).append(printButton);
        }
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
    // async function loadexpireData(){
    //     headersLot.forEach(function (header_expire) {
    //         $('#expire_head').append(`<th>${header_expire}</th>`);
    //     });
    //     try {
    //         const data = await fetchData(`${BaseUrl}/lotexp/get/`);
    //         // console.log(data.lotexp);
    //         renderExpireTable(data.lotexp, columnsLot);
    //         } 
    //     catch (error) {
    //         console.error("Error fetching data:", error);
    //         }
    //     };
    // loadexpireData();
    
        // Replace the existing click event with change event for the dropdown
    $('#inventory_filter').change(async function () {
        const filter = $(this).val();
        try {
            const data = await fetchData(`${BaseUrl}/items/get/`);
            let filteredData;
            switch (filter) {
                case 'stock':
                    // Display all items
                    renderInventoryTable(data.items, ColumnsItem);
                    break;
                case 'alert':
                    // Filter items with "in stock" less than or equal to 5
                    filteredData = data.items.filter(item => item['in stock'] <= 5);
                    renderInventoryTable(filteredData, ColumnsItem);
                    break;
                case 'safe':
                    // Filter items with "in stock" between 5 and 10 (inclusive)
                    filteredData = data.items.filter(item => item['in stock'] <= 10);
                    renderInventoryTable(filteredData, ColumnsItem);
                    break;
                case 'reorderLevel':
                    // Filter items with "in stock" between 5 and 10 (inclusive)
                    filteredData = data.items.filter(item => item['in stock'] <= item['reOrderLevel']);
                    renderInventoryTable(filteredData, ColumnsItem);
                    break;
                default:
                    console.error("Invalid filter option");
                }
            } 
        catch (error) {
            console.error("Error fetching data:", error);
            }
        });
    // $('#expiry_filter').change(async function () {
    //     const filter = $(this).val();
    //     if (filter === "") {
    //         // Clear the table and return
    //         $('#expire_table').DataTable().clear().draw();
    //         return;
    //     }
    //     try {
    //         const data = await fetchData(`${BaseUrl}/lotexp/get/`);
    //         const currentDate = new Date();
    //         let filteredData;
    //         switch (filter) {
    //             case 'present':
    //                 filteredData = data.lotexp.filter(item => new Date(item['expiration']) <= currentDate);
    //                 break;
    //             case '30':
    //                 const dateIn30Days = new Date();
    //                 dateIn30Days.setDate(currentDate.getDate() + 30);
    //                 filteredData = data.lotexp.filter(item => new Date(item['expiration']) > currentDate && new Date(item['expiration']) <= dateIn30Days);
    //                 break;
    //             case '60':
    //                 const dateIn60Days = new Date();
    //                 dateIn60Days.setDate(currentDate.getDate() + 60);
    //                 filteredData = data.lotexp.filter(item => new Date(item['expiration']) > currentDate && new Date(item['expiration']) <= dateIn60Days);
    //                 break;
    //             case '90':
    //                 const dateIn90Days = new Date();
    //                 dateIn90Days.setDate(currentDate.getDate() + 90);
    //                 filteredData = data.lotexp.filter(item => new Date(item['']) > currentDate && new Date(item['expiration']) <= dateIn90Days);
    //                 break;
    //             }
    //         renderExpireTable(filteredData, columnsLot);
    //         } 
    //     catch (error) {
    //         console.error("Error fetching data:", error);
    //         }    
    //     });
    function refreshTable() {
        fetchData(`${BaseUrl}/channels/get/`).then(data => {
            dataTableInstance.clear();
            dataTableInstance.rows.add(data.channels);
            dataTableInstance.draw();
        }).catch(error => {
            console.error("Error fetching data:", error);
        });
    }
    // Function to export JSON data to CSV

});