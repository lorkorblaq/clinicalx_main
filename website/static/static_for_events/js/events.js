$(function() {
    // BaseUrl = "https://labpal.com.ng/api";
    BaseUrl = "http://127.0.0.1:3000/api";
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
    

    const user_id = getCookie('user_id');
    const url_event_push = `${BaseUrl}/event/push/${user_id}/`;
    const url_event_put = `${BaseUrl}/event/put/${user_id}/`;
    const url_event_get_one = `${BaseUrl}/event/get/${user_id}/`;
    const url_event_get_all = `${BaseUrl}/events/get/${user_id}/`;
    const url_event_del = `${BaseUrl}/event/del/${user_id}/`;
    const url_event_todo_push = `${BaseUrl}/event/to-do-push/${user_id}/`;
    const url_event_todo_get_one = `${BaseUrl}/event/to-do-get/${user_id}/`;
    const url_event_todo_get_all = `${BaseUrl}/event/to-do-get-all/${user_id}/`;



    // nav buttons 
    $('.nav-link').on('click', function() {
        // Remove 'active' class from all links
        $('.nav-link').removeClass('active');

        // Add 'active' class to the clicked link
        $(this).addClass('active');
    });
    // nav corresponding divs
    $('.events').first().addClass('active');
    $('.nav-link').first().addClass('active');

    $('.nav-link').on('click', function(){
        // Remove active class from all nav links and event divs
        $('.nav-link').removeClass('active');
        $('.events').removeClass('active');

        // Add active class to the clicked nav link
        $(this).addClass('active');

        // Get the target event div ID
        var target = $(this).data('target');

        // Show the corresponding event div
        $(target).addClass('active');
    });

    // date picker 
    $('.datePicker').datepicker({
        dateFormat: 'yy-mm-dd', // Year first format
    });
    // time picker
    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    var formattedTime = currentHours + ':' + (currentMinutes < 10 ? '0' + currentMinutes : currentMinutes);
     $('#timepicker-machine').timepicker({
        timeFormat: 'hh:mm p',   // 24-hour format with AM/PM
        interval: 1,            // 30-minute increments
        minTime: '00:00am',      // Earliest time 10:00 AM
        maxTime: '11:59pm',       // Latest time 6:00 PM
        defaultTime: formattedTime,  // Default time 11:00 AM
        dynamic: true,           // Dynamic input updating
        dropdown: true,          // Show dropdown
        scrollbar: true,         // Show scrollbar if needed
        zindex: 10,            // z-index of the dropdown
        disableTextInput: false, // Allow manual input
        step: 15,                // Step size for arrow keys
        className: 'custom-timepicker', // Custom class name
        closeOnWindowScroll: true, // Close on window scroll
        appendTo: 'body',         // Append to body
        show2400: false   
    });


    // modal logic
    var modal = $('#myModal');

    // When the user clicks the button, open the modal
    $('#createButton').on('click', function() {
        modal.show();
    });

    // When the user clicks on <span> (x) or the Close button, close the modal
    $('.close').on('click', function() {
        modal.hide();
        $('.modal-content').hide();
        $('.modal-content').first().show(); // Show the main modal content
    });

    // When the user clicks anywhere outside of the modal, close it
    $(window).on('click', function(event) {
        if ($(event.target).is(modal)) {
            modal.hide();
            $('.modal-content').hide();
            $('.modal-content').first().show(); // Show the main modal content
        }
    });

    // Show corresponding additional content on tool click
    $('.tool').on('click', function() {
        var toolId = $(this).attr('id');
        $('.modal-content').hide();
        $('#additionalContent' + toolId.replace('tool', '')).show();
    });

    // Back button logic to return to the main modal content
    $('.back').on('click', function() {
        $('.modal-content').hide();
        $('.modal-content').first().show();
    });
    
    // tags & tagger for modals
    handleTagInput($('#QCtags'), $('#qcTagger'));
    handleTagInput($('#OperationsTags'), $('#operationsTagger'));

    //tag handler 
    function handleTagInput($input, tagContainer) {
        $input.on('keydown', function(event) {
            if (event.key === ',' || event.key === 'Enter') {
                event.preventDefault();
                var tagText = $input.val().trim();
                if (tagText) {
                    createTag(tagText, tagContainer);
                    $input.val('');
                }
            }
        });
    }

    // tag creator
    function createTag(tagText, tagContainer) {
        var $tag = $('<div class="tag"></div>');
        var $tagContent = $('<span></span>').text(tagText);
        var $tagClose = $('<span class="close">&times;</span>').on('click', function() {
            $tag.remove();
        });
        $tag.append($tagContent).append($tagClose);
        tagContainer.append($tag);
    }

    // maintainance tab on the page
    $('#maintenance-tab').on('click', function() {
        $('#maintenance-content').show();
        $('#downtimes-content').hide();
        $('#troubleshooting-content').hide();
        $(this).addClass('active');
        $('#downtimes-tab').removeClass('active');
        $('#troubleshooting-tab').removeClass('active');
    });
    // downtimes tab on the page
    $('#downtimes-tab').on('click', function() {
        $('#maintenance-content').hide();
        $('#downtimes-content').show();
        $('#troubleshooting-content').hide();
        $(this).addClass('active');
        $('#maintenance-tab').removeClass('active');
        $('#troubleshooting-tab').removeClass('active');
    });
    // troubleshooting tab on the page
    $('#troubleshooting-tab').on('click', function() {
        $('#maintenance-content').hide();
        $('#downtimes-content').hide();
        $('#troubleshooting-content').show();
        $(this).addClass('active');
        $('#maintenance-tab').removeClass('active');
        $('#downtimes-tab').removeClass('active');
    });

    // tag logic for machine modal
    $('.option-button').on('click', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const value = $(this).data('value');
        const tag = $('<span class="tag">' + value + '<span class="remove-tag">&times;</span></span>');
        
        $('#frequencyTagger').append(tag);
 
        // Remove the tag when the remove icon is clicked
        tag.find('.remove-tag').on('click', function() {
            $(this).parent().fadeOut(300, function() {
                $(this).remove();
            });
        });

    });


    // logic for the to-do modal
    const $todoInput = $('#new-todo');
    const $addTodoButton = $('#add-todo');
    const $todoList = $('#todo-list');


    //QC submit button
    $('#submit-qc').on('click', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        const qcData = [];
        const datePickerValue = $('#datePicker-qc').val();
        let tagsEntered = false; // Flag to check if at least one tag is entered

        if (datePickerValue !== '') {
            qcData.push(datePickerValue);
        } else {
            alert('Please select a date');
        }
        machine = $('#machineIndicatorQC').val();
        qcData.push(machine);
        // $('#qcTagger .tag span').each(function() {
        //     qcData.push($(this).text());
        // });

        $('#qcTagger .tag span').each(function() {
            const text = $(this).text().trim();
            
            if (text !== '') {
                qcData.push(text);
                tagsEntered = true; // Set flag to true if at least one tag is entered
            }
        });
    
        if (!tagsEntered) {
            alert('Please enter at least one tag');
            return; // Exit function if no tags are entered
        }

        var RCQC = $('#RCQC').val();
        qcData.push(RCQC);
        var CAQC = $('#CAQC').val();
        qcData.push(CAQC);
        const filteredQC = qcData.filter(item => item !== '×');
        console.log(filteredQC)
        data = {
            'date': filteredQC[0],
            'machine': filteredQC[1],
            'items': filteredQC.slice(2, filteredQC.length -2),
            'rootCause': filteredQC[filteredQC.length -2],
            'actioning': filteredQC[filteredQC.length -1]
        }
        console.log(data);
        url = url_event_push + 'qc/';
        postSubmitsToApi(url, data);
    });

    // machine submit button
    $('#submit-machine').on('click', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
    
        const machineData = [];
        const machineMaintenanceData = [];
        const category = [];
    
        // Validate and collect date and time
        var datePickerValue = $('#datePicker-machine').val();
        var time = $('#timepicker-machine').val();
        if (datePickerValue === '' || time === '') {
            alert('Please select a date and time');
            return;
        }
        // var dateTime = `${datePickerValue} ${time}`;
        machineData.push(datePickerValue);
        machineData.push(time);
    
        // Validate and collect machine information
        var machine = $('#machineIndicator').val();
        if (machine === null) {
            alert('Please select a machine');
            return;
        }
        machineData.push(machine);
    
        // Determine active menu item and handle form submission accordingly
        var activeMenuItem = $('.menu-item.active');
        var activeMenuId = activeMenuItem.attr('id');
        switch (activeMenuId) {
            case 'maintenance-tab':
                handleMaintenanceFormSubmission();
                break;
            case 'downtimes-tab':
                handleDowntimesFormSubmission();
                break;
            case 'troubleshooting-tab':
                handleTroubleshootingFormSubmission();
                break;
            default:
                console.log('No active content found');
        }
    
        // Function to handle maintenance form submission
        function handleMaintenanceFormSubmission() {
            let tagsEntered = false; // Flag to check if at least one tag is entered
            $('#frequencyTagger .tag').each(function() {
                var tagText = $(this).text().trim();
                
                console.log(tagText);
                if (tagText.endsWith('×')) {
                    tagText = tagText.slice(0, -1); // Remove '×' from the end
                    tagsEntered = true;
                }
                category.push(tagText);
            });
        
            if (!tagsEntered) {
                alert('Please enter at least one tag');
                return; // Exit function if no tags are entered
            }
            
    
            var comments = $('#commentsMaint').val();
            machineMaintenanceData.push(category);
            machineMaintenanceData.push(comments);
            machineData.push(machineMaintenanceData);
    
            var data = {
                'date': machineData[0],
                'time': machineData[1],
                'machine': machineData[2],
                'category': 'Maintenance', // Fixed category for maintenance
                'frequency': machineMaintenanceData[0], // Frequency array without '×'
                'comments': machineMaintenanceData[1]
            };
    
            console.log(data);
            var url = url_event_push + 'machine/';
            postSubmitsToApi(url, data);
        }
    
        // Function to handle downtimes form submission
        function handleDowntimesFormSubmission() {
            var resolved = $('#downtimes-content input[type="checkbox"]').prop('checked');
            var RCdowntime = $('#RCdowntime').val();
            var CAdowntime = $('#CAdowntime').val();
    
            machineData.push(resolved);
            machineData.push(RCdowntime);
            machineData.push(CAdowntime);
    
            var data = {
                'date': machineData[0],
                'time': machineData[1],
                'machine': machineData[2],
                'category': 'Downtime', // Fixed category for downtimes
                'resolved': resolved,
                'rootCause': RCdowntime,
                'actioning': CAdowntime
            };
    
            console.log(data);
            var url = url_event_push + 'machine/';
            postSubmitsToApi(url, data);
        }
    
        // Function to handle troubleshooting form submission
        function handleTroubleshootingFormSubmission() {
            var resolved = $('#troubleshooting-content input[type="checkbox"]').prop('checked');
            var RCtroubleshooting = $('#RCtroubleshooting').val();
            var CAtroubleshooting = $('#CAtroubleshooting').val();
    
            machineData.push(resolved);
            machineData.push(RCtroubleshooting);
            machineData.push(CAtroubleshooting);
    
            var data = {
                'date': machineData[0],
                'time': machineData[1],
                'machine': machineData[2],
                'category': 'Troubleshooting', // Fixed category for troubleshooting
                'resolved': resolved,
                'rootCause': RCtroubleshooting,
                'actioning': CAtroubleshooting
            };
    
            console.log(data);
            var url = url_event_push + 'machine/';
            postSubmitsToApi(url, data);
        }
    
    });
    
    // Function to post data to API
    function postSubmitsToApi(url, data) {
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                console.log('Data successfully submitted:', response);
                // Handle success scenario as needed
            },
            error: function(error) {
                console.error('Error submitting data:', error);
                alert('Error submitting data. Please try again later.');
            }
        });
    }
    

    //operations submit button 
    $('#submit-operations').on('click', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        const datePickerValue = $('#datePicker-operations').val();
        const operationsData = [];
        let tagsEntered = false; // Flag to check if at least one tag is entered
        if (datePickerValue !== '') {
            operationsData.push(datePickerValue);
        } else {
            alert('Please select a date');
        }

        // Collect tags from #operationsTagger .tag span
        $('#operationsTagger .tag span').each(function() {
            const text = $(this).text().trim();
            
            if (text !== '') {
                operationsData.push(text);
                tagsEntered = true; // Set flag to true if at least one tag is entered
            }
        });
    
        if (!tagsEntered) {
            alert('Please enter at least one tag');
            return; // Exit function if no tags are entered
        }
        OPearationsActioning =   $('#CAoperations').val();
        operationsData.push(OPearationsActioning);
        const filteredOperations = operationsData.filter(item => item !== '×');
        
        const data = {
            'date': filteredOperations[0],
            'occurrence': filteredOperations.slice(1, filteredOperations.length -1), // Send all tasks as an array
            'actioning': filteredOperations[filteredOperations.length - 1]};
        console.log(filteredOperations);
        url = url_event_push+'operations/';
        postSubmitsToApi(url, data);
    });

    // to-do submit button
    $('#submit-todo').on('click', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        const todoText = $todoInput.val().trim();
        const allTodos = [];
        const datePickerValue = $('#datePicker-todo').val();
        if (datePickerValue !== '') {
            allTodos.push(datePickerValue);
        } else {
            alert('Please select a date');
        }
        // Add the new todo if it's not empty
        if (todoText !== '') {
            allTodos.push(todoText);
        } else if ($todoList.find('li').length !== 0) {
            $todoList.find('li span').each(function() {
                allTodos.push($(this).text());
            });
        } else {
            alert('Please add a task');
            return;
        }
        // Collect all existing todos from the list
        // $todoList.find('li span').each(function() {
        //     allTodos.push($(this).text());
        // });

        // console.log(allTodos[0]);
        const data = {
            'date': allTodos[0],
            'task': allTodos.slice(1) // Send all tasks as an array
        };
        url = url_event_todo_push;
        postSubmitsToApi(url, data);
    });

    // Function to post data to an API
    function postSubmitsToApi(url, data) {
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                alert(response.message);                
                console.log('Data successfully posted:', response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Check if the responseJSON exists and has a message property
                const errorMessage = jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : 'An error occurred';
                alert(`${errorMessage}`);
                console.error('Error posting data:', jqXHR, textStatus, errorThrown);
            }
        });
    }
    // var activevents = $('.nav-link.active');
    // var activevent = activevents.attr('id');
    // console.log(activevent)
    // Get all events
    $('.nav-link').click(function() {
        var activevent = $(this).attr('id'); // Get the id of the clicked link
        console.log('Active event:', activevent);

        switch (activevent) {
            case 'qc-btn':
                fetchEvents('qc');
                break;
            case 'machine-btn':
                fetchEvents('machine');
                break;
            case 'operations-btn':
                fetchEvents('operations');
                break;
            default:
                // console.log('No active content found');
        }
    });


    // function displayEvents(events) {
    //     const eventContainer = $('#eventContainer');
    //     eventContainer.empty(); // Clear existing events

    //     events.forEach(event => {
    //         const card = $('<div>').addClass('card');
    //         const user = $('<h2>').text(`User: ${event.user}`);
    //         const eventType = $('<p>').text(`Event Type: ${event.event_type}`);
    //         const createdAt = $('<p>').text(`Created At: ${new Date(event.created_at).toLocaleString()}`);
            
    //         card.append(user, eventType, createdAt);

    //         if (event.event_type === 'qc') {
    //             card.append(
    //                 $('<p>').text(`Date: ${new Date(event.date).toLocaleDateString()}`),
    //                 $('<p>').text(`Machine: ${event.machine}`),
    //                 $('<p>').text(`Items: ${event.items}`),
    //                 $('<p>').text(`Root Cause: ${event.rootCause}`),
    //                 $('<p>').text(`Actioning: ${event.actioning}`)
    //             );
    //         } else if (event.event_type === 'machine') {
    //             card.append(
    //                 $('<p>').text(`Datetime: ${new Date(event.datetime).toLocaleString()}`),
    //                 $('<p>').text(`Machine: ${event.machine}`),
    //                 $('<p>').text(`Category: ${event.category}`)
    //             );

    //             if (event.category === 'maintenance') {
    //                 card.append(
    //                     $('<p>').text(`Frequency: ${event.frequency}`),
    //                     $('<p>').text(`Comments: ${event.comments}`)
    //                 );
    //             } else {
    //                 card.append(
    //                     $('<p>').text(`Resolved: ${event.resolved}`),
    //                     $('<p>').text(`Root Cause: ${event.rootCause}`),
    //                     $('<p>').text(`Actioning: ${event.actioning}`)
    //                 );
    //             }
    //         } else if (event.event_type === 'operations') {
    //             card.append(
    //                 $('<p>').text(`Date: ${new Date(event.date).toLocaleDateString()}`),
    //                 $('<p>').text(`Occurrence: ${event.occurrence}`),
    //                 $('<p>').text(`Actioning: ${event.actioning}`)
    //             );
    //         }

    //         eventContainer.append(card);
    //     });
    // }
    fetchEvents('qc'); // Example default event type to load initially


    // Function to create a card dynamically based on event data
    function createCard(eventData) {
        // Construct the card HTML
        var card = $('<div>').addClass('card');
        var cardHeader = $('<div>').addClass('card-header');
    
        // Customize card header based on event type
        var formattedEventDate = '';
        var options = {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false, // Ensure 24-hour format
            // timeZone: 'Africa/Lagos', // Adjust to your specific timezone (West Africa Standard Time)
            timeZoneOffset: -120
        };
    
        if (eventData.event_type === 'qc' || eventData.event_type === 'operations') {
            formattedEventDate = new Date(eventData.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } else if (eventData.event_type === 'machine') {
            formattedEventDate = new Date(eventData.datetime).toLocaleString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: false
            });
        }
    
        cardHeader.text(`${formattedEventDate} - ${eventData.user}`);
    
        var cardBody = $('<div>').addClass('card-body');
    
        // Customize card body based on event type
        if (eventData.event_type === 'qc') {
            var itemsTag = eventData.items.join(', '); // Join array elements with ', ' separator
    
            cardBody.append(
                $('<p>').text(`Machine: ${eventData.machine}`),
                $('<p>').text(`Items: ${itemsTag}`),
                $('<p>').text(`Root Cause: ${eventData.rootCause}`),
                $('<p>').text(`Actioning: ${eventData.actioning}`)
            );
        } else if (eventData.event_type === 'machine') {
            cardBody.append(
                $('<p>').text(`Machine: ${eventData.machine}`),
                $('<p>').text(`Category: ${eventData.category}`)
            );
    
            if (eventData.category === 'Maintenance') {
                if (eventData.frequency && eventData.frequency.length > 0) {
                    var frequencyText = eventData.frequency.join(', '); // Join array elements with ', ' separator
                    cardBody.append(
                        $('<p>').text(`Frequency: ${frequencyText}`)
                    );
                }
    
                cardBody.append(
                    $('<p>').text(`Comments: ${eventData.comments}`)
                );
            } else {
                cardBody.append(
                    $('<p>').text(`Resolved: ${eventData.resolved}`),
                    $('<p>').text(`Root Cause: ${eventData.rootCause}`),
                    $('<p>').text(`Actioning: ${eventData.actioning}`)
                );
            }
        } else if (eventData.event_type === 'operations') {
            var occurrenceTag = eventData.occurrence.join(', '); // Join array elements with ', ' separator
            cardBody.append(
                $('<p>').text(`Occurrence: ${occurrenceTag}`),
                $('<p>').text(`Actioning: ${eventData.actioning}`)
            );
        } else {
            cardBody.append(
                $('<p>').text(`Details for other event types...`)
            );
        }
    
        // Append header and body to the card
        card.append(cardHeader, cardBody);
    
        return card;
    }
    
    // Example default event type to load initially

    // Function to fetch events from API
    function fetchEvents(eventType) {
        var url = url_event_get_all + eventType + '/';
        console.log(eventType);
        $.ajax({
            type: 'GET',
            url: url, // Replace with your actual API URL
            success: function(response) {
                console.log('Data successfully fetched:', response);
                displayEventCards(response);
            },
            error: function(error) {
                console.error('Error fetching data:', error);
                alert('Error fetching data. Please try again later.');
            }
        });
    }

    // Function to display events in the UI
    function displayEventCards(events) {
        const eventContainer = $('.eventContainer');
        eventContainer.empty(); // Clear existing cards
    
        // Sort events array in ascending order based on date and time
        events.sort((a, b) => {
            // Convert dates to Date objects
            const dateA = new Date(a.datetime || a.date); // Use datetime if available, otherwise use date
            const dateB = new Date(b.datetime || b.date);
    
            // Sort in descending order (latest date/time first)
            return dateB - dateA;
        });
    
        events.forEach(eventData => {
            var card = createCard(eventData);
            eventContainer.append(card); // Append card to display in ascending order
        });
    }
    



    // Function to fetch all to-do events for a user
    function fetchAllToDoEvents(user_id) {

        $.ajax({
            type: 'GET',
            url: url_event_todo_get_all,
            success: function(response) {
                displayToDoEvents(response);
            },
            error: function(error) {
                console.error('Error fetching to-do events:', error);
                alert('Error fetching to-do events. Please try again later.');
            }
        });
    }

    // Function to display fetched to-do events
    function displayToDoEvents(events) {
        const todoContainer = $('#todoContainer');
        todoContainer.empty(); // Clear existing content

        events.forEach(todo => {
            const card = $('<div>').addClass('card mb-3');
            const cardHeader = $('<div>').addClass('card-header').text(todo.date);
            const cardBody = $('<div>').addClass('card-body');
            const ul = $('<ul>').addClass('list-group sortable').attr('id', `checklist-${todo.date}`);

            todo.tasks.forEach(task => {
                const li = $('<li>').addClass('list-group-item checklist-item');
                li.append(
                    $('<span>').text(task),
                    $('<div>').addClass('checklist-actions').append(
                        $('<button>').addClass('edit-btn').text('✏️'),
                        $('<button>').addClass('delete-btn').text('🗑️')
                    )
                );
                ul.append(li);
            });

            cardBody.append(ul);
            card.append(cardHeader, cardBody);
            todoContainer.append(card);
        });
    }

    // Example: Fetch to-do events for user with ID 'user123'
    fetchAllToDoEvents(user_id);










        // Function to render to-do items
    function renderTodoItem(todoText) {
        const $li = $('<li class="list-group-item checklist-item"></li>').html(`
            <span>${todoText}</span>
            <div class="checklist-actions">
                <button class="btn btn-sm btn-warning edit-btn">✏️</button>
                <button class="btn btn-sm btn-danger delete-btn">🗑️</button>
            </div>
        `);
        return $li;
    }

    // Function to handle adding a new to-do item
    function addTodoItem(todoText) {
        const $todoItem = renderTodoItem(todoText);
        $todoList.append($todoItem);
    }

    // Function to handle editing a to-do item
    function editTodoItem(todoItem, newText) {
        const $todoItem = $(todoItem).closest('.checklist-item').find('span');
        $todoItem.text(newText);
    }

    // Function to handle deleting a to-do item
    function deleteTodoItem(todoItem) {
        const $parent = $(todoItem).closest('.checklist-item');
        $parent.remove();
        // Check if parent list is empty after deletion
        if ($parent.siblings('.checklist-item').length === 0) {
            $parent.closest('.card').remove();
        }
    }

    // Event listener for adding a new to-do item
    $addTodoButton.on('click', function(event) {
        event.preventDefault();
        const todoText = $todoInput.val().trim();
        if (todoText !== '') {
            addTodoItem(todoText);
            $todoInput.val('');
        }
    });

    // Event listener for Enter key press in input field
    $todoInput.on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            const todoText = $todoInput.val().trim();
            if (todoText !== '') {
                addTodoItem(todoText);
                $todoInput.val('');
            }
        }
    });

    // Event listener for editing a to-do item
    $(document).on('click', '.edit-btn', function() {
        const taskSpan = $(this).closest('.checklist-item').find('span');
        const newText = prompt('Edit your task', taskSpan.text());
        if (newText !== null && newText.trim() !== '') {
            editTodoItem(this, newText.trim());
        }
    });

    // Event listener for deleting a to-do item
    $(document).on('click', '.delete-btn', function() {
        const confirmed = confirm("Are you sure you want to delete this task?");
        if (confirmed) {
            deleteTodoItem(this);
        }
    });

    // Make the lists sortable and connect them
    // Initialize sortable on document ready
    $('.sortable').sortable({
        connectWith: '.sortable',
        placeholder: 'sortable-placeholder',
        start: function(event, ui) {
            const item = ui.item;
            const parent = item.parent();

            // Check if it is the last item in the list
            if (parent.children('.checklist-item').length === 1 && !parent.data('delete-confirmed')) {
                const confirmed = confirm("You are about to move the last checklist item. This card will be deleted.");
                if (!confirmed) {
                    $(this).sortable('cancel');
                } else {
                    // Mark the parent to be deleted after the move
                    parent.data('delete-confirmed', true);
                }
            }
        },
        stop: function(event, ui) {
            const item = ui.item;
            const previousParent = item.data('previousParent');

            // Remove the card if the last item was moved and confirmation was given
            if (previousParent && previousParent.data('delete-confirmed')) {
                previousParent.closest('.card').remove();
            }

            // Clean up data attribute to allow further deletion without prompt
            if (previousParent) {
                previousParent.removeData('delete-confirmed');
            }

            // Remove the temporary storage of previous parent
            item.removeData('previousParent');
        },
        receive: function(event, ui) {
            const item = ui.item;
            item.data('previousParent', ui.sender);
        }
    }).disableSelection();




















    // Add todo on button click
    // $addTodoButton.on('click', function(event) {
    //     event.preventDefault(); // Prevent default form submission behavior
    //     addTodo();
    // });

    // $todoInput.on('keypress', function(e) {
    //     if (e.which === 13) {
    //         e.preventDefault(); // Prevent default form submission behavior on Enter key
    //         addTodo();
    //     }
    // });
    // // adding todo function
    // function addTodo() {
    //     const todoText = $todoInput.val().trim();
    //     if (todoText === '') return;

    //     const $li = $('<li></li>').html(`
    //         <span>${todoText}</span>
    //         <div class="todo-actions">
    //             <button onclick="editTodoItem(this)">✏️</button>
    //             <button onclick="deleteTodoItem(this)">🗑️</button>
    //         </div>
    //     `);
    //     $todoList.append($li);
    //     $todoInput.val('');
    // }
    // // edit and delete todo
    // window.editTodoItem = function(button) {
    //     const $todoItem = $(button).parent().prev();
    //     const newText = prompt('Edit your task', $todoItem.text());
    //     if (newText !== null) {
    //         $todoItem.text(newText);
    //     }
    // };

    // window.deleteTodoItem = function(button) {
    //     $(button).closest('li').remove();
    // };
    // // to do card display
    // // Make the lists sortable and connect them
    // $('.sortable').sortable({
    //     connectWith: '.sortable',
    //     placeholder: 'sortable-placeholder',
    //     start: function(event, ui) {
    //         const item = ui.item;
    //         const parent = item.parent();
    
    //         // Check if it is the last item in the list
    //         if (parent.children('.checklist-item').length === 1 && !parent.data('delete-confirmed')) {
    //             const confirmed = confirm("You are about to move the last checklist item. This card will be deleted.");
    //             if (!confirmed) {
    //                 $(this).sortable('cancel');
    //             } else {
    //                 // Mark the parent to be deleted after the move
    //                 parent.data('delete-confirmed', true);
    //             }
    //         }
    //     },
    //     stop: function(event, ui) {
    //         const item = ui.item;
    //         const previousParent = item.data('previousParent');
    
    //         // Remove the card if the last item was moved and confirmation was given
    //         if (previousParent && previousParent.data('delete-confirmed')) {
    //             previousParent.closest('.card').remove();
    //         }
    
    //         // Clean up data attribute to allow further deletion without prompt
    //         if (previousParent) {
    //             previousParent.removeData('delete-confirmed');
    //         }
    
    //         // Remove the temporary storage of previous parent
    //         item.removeData('previousParent');
    //     },
    //     receive: function(event, ui) {
    //         const item = ui.item;
    //         item.data('previousParent', ui.sender);
    //     }
    // }).disableSelection();
        
    
    // // Edit item in checklist
    // $(document).on('click', '.edit-btn', function() {
    //     const taskSpan = $(this).closest('.checklist-item').find('span');
    //     const newText = prompt('Edit your task', taskSpan.text());
    //     if (newText !== null) {
    //         taskSpan.text(newText);
    //     }
    // });
    
    // // Delete item from checklist
    // $(document).on('click', '.delete-btn', function() {
    //     const item = $(this).closest('.checklist-item');
    //     const parent = item.parent();
    
    //     item.remove();
    
    //     // If the parent list is empty after deletion, remove the card
    //     if (parent.children('.checklist-item').length === 0) {
    //         parent.closest('.card').remove();
    //     }
    // });
    
});
