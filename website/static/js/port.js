$(function() {
    console.log('port.js loaded');
    BaseUrl = "http://16.171.42.4/api";
    // BaseUrl = "http://0.0.0.0:3000/api";

    // const url_channels = `${BaseUrl}/channels/get`

    function fetchData(url) {
        // Fetch data from the provided URL
        return $.get(url)
            .fail(error => {
                console.error('Error fetching data:', error);
            });
    }
    // function convertToCSV(channelsData) {
    //     const channels = channelsData.channels;
    
    //     if (!channels || channels.length === 0) {
    //         console.error('No data to convert to CSV.');
    //         return '';
    //     }
    
    //     // Convert the data to CSV format
    //     const header = Object.keys(channels[0]).join(',');
    //     const rows = channels.map(channel => Object.values(channel).join(','));
    //     return `${header}\n${rows.join('\n')}`;
    // }
    function convertToCSV(data, prefix) {
        const exporter = data[prefix];
    
        if (!exporter || exporter.length === 0) {
            console.error('No data to convert to CSV.');
            return '';
        }
    
        // Convert the data to CSV format
        const header = Object.keys(exporter[0]).join(',');
        const rows = exporter.map(channel => Object.values(channel).join(','));
        return `${header}\n${rows.join('\n')}`;
    }
    
    function downloadCSV(data, filename) {
        // Create a Blob containing the CSV data
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });

        // Create a download link
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);

            // Set the download link attributes
            link.setAttribute('href', url);
            link.setAttribute('download', filename || 'data.csv');

            // Append the link to the document
            document.body.appendChild(link);

            // Trigger a click event on the link to start the download
            link.click();

            // Remove the link from the document
            document.body.removeChild(link);
        }
    }

    async function fetchDataAndDownload(url, prefix, filename) {
        try {

            const dataa = await fetchData(url);
            console.log(dataa)
            const csvData = convertToCSV(dataa, prefix);
            console.log(csvData)
            downloadCSV(csvData, filename);
        } catch (error) {
            console.error('Error fetching or processing data:', error);
        }
    }

    $('#exInUse').click(function () {
        console.log("clicked exInUse export");
        const inUse_url = `${BaseUrl}/piu/get/`;
        console.log(inUse_url);
        fetchDataAndDownload(inUse_url, 'piu', 'In_Use_data.csv');
    });
    $('#exchannel').click(function () {
        console.log("clicked exchannel export");
        const channels_url = `${BaseUrl}/channels/get/`;
        console.log(channels_url);
        fetchDataAndDownload(channels_url, 'channels', 'Channel_data.csv');
    });
    $('#exInVen').click(function () {
        console.log("clicked exInVen export");
        const InVen_url = `${BaseUrl}/items/get/`;
        console.log(InVen_url);
        fetchDataAndDownload(InVen_url, 'items', 'Inventory_data.csv');
    });

});
