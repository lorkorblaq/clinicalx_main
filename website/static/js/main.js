$(function () {
    console.log("MAIN ready");
    BaseUrl = "http://16.171.42.4:3000/api/"
    // BaseUrl = "http://0.0.0.0:3000/api";
    // function exportJSONData(data) {
    //     // Convert JSON data to CSV format
    //     var csvContent = convertJSONToCSV(data);
        
    //     // Create a blob object from the CSV content
    //     var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
    //     // Create a temporary anchor element to trigger the download
    //     var link = document.createElement('a');
    //     var url = URL.createObjectURL(blob);
    //     link.setAttribute('href', url);
    //     link.setAttribute('download', 'data.csv');
    //     document.body.appendChild(link);
        
    //     // Trigger the download
    //     link.click();
    //     document.body.removeChild(link);
    // }
    // function renderTable(tableId, exTableId, data, columns, headers) {
    //     // Destroy the existing DataTable instance for the specified table ID (if it exists)
    //     if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
    //         $(`#${tableId}`).DataTable().clear().destroy();
    //         $(`#${tableId}_head`).empty(); // Remove all children elements
    //     }
    //     // Function to append headers to the table
    //     headers.forEach(function (header) {
    //         h = $(`#${tableId}_head`);
    //         $(`#${tableId}_head`).append(`<th>${header}</th>`);
    //     });
    //     // Initialize a new DataTable instance for the specified table ID
    //     $(`#${tableId}`).DataTable({
    //         data: data,
    //         columns: columns.map(col => ({ data: col })),
    //         // Add any other DataTable options as needed
    //     });
    //     var exportButton = $('<button>').text(' Export').addClass('button fas fa-file-export');
    //     var printButton = $('<button>').text(' Print').addClass('button fas fa-print');
    //     exportButton.click(function() {
    //         exportJSONData(data);
    //     });
    //     printButton.click(function() {
    //         printJSONDataAsCSV(data);
    //     });
    //     if ($(`#${exTableId}`).find('.button').length === 0) {
    //         $(`#${exTableId}`).append(exportButton).append(printButton);
    //     }
    //     }
    // // Function to convert JSON data to CSV format
    // function convertJSONToCSV(data) {
    //     var csv = [];
    //     // Extract column headers from the first object in the array
    //     var headers = Object.keys(data[0]);
    //     csv.push(headers.join(','));
        
    //     // Iterate over each object in the array
    //     data.forEach(function(obj) {
    //         var row = [];
    //         // Iterate over each property in the object
    //         headers.forEach(function(header) {
    //             // Add the property value to the row array
    //             row.push(obj[header]);
    //         });
    //         // Join row array with comma and push to CSV array
    //         csv.push(row.join(','));
    //     });
        
    //     // Combine rows into a single CSV string
    //     var csvContent = csv.join('\n');
    //     return csvContent;
    // }
    // // Function to print the table content
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
    function getCookie(name) {
        const cookieArr = document.cookie.split("; ");
        for (let i = 0; i < cookieArr.length; i++) {
            const cookiePair = cookieArr[i].split("=");
            if (name === cookiePair[0]) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    };

    const user_id = getCookie('user_id');
    const session_id = getCookie('session_id');

// Check if socket is already initialized
    if (!window.socket) {
        // Initialize socket
        window.socket = io();
    }
        

    // In your other file (let's call it otherFile.js)

    $('#InputItemMain').typeahead({
        source: function (request, response) {
            $.ajax({
                url: `${BaseUrl}/items/get/`, // Replace with your API endpoint for item search
                method: "GET",
                data: { term: request.term },
                dataType: "json",
                success: function (data) {
                    console.log("Retrieved data:", data);
                    const itemNames = data.items.map(item => item.item);
                        response(itemNames);
                    },
                error: function (error) {
                    console.error("Error fetching item data:", error);
                    }
                });
            },
        });
    $('#autoInputItem').typeahead({
        source: function (request, response) {
            $.ajax({
                url: `${BaseUrl}/items/get/`, // Replace with your API endpoint for item search
                method: "GET",
                data: { term: request.term },
                dataType: "json",
                success: function (data) {
                    console.log("Retrieved data:", data);
                    const itemNames = data.items.map(item => item.item);
                    response(itemNames);
                    },
                error: function (error) {
                    console.error("Error fetching item data:", error);
                    }
                });
            },
        });
    $('#autoInputLot').typeahead({
        source: function (request, response) {
            $.ajax({
                url: `${BaseUrl}/lotexp/get/`, // Replace with your API endpoint for item search
                method: "GET",
                data: { term: request.term },
                dataType: "json",
                success: function (data) {
                    // console.log("Retrieved data:", data);
                    const lotNumb = data.lotexp.map(lot => lot.lot_numb);
                    console.log(lotNumb);
                    response(lotNumb);
                    },
                error: function (error) {
                    console.error("Error fetching lot data:", error);
                    }
                });
            },
        });
    var path = window.location.pathname;
    
    // Add the 'active' class to the link with a matching pattern
    $('a[href="' + path + '"]').addClass('active');
    function refreshTable() {
        fetchData(`${BaseUrl}/channels/get/`).then(data => {
            dataTableInstance.clear();
            dataTableInstance.rows.add(data.channels);
            dataTableInstance.draw();
        }).catch(error => {
            console.error("Error fetching data:", error);
        });
    }
    toastr.options = {
        "timeOut": 0,          // Set timeOut to 0 to keep the notification until closed
        "extendedTimeOut": 0,  // Set extendedTimeOut to 0 to keep the notification until closed
        "tapToDismiss": true, // Disable tap to dismiss
        "positionClass": "toast-bottom-right", // Position of the notification
        "iconClass": 'toast-success-icon', // Custom icon class
        "escapeHtml": true,    // Escape HTML in message
        "showMethod": 'slideDown', // Show animation method
        "hideMethod": 'slideUp',    // Hide animation method
        "showEasing": 'swing',  // Show animation easing
        "hideEasing": 'linear', // Hide animation easing
        "showDuration": 300,    // Show animation duration
        "hideDuration": 300     // Hide animation duration
    };
    socket.on('notifications', function(data) {
        // Handle notification received from the server
        console.log('Notification:', data.message);
        toastr.warning(data.message, 'Notification');
        // Display the notification to the user (e.g., using a toast or alert)
    });  
      
});