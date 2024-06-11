$(function () {
    console.log("expiration.js loaded");
    const columnsLot = ['item', 'lot_numb', 'expiration', 'quantity', 'created at'];
    const headersLot = ['Item', 'Lot','Expiration', 'Quantity', 'Created At'];
    BaseUrl = "https://labpal.com.ng/api"
    // BaseUrl = "http://0.0.0.0:3000/api";

    async function fetchData(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }
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
    // function renderExpireTable(data, columns) {
    //     // if (dataTableInstance) {
    //     //     dataTableInstance.destroy();
    //     //     }
    //     // Destroy the existing DataTable instance (if it exists)
    //     if ($.fn.DataTable.isDataTable('#expire_table')) {
    //         $('#expire_table').DataTable().clear().destroy();
    //     }
    
    //     // Initialize a new DataTable instance
    //     $('#expire_table').DataTable({
    //         data: data,
    //         columns: columns.map(col => ({ data: col }))
    //     });
        // }
    // async function loadInventoryData() {
    //     headersItem.forEach(function (header_inventory) {
    //         $('#inventory_head').append(`<th>${header_inventory}</th>`);
    //     });
    //     try {
    //         const data = await fetchData(`${BaseUrl}/items/get/`);
    //         // console.log(data);
    //         renderInventoryTable(data.items, ColumnsItem);
    //         } 
    //     catch (error) {
    //         console.error("Error fetching data:", error);
    //         }
    //     };
    // loadInventoryData();   
    async function loadexpireData(){
        headersLot.forEach(function (header_expire) {
            $('#expire_head').append(`<th>${header_expire}</th>`);
        });
        try {
            const data = await fetchData(`${BaseUrl}/lotexp/get/`);
            console.log(data.lotexp);
            // renderExpireTable(data.lotexp, columnsLot);
            renderTable('expire_table', 'ex-expire_table', data.lotexp, columnsLot, headersLot);

            } 
        catch (error) {
            console.error("Error fetching data:", error);
            }
        };
    loadexpireData();
    

    $('#expiry_filter').on('input', async function () {
        const filterValue = $(this).val();
        
        if (filterValue === "") {
            // Clear the table if input is empty
            $('#expire_table').DataTable().clear().draw();
            return;
        }
    
        const filterDays = parseInt(filterValue, 10);
    
        if (isNaN(filterDays)) {
            console.error("Invalid input: Not a number");
            return;
        }
    
        try {
            const data = await fetchData(`${BaseUrl}/lotexp/get/`);
            const currentDate = new Date();
            const targetDate = new Date();
            targetDate.setDate(currentDate.getDate() + filterDays);
    
            const filteredData = data.lotexp.filter(item => {
                const expirationDate = new Date(item['expiration']);
                return expirationDate > currentDate && expirationDate <= targetDate;
            });
    
            renderTable('expire_table', 'ex-expire_table', filteredData, columnsLot, headersLot);
            console.log(filteredData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });
    

    
    //    Expired items data
    // $('#inventory_b').click(async function () {
    //     $('#drawer_invent').show();
    //     $('#drawer_expire').hide();
    //     });
    // $('#expire_b').click(async function () {
    //     $('#drawer_invent').hide();
    //     $('#drawer_expire').show();
    // });

});