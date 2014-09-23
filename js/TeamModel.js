$(document).ready(function () {
    Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");

    checkIfUserLoggedIn();
    getPlayerData();

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
    })

});

function checkIfUserLoggedIn() {
    var currentUser = Parse.User.current();
    if (currentUser) {
        $('#button-logout').show();
    } else {
        $('#button-logout').hide();
        $('#login-form').show();
    }
}

function getPlayerData() {
    var Tabelle = Parse.Object.extend("Test");
    var query = new Parse.Query(Tabelle);
    query.find({
        success: function (results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                console.log(object.get('name') + "-" + object.get("training"));
                $("#content-div").append($("<p>").text(object.get("name") + object.get("training")))
            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function saveUser(teamName, role, pw) {
    var user = new Parse.User();
    user.set("username", teamName + "_" + role);
    user.set("password", pw);

    user.signUp(null, {
        success: function (user) {
            alert("eingeloggt");
            $('#myModal').foundation('reveal', 'close');
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

    saveUser($('#input-team-name').val(), "admin", $('#input-admin-pw').val());
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
            alert("eingeloggt");
            $('.login-form').hide();
            checkIfUserLoggedIn();
        },
        error: function (user, error) {
            self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
        }
    });
}