$(document).ready(function () {

    Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");
    $('#button-logout').on('click', function () {
        Parse.User.logOut();

        var currentUser = Parse.User.current();
        checkIfUserLoggedIn();
    });

    $('#button-add-player').on('click', function () {
        addNewPlayer("add-player");
    });
    $('#button-add-next-player').on('click', function () {
        addNewPlayer("add-next-player");
    });

    showPlayers();
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

function addNewPlayer(string) {
    var playerName = $('#input-player-name').val();
    if (playerName != "") {
        if (string == "add-player") {
            savePlayer(playerName);
            $('#modal-add-player').foundation('reveal', 'close');
            $('#input-player-name').val("");
            $('#input-player-name').attr("placeholder", "Vorname Nachname");
        } else {
            savePlayer(playerName);
            $('#input-player-name').val("");
            $('#input-player-name').attr("placeholder", "Vorname Nachname");
        }
    }
}

function deletePlayer(playerName) {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.equalTo("playerName", playerName);

    query.find({
        success: function (myObj) {
            console.log(myObj[0]);
            myObj[0].destroy({});
            location.reload();
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function savePlayer(playerName) {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var Tabelle = Parse.Object.extend(teamName);
    var players = new Tabelle();
    players.set("playerName", playerName);
    players.save(null, {
        success: function (players) {
            $('#player-table tr:not(:first)').remove();
            showPlayers();
        },
        error: function (players, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });

}

function showPlayers() {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.find({
        success: function (results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                $("#player-table").append($("<tr class='player-context-menu'>").append($('<td><img src="img/avatar.jpg"></td>' + '<td class="player-name">' + object.get('playerName') + '</td>')).on("click", function () {



                    $('.modal-change-player').foundation('reveal', 'open');
                    $('.modal-change-player').find(".input-player-name").attr("placeholder", $(this).closest('tr').find('.player-name').text());
                    $('#input-player-name-small').on("change", function () {
                        $('#input-player-name-big').val($('#input-player-name-small').val());
                    });

                    $('#input-player-name-big').on("change", function () {
                        $('#input-player-name-small').val($('#input-player-name-big').val());
                    });

                    $('.modal-change-player').find(".button-save-changes").on("click", function () {
                        saveChangedPlayerName($('.input-player-name').attr("placeholder"), $('.input-player-name').val());
                    });

                    $('.button-delete-player').on('click', function (){
                        deletePlayer($('.input-player-name').attr("placeholder"))
                    })



                }));

            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

}


function saveChangedPlayerName(playerName, newPlayerName) {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.equalTo("playerName", playerName);

    query.first({
        success: function (player) {

            player.set("playerName", newPlayerName);
            player.save();
            location.reload();
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

}









