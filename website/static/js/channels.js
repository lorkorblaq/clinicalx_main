$(function () {
    const headersChannel = ['_id','created at', 'user', 'item', 'lot_numb', 'direction', 'location', 'quantity', 'description', 'action'];
    console.log("channels.js loaded");
    // BaseUrl = "http://13.53.70.208:3000/api";
    BaseUrl = "http://16.171.42.4:3000/api";

    // const user_d = $.cookie('user_id');
    function getCookie(name) {
        let cookieArr = document.cookie.split("; ");
        for(let i = 0; i < cookieArr.length; i++) {
            let cookiePair = cookieArr[i].split("=");
            if(name == cookiePair[0]) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    }
    
    let dataTableInstance;
    let editedCell;
    const user_id = getCookie('user_id');
    const url = `${BaseUrl}/channel/push/${user_id}/`;
    const url_item_get = `${BaseUrl}/item/get/`;
    const url_item_put = `${BaseUrl}/item/put/`;

   
    function fetchData(url) {
        // Fetch data from the provided URL
        return $.get(url);
    }
    
    async function fetchLotNumbers() {
        try {
            const data = await $.get(`${BaseUrl}/lotexp/get/`);
            return data.lotexp.map(lot => lot.lot_numb);
        } catch (error) {
            console.error('Error fetching lot numbers:', error);
            return [];
        }
    }
    async function submitForm() {
        let item = $('#autoInputItem').val();
        let lot = $('#autoInputLot').val();
        let quantity = $('#QtyInputChannel').val();
        let direction = $('#dropDownDirectionChannel').val();
        let location = $('#dropDownLocationsChannel').val();
        let description = $('#DescripInputChannel').val();
        switch (true) {
            case !item:
                alert("Please enter an item.");
                break;
            case !quantity:
                alert("Please enter a quantity.");
                break;
            case !direction:
                alert("Please enter a machine.");
                break;
            case !location:
                alert("Please enter a location.");
                break;
            case !lot:
                alert("Please enter a lot number.");
            default:
                // Create an object with the form data
                const formData = {
                    item: item,
                    lot_numb: lot,
                    quantity: quantity,
                    direction: direction,
                    location: location,
                    description: description
                };
                // console.log(formData);
                // console.log(user_id);
                $.post({
                        url: url,
                        contentType: "application/json",
                        data: JSON.stringify(formData),
                        success: function (response) {
                            alert("Channel created successfully");
                            console.log(response);
                        },
                        error: function (error) {
                            alert("Could not insert Data into Channels. Please make sure the item is in the inventory and the lot number is correct");
                            console.error(error);
                        }
                    });
                try {
                    itemform = {
                        direction: direction,
                        item: item,
                        'in stock': quantity,
                    }
                    console.log(itemform);
                    $.ajax({
                        url: url_item_put,
                        contentType: "application/json",
                        method: "PUT",
                        data: JSON.stringify(itemform),
                        success: function (response) {
                            // alert("update qty successfully");
                            console.log(response);
                        },
                        error: function (error) {
                            alert("Could'nt update Quantity of items");
                            console.error(error);
                        }
                    });
                }
                catch (error) {
                    console.error("Error updating items quantity:", error);
                }
                
            }
        refreshTable()
        }
    function refreshTable() {
        fetchData(`${BaseUrl}/channels/get/`).then(data => {
            dataTableInstance.clear();
            dataTableInstance.rows.add(data.channels);
            dataTableInstance.draw();
        }).catch(error => {
            console.error("Error fetching data:", error);
        });
    }
    // Call refreshTable every 5 seconds (5000 milliseconds)
    // setInterval(refreshTable, 10000);
    async function loadData () {
        $('.body').empty();
        $('#reports_h').empty();
        headersChannel.forEach(function (header) {
            $('#reports_h').append(`<th>${header}</th>`);
            });
        try {
            const data = await fetchData(`${BaseUrl}/channels/get/`);
            // console.log(data);
            // renderTablePISChannels(data.channels, headersChannel);
            renderTablePISChannels('r_table', 'ex-r_table', data.channels, headersChannel);

            } 
        catch (error) {
            console.error("Error fetching data:", error);
            }
    }
    $('#r_table tbody').on('click','td:not(:first-child, :last-child, :nth-child(2))',function () {
        // Check if there's no other cell being edited
        if (!editedCell) {
            // Store the currently edited cell
            editedCell = $(this);
            // Get the current text of the cell
            var cellText = $(this).text();
            // Replace the cell's content with an input field, using the cell's current text as the initial value
            $(this).html('<input type="text" class="edit-input" value="' + cellText + '">');

            // Focus on the input field1`
            $('.edit-input').focus();
            }
        });

    $('#r_table tbody').on('blur', '.edit-input', function () {
        // Get the updated value from the input field
        var updatedValue = $(this).val();
        // Get the channel ID from the data attribute of the row
        var row = dataTableInstance.row(editedCell.closest('tr'));
        // var row = dataTableInstance.row($(this).closest('tr'));
        var rowData = row.data();
        // console.log(rowData);
        var rowId = rowData._id;
        // console.log(channelId);
        // Get the column index
        var columnIndex = editedCell.index();
        console.log(columnIndex);
        var columnsChannels={0:'created at',1:'user',2:'item',3:'lot_numb',4:'direction', 5:'location',6:'quantity',7:'description',};
        var columnNameChannels = columnsChannels[columnIndex];

        editedCell.text(updatedValue);
        // console.log(updatedValue);
        // Reset the editedCell variable
        editedCell = null;
        console.log(rowId);
        console.log(columnNameChannels);
        console.log(updatedValue);
        // Update the channel data in the database
        updateChannel(rowId, columnNameChannels, updatedValue);

        function updateChannel(rowId, columnNameChannels, updatedValue) {
            $.ajax({
                url: `${BaseUrl}/channel/put/${rowId}/`,
                method: "PUT",
                contentType: "application/json",
                data:  JSON.stringify({ [columnNameChannels]: updatedValue }),
                success: function () {
                    // alert('Channel updated successfully')
                    // Optionally, handle success actions
                    console.log(`The channel id:${rowId} updated successfully.`);
                },
                error: function (error) {
                    console.error("Error updating Channels:", error);
                    // editedCell.text(originalValue);
                    // Handle the error and provide feedback to the user
                    alert("Error updating channels. Please try again or call Femo");
                }
            });
        }
        
        });
    // Event listener for Enter key press
    $('#r_table tbody').on('keypress', '.edit-input', function (event) {
        // Check if the pressed key is Enter (key code 13)
        if (event.which === 13) {
            // Trigger the blur event to handle the update
            $(this).blur();
            }
        });
    // post for channel
    $('#postChannelForm').submit(async function (event) {
        event.preventDefault();
        let lotNumbers = await fetchLotNumbers();
        let lot = $('#autoInputLot').val();

        if (!lotNumbers.includes(lot)) {
            console.log("Lot doesn't exist");
            // Show the date input modal
            $('#dateModal').modal('show');

        } else if (lotNumbers.includes(lot)){
            console.log("Lot exists");
            // Handle form submission without expiration date
            await submitForm();
            refreshTable();
        }
    });
    // Function to handle form submission with expiration date
    // function renderTablePISChannels(data, columns) {
    //     // Destroy the existing DataTable instance (if it exists)
    //     if (dataTableInstance) {
    //         dataTableInstance.destroy();
    //         }
    //     // Empty the table body and header before rendering a new table
    //     // $('#r_table tbody').empty();
    //     $('#r_table thead').empty();
    //     $('#r_table thead').append('<tr>' + columns.map(header => `<th>${header}</th>`));
    
    //     // Initialize a new DataTable instance
    //     dataTableInstance = $('#r_table').DataTable({
    //         data: data,
    //         columns: columns.map(col => ({ data: col })),
    //         columnDefs: [
    //             {
    //                 targets: -1, // Target the last column
    //                 data: null,
    //                 defaultContent:
    //                 '<button class="tablebtn" id="btn-delete"><i class="fas fa-trash-alt"></i></button>'
    //             },
    //         ],
    //         order: [[1, 'desc']]
    //     });
    //     dataTableInstance.column(0).visible(false);

    //     }
    function renderTablePISChannels(tableId, exTableId, data, columns) {
        // Destroy the existing DataTable instance for the specified table ID (if it exists)
        if (dataTableInstance) {
            dataTableInstance.destroy();
            }
        // Empty the table body and header before rendering a new table
        // $('#r_table tbody').empty();
        $(`#${tableId} thead`).empty();
        $(`#${tableId} thead`).append('<tr>' + columns.map(header => `<th>${header}</th>`));


        dataTableInstance = $(`#${tableId}`).DataTable({
            data: data,
            columns: columns.map(col => ({ data: col })),
            columnDefs: [
                {
                    targets: -1, // Target the last column
                    data: null,
                    defaultContent:
                    '<button class="tablebtn" id="btn-delete"><i class="fas fa-trash-alt"></i></button>'
                },
            ],
            order: [[1, 'desc']]
        });
        dataTableInstance.column(0).visible(false);



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
        link.setAttribute('download', 'channels data.csv');
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
    $('#r_table tbody').on('click', '#btn-delete', function () {
        var row = dataTableInstance.row($(this).parents('tr'));
        deleteChannel(row);
        });

    $('#channel_btn').click(loadData ());

    function deleteChannel(row) {
        var rowId = row.data()._id;
        $.ajax({
            url: `${BaseUrl}/channel/delete/${rowId}/`,
            method: "DELETE",
            success: function () {
                // deleteRowById(channelId);
                // Remove the row from the DataTable on successful deletion
                row.remove().draw();
            },
            error: function (error) {
                console.error("Error deleting channel:", error);
                // Handle the error and provide feedback to the user
                alert("Error deleting channel. Please try again or call Femo.");
            }
        });
    }
   
});