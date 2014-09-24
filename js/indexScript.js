$(document).ready(function () {
    Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");

    checkIfUserLoggedIn();


    $('#submit-button').on('click', function () {
        saveNewPlayer();
    });

    $('#button-create-team').on('click', function () {
        saveNewTeam();
    });

    $(".login-form").submit(function (event) {
        event.preventDefault();
        login();
    });

    $('#button-logout').on('click', function () {
        Parse.User.logOut();

        var currentUser = Parse.User.current();
        checkIfUserLoggedIn();
    });

    $('#button-reset-pw').on('click', function () {
        Parse.User.requestPasswordReset($('#input-email-reset-pw').val(), {
            success: function () {
                // Password reset request was sent successfully
            },
            error: function (error) {
                // Show the error message somewhere
                alert("Error: " + error.code + " " + error.message);
            }
        });
    });

});

function checkIfUserLoggedIn() {
    var currentUser = Parse.User.current();
    if (currentUser) {
        $('#button-logout').show();
    } else {
        $('#button-logout').hide();
        $('.login-form').show();
    }
}


function saveUser(teamName, role, pw, email) {
    var user = new Parse.User();
    user.set("username", teamName + "_" + role);
    user.set("password", pw);
    user.set("email", email);
    user.set("teamname", teamName);

    user.signUp(null, {
        success: function (user) {
            alert("eingeloggt");
            $('#modal-create-team').foundation('reveal', 'close');
        },
        error: function (user, error) {
            // Show the error message somewhere and let the user try again.
            alert("Error: " + error.code + " " + error.message);
        }
    });

}

function saveNewTeam() {

//    //@todo: leerzeichenin teamname
//    var teamName = $('#input-team-name').val();
//    console.log(teamName);
//
//    var Tabelle = Parse.Object.extend("PW_" + teamName);
//    var team = new Tabelle();
//
//    team.set("adminPW", $('#input-admin-pw').val());
//    team.set("managerPW", $('#input-manager-pw').val());
//    team.set("playerPW", $('#input-player-pw').val());
//
//
//    team.save(null, {
//        success: function (team) {
//            // Execute any logic that should take place after the object is saved.
//            //@todo: super fancy teamerstellungsmeldung
//            alert('New object created with objectId: ' + team);
//        },
//        error: function (team, error) {
//            // Execute any logic that should take place if the save fails.
//            // error is a Parse.Error with an error code and message.
//            alert('Failed to create new object, with error code: ' + error.message);
//        }
//    });

    saveUser($('#input-team-name').val(), "admin", $('#input-admin-pw').val(), $('#input-admin-email').val());
    saveUser($('#input-team-name').val(), "manager", $('#input-manager-pw').val());
    saveUser($('#input-team-name').val(), "player", $('#input-player-pw').val());
}

function getRole() {
    if ($('#select-role option:selected').val() == 1) {
        var role = 'admin';
    } else if ($('#select-role option:selected').val() == 2) {
        var role = 'manager';
    } else {
        var role = 'player';
    }
    return role;
}
function login() {
    var teamName = $('#input-teamname-login').val();
    var username = teamName + "_" + getRole();
    var password = $('#input-password-login').val();
    Parse.User.logIn(username, password, {
        success: function (user) {
            $('.login-form').hide();
            checkIfUserLoggedIn();
            console.log(getRole());
            if (getRole() == "admin") {
                console.log("hierhierhier");
                window.location.href = 'trainer.html';
            } else if (getRole() == "manager") {
                window.location.href = 'manager.html'
            } else if (getRole() == 'player') {
                window.location.href = 'player.html';
            }
        },
        error: function (user, error) {
            self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
        }
    });
}