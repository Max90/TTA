$(document).ready(function () {

    Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");

    $('#button-logout').on('click', function () {
        Parse.User.logOut();

        var currentUser = Parse.User.current();
        checkIfUserLoggedIn();
    });

    $('#button-add-training').on('click', function () {
        addNewTraining();
    });

    //reloads page to refresh count of players in training
    //@todo: evtl noch mit ajax machen
    $('#close-player-addition-modal').on('click', function () {
        location.reload();
    });

    showTrainingList();

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

function addNewTraining() {
    var dateTraining = $('#input-date-training').val();
    var timeTraining = $('#input-time-training').val();
    $('#modal-add-training').foundation('reveal', 'close');
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
                    showPlayersForModal($(this).closest('tr').children('td:first').text());
                }));

            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function updatePlayerCount(dateTraining) {
    var teamTrainingName = Parse.User.current()['attributes']['teamname'] + "_training";
    var training = Parse.Object.extend(teamTrainingName);
    var query = new Parse.Query(training);
    query.equalTo("dateTraining", dateTraining);
    query.count({
        success: function (count) {
            console.log(count);
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
    var training = new Parse.Query(Tabelle);
    training.equalTo("dateTraining", dateTraining);
    training.first({
        success: function (training) {
            training.set("trPlayerCount", count);
            training.save();
        },
        error: function (training, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });
    $('#training-table tr:not(:first)').remove();
    showTrainingList();

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

function showPlayersForModal(dateTraining) {

    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    var attended = "";
    query.find({
        success: function (results) {
            $('#player-modal-table tr:not(:first)').remove();
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                playerIsInTraining(object.get('playerName'), dateTraining);


            }
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                playerIsNotInTraining(object.get('playerName'), dateTraining);

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
            //muss hier gemacht werden, weil sonst wegen asynchroner anfrage zahl manchmal nicht stimmt
            updatePlayerCount(dateTraining);
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
            //muss hier gemacht werden, weil sonst wegen asynchroner anfrage zahl manchmal nicht stimmt
            updatePlayerCount(dateTraining);
            object[0].destroy({});
        },
        error: function (players, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });
}

function playerIsInTraining(playerName, dateTraining) {
    var teamNameTraining = Parse.User.current()['attributes']['teamname'] + "_training";

    var Tabelle = Parse.Object.extend(teamNameTraining);
    var trainingQuery = new Parse.Query(Tabelle);
    trainingQuery.equalTo("playerName", playerName);
    trainingQuery.equalTo("dateTraining", dateTraining);
    trainingQuery.first({
        success: function (object) {

            showPlayersInTraining(object, playerName, dateTraining);


        },
        error: function (players, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });
}

function showPlayersInTraining(object, playerName, dateTraining) {

    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.equalTo("playerName", playerName);


    query.first({
        success: function (player) {
            var imgSrc = player.get("profilePic");
            if (imgSrc == undefined) {
                imgSrc = "img/avatar.jpg";
            }

            if (object != undefined) {
                $("#player-modal-table").append($('<tr class="anwesend player-context-menu">').append($('<td><img src="' + imgSrc + '"></td>' + '<td>' + playerName + '</td>')).on("click", function () {
                    addPlayerToTraining($(this), $(this).closest('tr').children('td:last').text(), dateTraining);
                }));
            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });


}


function playerIsNotInTraining(playerName, dateTraining) {
    var teamNameTraining = Parse.User.current()['attributes']['teamname'] + "_training";

    var Tabelle = Parse.Object.extend(teamNameTraining);
    var trainingQuery = new Parse.Query(Tabelle);
    trainingQuery.equalTo("playerName", playerName);
    trainingQuery.equalTo("dateTraining", dateTraining);
    trainingQuery.first({
        success: function (object) {
            showPlayersNotInTraining(object, playerName, dateTraining);


        },
        error: function (players, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });
}


function showPlayersNotInTraining(object, playerName, dateTraining) {

    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.equalTo("playerName", playerName);


    query.first({
        success: function (player) {
            var imgSrc = player.get("profilePic");
            if (imgSrc == undefined) {
                imgSrc = "img/avatar.jpg";
            }

            if (object == undefined) {
                $("#player-modal-table").append($('<tr class="player-context-menu">').append($('<td><img src="' + imgSrc + '"></td>' + '<td>' + playerName + '</td>')).on("click", function () {
                    addPlayerToTraining($(this), $(this).closest('tr').children('td:last').text(), dateTraining);
                }));
            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });


    function showPlayerList() {
        var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
        var team = Parse.Object.extend(teamName);
        var query = new Parse.Query(team);
        query.ascending("playerName");
        query.find({
            success: function (results) {
                // Do something with the returned Parse.Object values
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    getImageSrc(object, object.get('playerName'));
                }
            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });

    }


    function getImageSrc(object, playerName) {

        var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
        var team = Parse.Object.extend(teamName);
        var query = new Parse.Query(team);
        query.equalTo("playerName", playerName);

        query.first({
            success: function (player) {
                var imgSrc = player.get("profilePic");
                if (imgSrc == undefined) {
                    imgSrc = "img/avatar.jpg";
                }

                $("#player-training-table").append($("<tr class='player-context-menu'>").append($('<td><img src="' + imgSrc + '"></td>'
                    + '<td class="name-player">' + object.get('playerName') + '</td>')).on("click", function () {


                }));


            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });


    }


}





