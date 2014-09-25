$(document).ready(function () {


    Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");

    $('#button-add-player').on('click', function () {
        addNewPlayer("add-player");
    });
    $('#button-add-next-player').on('click', function () {
        addNewPlayer("add-next-player");
    });
    $('#button-add-training').on('click', function () {
        addNewTraining();
    });

    showPlayers();

    showTrainingList();
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
        $('#player-table tr:not(:first)').remove();
        showPlayers();
    }
}


function savePlayer(playerName) {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var Tabelle = Parse.Object.extend(teamName);
    var players = new Tabelle();
    players.set("playerName", playerName);
    players.save(null, {
        success: function (players) {
            // Execute any logic that should take place after the object is saved.
//            alert('New object created with objectId: ' + players);
        },
        error: function (players, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });

}


function addNewTraining() {
    var dateTraining = $('#input-date-training').val();
    var timeTraining = $('#input-time-training').val();
    console.log("Datum " + dateTraining + "Time " + timeTraining);
    $('#modal-add-training').foundation('reveal', 'close');
//    showPlayersForTraining(dateTraining, timeTraining);
    saveTraining(dateTraining, timeTraining);

}


function showTrainingList() {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_trDates";
    var trDates = Parse.Object.extend(teamName);
    var query = new Parse.Query(trDates);

    query.find({
        success: function (results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                $("#training-table").append($("<tr href='#' data-reveal-id='modal-add-player-to-tr'>").append($('<td>' + object.get('dateTraining') + '</td>' + '<td>' + object.get('timeTraining') + '</td>'
                    + '<td>' + object.get('trPlayerCount') + '</td>')).on("click", function () {
                    console.log($(this).closest('tr').children('td:first').text());
                    showPlayersForModal($(this).closest('tr').children('td:first').text());
                }));

            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}


//trainingsteilnahme ändern
function updatePlayerCount(dateTraining) {
    var teamTrainingName = Parse.User.current()['attributes']['teamname'] + "_training";
    var training = Parse.Object.extend(teamTrainingName);
    var query = new Parse.Query(training);
    query.equalTo("dateTraining", dateTraining);
    query.count({
        success: function (count) {
            savePlayerCount(count, dateTraining);
        },
        error: function (error) {
            // The request failed
        }
    });
}

function savePlayerCount(count, dateTraining) {
    var teamNameTraining = Parse.User.current()['attributes']['teamname'] + "_trDates";

    var Tabelle = Parse.Object.extend(teamNameTraining);
    var training = new Tabelle();
    training.equalTo("dateTraining", dateTraining);
    training.save(null, {
        success: function (training) {
            training.set("trPlayerCount", count);
        },
        error: function (training, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });

}


function saveTraining(dateTraining, timeTraining) {
    var teamNameTraining = Parse.User.current()['attributes']['teamname'] + "_trDates";

    var Tabelle = Parse.Object.extend(teamNameTraining);
    var training = new Tabelle();
    training.set("dateTraining", dateTraining);
    training.set("timeTraining", timeTraining);
    training.set("trPlayerCount", 0);
    training.save(null, {
        success: function (training) {
            $('#training-table tr:not(:first)').remove();
            showTrainingList();
        },
        error: function (training, error) {
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
                $("#player-table").append($("<tr>").append($('<td>avatar</td>' + '<td>' + object.get('playerName') + '</td>')).on("click", function () {
                    console.log($(this).text());
                }));

            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

}

function showPlayersForModal(dateTraining) {

    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.find({
        success: function (results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                $("#player-modal-table").append($("<tr>").append($('<td>avatar</td>' + '<td>' + object.get('playerName') + '</td>')).on("click", function () {

                    addPlayerToTraining($(this), $(this).closest('tr').children('td:last').text(), dateTraining);

                }));

            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

}


function addPlayerToTraining(playerObject, playerName, dateTraining) {
    playerObject.toggleClass("anwesend", "nicht-anwesend");
    if (playerObject.hasClass("anwesend")) {
        addToParseTrainingTable(playerName, dateTraining);
    } else {
        removeFromParseTrainingTable(playerName, dateTraining);
    }
}

function addToParseTrainingTable(playerName, dateTraining) {
    var teamNameTraining = Parse.User.current()['attributes']['teamname'] + "_training";

    var Tabelle = Parse.Object.extend(teamNameTraining);
    var training = new Tabelle();
    training.set("playerName", playerName);
    training.set("dateTraining", dateTraining);
    training.save(null, {
        success: function (players) {
            //@todo: Feedback TR erstellt
        },
        error: function (players, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });
}

function removeFromParseTrainingTable(playerName, dateTraining) {
    var teamNameTraining = Parse.User.current()['attributes']['teamname'] + "_training";

    var Tabelle = Parse.Object.extend(teamNameTraining);
    var trainingQuery = new Parse.Query(Tabelle);
    trainingQuery.equalTo("playerName", playerName);
    trainingQuery.equalTo("dateTraining", dateTraining);


    trainingQuery.find({
        success: function (object) {
            object[0].destroy({});
        },
        error: function (players, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });
}


function showPlayersForTraining(dateTraining, timeTraining) {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.find({
        success: function (results) {
            // Do something with the returned Parse.Object values
            $("#player-container").append($("<p>").text("Training " + dateTraining + " " + timeTraining + " Uhr " + "Spieler die im TR sind markieren!"));
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
//                $("#players").append($("<li>").text(object.get("playerName")).on("click", function () {
//                    console.log($(this).text());
//                    addPlayerToTraining($(this), $(this).text(), dateTraining);
//                }));

                $("#training-table").append($("<tr>").append($('<td>avatar</td>' + '<td>' + object.get('playerName') + '</td>')).on("click", function () {
                    console.log($(this).text());
                    //addPlayerToTraining($(this), $(this).text(), dateTraining);
                }));
            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}


