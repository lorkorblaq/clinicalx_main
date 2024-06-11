$(function () {
    console.log("user-profile.js loaded");
    // Baseurl= 'http://13.53.70.208:3000/api'
    BaseUrl = "https://labpal.com.ng/api";

    function setCookie(name, value, hours) {
        var expires = "";
        var sameSite = document.location.protocol === 'https:' ? "; SameSite=None" : "";
        
        if (hours) {
            var date = new Date();
            date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
    
        document.cookie = name + "=" + encodeURIComponent(value) + expires + sameSite + "; path=/";
    }
    
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
    const userUrl = `${BaseUrl}/user/get/${user_id}/`
    const put_url = `${BaseUrl}/user/put/${user_id}/`;
    // const url_item_get = `${BaseUrl}/user/put/`;
    // const url_item_put = `${BaseUrl}/item/put/`;
    $.get(userUrl, function(userData) {
        // Access the user data and update the HTML content
        const userDataContainer = $('#userContainer'); // Updated ID to match the HTML
        
        // Update specific elements with user data
        const userName = userData.firstname + ' ' + userData.lastname;
        userDataContainer.find('#name').text(userName);
        userDataContainer.find('.title').text(userData.title);
        userDataContainer.find('#org').text(userData.org);
        userDataContainer.find('#firstName').text(userData.firstname);
        userDataContainer.find('#lastName').text(userData.lastname);
        userDataContainer.find('#emailAddr').text(userData.email);   
        userDataContainer.find('#mobileNumb').text(userData.mobile); 
        userDataContainer.find('#address').text(userData.address);   
  

    })
    .fail(function(error) {
        console.error('Error fetching user data:', error);
    });
    

    $('#editButton').click(function () {
        console.log("edit button clicked");

        $('.text-secondary').each(function () {
            $('#saveButton').show()
            $('#editButton').hide()
            var content = $(this).text().trim();
            $(this).empty().append($('<input>', { type: 'text', value: content, class:'form-control profile_input' }));
        });
    });
    $('#saveButton').click(function() {
        console.log('savebutton clicked');
        $('')
        var contents = [];
        $('.text-secondary').each(function() {
            var content = $(this).find('input').val();
            contents.push(content);
            $(this).empty().text(content);
        });
        var datas = {
            firstname: contents[0],
            lastname: contents[1],
            title: contents[2],
            email: contents[3],
            mobile: contents[4],
            address: contents[5]
        };
        console.log(datas);
        var jsonString = JSON.stringify(datas);
        $.ajax({
            url: put_url,
            type: 'PUT',
            data: jsonString,
            contentType: 'application/json',            
            success: function(response) {
                for (var key in datas) {
                    if (datas.hasOwnProperty(key)) {
                        setCookie(key, datas[key], 1);  // Set each cookie with a 7-day expiration (adjust as needed)
                    }
                }                
            },
            error: function(error) {
                // Handle error here
                console.error(error);
            }
        });
        $('#saveButton').hide();
        $('#editButton').show();
    });
});
