/**
 * Created by max on 23.09.14.
 */

$(document).ready(function () {
    Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");


    $('#button-login').on('click', function () {


        var user = new Parse.User();
        user.set("username", $('#input-username').val());
        user.set("password", $('#input-passwort').val());

        user.signUp(null, {
            success: function (user) {
                alert("eingeloggt");
            },
            error: function (user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    });


});