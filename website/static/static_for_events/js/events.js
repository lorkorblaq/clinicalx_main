$(function() {
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
        dateFormat: 'yy/mm/dd', // Year first format
    });
    // time picker
    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    var formattedTime = currentHours + ':' + (currentMinutes < 10 ? '0' + currentMinutes : currentMinutes);
     $('#timepicker-machine').timepicker({
        timeFormat: 'HH:mm p',   // 24-hour format with AM/PM
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
        if (datePickerValue !== '') {
            qcData.push(datePickerValue);
        } else {
            alert('Please select a date');
        }
        machine = $('#machineIndicatorQC').val();
        qcData.push(machine);
        $('#qcTagger .tag span').each(function() {
            qcData.push($(this).text());
        });
        var RCQC = $('#RCQC').val();
        qcData.push(RCQC);
        var CAQC = $('#CAQC').val();
        qcData.push(CAQC);
        const filteredQC = qcData.filter(item => item !== '×');
        console.log(filteredQC)
    });

    // machine submit button
    $('#submit-machine').on('click', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        const machineData = [];
        const machineMaintainceData = [];
        const machineDowntimeData = [];
        const machineTroubleshootingData = [];

        var category = [];

        var datePickerValue = $('#datePicker-machine').val();
        if (datePickerValue !== '') {
            machineData.push(datePickerValue);
        } else {
            alert('Please select a date');
        }
        var time = $('#timepicker-machine').val();
        machineData.push(time);

        var machine = $('#machineIndicator').val();
        if (machine !== '') {
            machineData.push(machine);
        } else {
            alert('Please select a machine');
        }
        var activeMenuItem = $('.menu-item.active');
        var activeMenuItemText = activeMenuItem.text();
        machineData.push(activeMenuItemText);

        var activeMenuId = activeMenuItem.attr('id');
        console.log(activeMenuId);
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
        function handleMaintenanceFormSubmission() {
            $('#frequencyTagger .tag').each(function() {
                category.push($(this).text());
            });
            machineMaintainceData.push(category);
            var comments = $('#commentsMaint').val();
            machineData.push(machineMaintainceData);
            machineData.push(comments);
            console.log(machineData);

        };
        function handleDowntimesFormSubmission() {
            var resolved = $('#downtimes-content input[type="checkbox"]').prop('checked');
            machineData.push(resolved);
            var RCdowntime = $('#RCdowntime').val();
            machineData.push(RCdowntime);
            var CAdowntime = $('#CAdowntime').val();
            machineData.push(CAdowntime);
            // machineData.push(machineDowntimeData);
            console.log(machineData);
        };
        function handleTroubleshootingFormSubmission() {
            var resolved = $('#troubleshooting-content input[type="checkbox"]').prop('checked');
            machineData.push(resolved);
            var RCtroubleshooting = $('#RCtroubleshooting').val();
            machineData.push(RCtroubleshooting);
            var CAtroubleshooting = $('#CAtroubleshooting').val();
            machineData.push(CAtroubleshooting);
            console.log(machineData);

        };

    });

    //operations submit button 
    $('#submit-operations').on('click', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        const datePickerValue = $('#datePicker-operations').val();
        const operationsData = [];
        if (datePickerValue !== '') {
            operationsData.push(datePickerValue);
        } else {
            alert('Please select a date');
        }
        $('#operationsTagger .tag span').each(function() {
            operationsData.push($(this).text());
        });
        OPearationsActioning =   $('#CAoperations').val();
        operationsData.push(OPearationsActioning);
        const filteredOperations = operationsData.filter(item => item !== '×');
        console.log(filteredOperations);
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
        }
        // Collect all existing todos from the list
        $todoList.find('li span').each(function() {
            allTodos.push($(this).text());
        });

        console.log(allTodos);
        postSubmitsToApi()
    });

    // Function to post data to an API
    function postSubmitsToApi(url, data) {
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                console.log('Data successfully posted:', response);
            },
            error: function(error) {
                console.error('Error posting data:', error);
            }
        });
    }


    // Add todo on button click
    $addTodoButton.on('click', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        addTodo();
    });

    $todoInput.on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault(); // Prevent default form submission behavior on Enter key
            addTodo();
        }
    });
    // adding todo function
    function addTodo() {
        const todoText = $todoInput.val().trim();
        if (todoText === '') return;

        const $li = $('<li></li>').html(`
            <span>${todoText}</span>
            <div class="todo-actions">
                <button onclick="editTodoItem(this)">✏️</button>
                <button onclick="deleteTodoItem(this)">🗑️</button>
            </div>
        `);
        $todoList.append($li);
        $todoInput.val('');
    }
    // edit and delete todo
    window.editTodoItem = function(button) {
        const $todoItem = $(button).parent().prev();
        const newText = prompt('Edit your task', $todoItem.text());
        if (newText !== null) {
            $todoItem.text(newText);
        }
    };

    window.deleteTodoItem = function(button) {
        $(button).closest('li').remove();
    };
    // to do card display
    // Make the lists sortable and connect them
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
        
    
    // Edit item in checklist
    $(document).on('click', '.edit-btn', function() {
        const taskSpan = $(this).closest('.checklist-item').find('span');
        const newText = prompt('Edit your task', taskSpan.text());
        if (newText !== null) {
            taskSpan.text(newText);
        }
    });
    
    // Delete item from checklist
    $(document).on('click', '.delete-btn', function() {
        const item = $(this).closest('.checklist-item');
        const parent = item.parent();
    
        item.remove();
    
        // If the parent list is empty after deletion, remove the card
        if (parent.children('.checklist-item').length === 0) {
            parent.closest('.card').remove();
        }
    });
    
});
