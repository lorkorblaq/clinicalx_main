$(document).ready(function() {
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

    // Go back button logic
    $('#goBack').on('click', function() {
        alert('Go Back button clicked');
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
});
