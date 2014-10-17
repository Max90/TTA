$(document).ready(function () {

    Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");

    $('#button-add-player').on('click', function () {
        addNewPlayer("add-player");
    });
    $('#button-add-next-player').on('click', function () {
        addNewPlayer("add-next-player");
    });

    showPlayers();
});

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
                    //@todo: was kann man durch klicken auf player machen? bild hinzufügen; spieler löschen; trainingsbeteiligung speziell von diesem Spieler betrachten
                }));

            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

}









