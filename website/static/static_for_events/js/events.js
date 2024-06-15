$(document).ready(function() {
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
        format: 'yyyy/mm/dd',
        autoclose: true,
        todayHighlight: true
    });

    // time picker
    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    var formattedTime = currentHours + ':' + (currentMinutes < 10 ? '0' + currentMinutes : currentMinutes);
     $('#timepicker').timepicker({
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
    
    var $tagContainer = $('#tag-container');
    var $tagInput = $('#tags');

    $tagInput.on('keydown', function(event) {
        if (event.key === ',' || event.key === 'Enter') {
            event.preventDefault();
            var tagText = $tagInput.val().trim();
            if (tagText) {
                createTag(tagText);
                $tagInput.val('');
            }
        }
    });

    function createTag(tagText) {
        var $tag = $('<div class="tag"></div>');
        var $tagContent = $('<span></span>').text(tagText);
        var $tagClose = $('<span class="close">&times;</span>').on('click', function() {
            $tag.remove();
        });

        $tag.append($tagContent).append($tagClose);
        $tagContainer.append($tag);
    }


    $('#maintenance-tab').on('click', function() {
        $('#maintenance-content').show();
        $('#downtimes-content').hide();
        $('#troubleshooting-content').hide();
        $(this).addClass('active');
        $('#downtimes-tab').removeClass('active');
        $('#troubleshooting-tab').removeClass('active');
    });
    
    $('#downtimes-tab').on('click', function() {
        $('#maintenance-content').hide();
        $('#downtimes-content').show();
        $('#troubleshooting-content').hide();
        $(this).addClass('active');
        $('#maintenance-tab').removeClass('active');
        $('#troubleshooting-tab').removeClass('active');
    });
    
    $('#troubleshooting-tab').on('click', function() {
        $('#maintenance-content').hide();
        $('#downtimes-content').hide();
        $('#troubleshooting-content').show();
        $(this).addClass('active');
        $('#maintenance-tab').removeClass('active');
        $('#downtimes-tab').removeClass('active');
    });











    $('.option-button').on('click', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const value = $(this).data('value');
        const tag = $('<span class="tag">' + value + '<span class="remove-tag">&times;</span></span>');
        
        $('.tag-container').append(tag);
 
        // Remove the tag when the remove icon is clicked
        tag.find('.remove-tag').on('click', function() {
            $(this).parent().fadeOut(300, function() {
                $(this).remove();
            });
        });

    }); 
    $('.textarea').on('keypress', function(event) {
        if (event.which === 13) { // Enter key
            event.preventDefault();
            const value = $(this).val();
            if (value) {
                const tag = $('<span class="tag">' + value + '<span class="remove-tag">&times;</span></span>');
                $(this).val('');
                $('.tag-container').append(tag);
                tag.hide().fadeIn(300);

                tag.find('.remove-tag').on('click', function() {
                    $(this).parent().fadeOut(300, function() {
                        $(this).remove();
                    });
                });
            }
        }
    });





    // todo js
    const $todoInput = $('#new-todo');
    const $addTodoButton = $('#add-todo');
    const $todoList = $('#todo-list');

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
    // / Add sortable functionality
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
    
    // Add item to checklist QC
    $('#add-item-QC').on('click', function() {
        const newItem = $(`
            <li class="list-group-item checklist-item">
                <span>New Task</span>
                <div class="checklist-actions">
                    <button class="btn btn-sm btn-warning edit-btn">✏️</button>
                    <button class="btn btn-sm btn-danger delete-btn">🗑️</button>
                </div>
            </li>
        `);
        $('#checklistQC').append(newItem);
    });
    
    // Add item to checklist Machine
    $('#add-item-Machine').on('click', function() {
        const newItem = $(`
            <li class="list-group-item checklist-item">
                <span>New Task</span>
                <div class="checklist-actions">
                    <button class="btn btn-sm btn-warning edit-btn">✏️</button>
                    <button class="btn btn-sm btn-danger delete-btn">🗑️</button>
                </div>
            </li>
        `);
        $('#checklistMachine').append(newItem);
    });
    
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
