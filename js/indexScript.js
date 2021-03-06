$(document).ready(function () {
    Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");

    checkIfUserLoggedIn();

    $('#submit-button').on('click', function () {
        saveNewPlayer();
    });

    $('#button-create-team').on('click', function () {
        if ($('#input-team-name').val() == "" || $('#input-admin-email').val() == "" || $('#input-admin-pw').val() == ""
            || $('#input-player-pw').val() == "" || $('#input-manager-pw').val() == "") {
            alert("Bitte füllen Sie erst alle Felder aus bevor Sie fortfahren");
        } else {
            saveNewTeam();
        }

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
        alert("Sie haben eine E-Mail mit dem Link zum zurücksetzen Ihres Passworts erhalten.");
        $('#modal-reset-pw').foundation('reveal', 'close');
        Parse.User.requestPasswordReset($('#input-email-reset-pw').val(), {
            success: function () {
            },
            error: function (error) {
                // Show the error message somewhere
                alert("Für diese E-Mail Adresse gibt es keinen Top Team Account.");
            }
        });
    });

    $('#button-close-modal').on('click', function () {
        $('#modal-existing-team').foundation('reveal', 'close');
    })

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
    var name = teamName.replace(/ /g, "_");
    if (!isNaN(+name.charAt(0))) {
        name = "TT_" + name;
        console.log('koa nummer');
    }
    user.set("teamname", name);
    user.set("username", name + "_" + role);
    user.set("password", pw);
    user.set("email", email);

    user.signUp(null, {
        success: function (user) {
            $('#modal-create-team').foundation('reveal', 'close');
        },
        error: function (user, error) {
            // Show the error message somewhere and let the user try again.
            $('#modal-existing-team').foundation('reveal', 'open');
        }
    });

}


//es werden drei verschiedene benutzer angelegt: admin, js, player
function saveNewTeam() {
    checkForValidTeamName();
    saveUser($('#input-team-name').val(), "admin", $('#input-admin-pw').val(), $('#input-admin-email').val());
    saveUser($('#input-team-name').val(), "manager", $('#input-manager-pw').val());
    saveUser($('#input-team-name').val(), "player", $('#input-player-pw').val());
}

function checkForValidTeamName() {

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
    var username = teamName.replace(/ /g, "_") + "_" + getRole();
    if (!isNaN(+username.charAt(0))) {
        username = "TT_" + username;
    }
    var password = $('#input-password-login').val();
    Parse.User.logIn(username, password, {
        success: function (user) {
            $('.login-form').hide();
            checkIfUserLoggedIn();
            if (getRole() == "admin") {
                window.location.href = 'trainer/trainer.html';
            } else if (getRole() == "manager") {
                window.location.href = 'manager/manager.html'
            } else if (getRole() == 'player') {
                window.location.href = 'player/player.html';
            }
        },
        error: function (user, error) {
            self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
        }
    });
}