/**
 * Created by max on 22.10.14.
 */
$(document).ready(function () {

    Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");

    $('#button-logout').on('click', function () {
        Parse.User.logOut();

        var currentUser = Parse.User.current();
        checkIfUserLoggedIn();
    });

    showTrainingListNutmeg();

});

function showTrainingListNutmeg() {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_trDates";
    var trDates = Parse.Object.extend(teamName);
    var query = new Parse.Query(trDates);

    query.find({
        success: function (results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                /* var d = new Date(object.get('dateTraining'));
                 var curr_date = d.getDate();
                 var curr_month = d.getMonth() + 1; //Months are zero based
                 var curr_year = d.getFullYear();
                 var formatedTrDate = curr_date + "." + curr_month + "." + curr_year;*/

                $("#training-table").append($("<tr href='#' data-reveal-id='modal-add-nutmeg-to-player'>").append($('<td>'
                    + object.get('dateTraining') + '</td>' + '<td>' + object.get('timeTraining') + '</td>')).on("click", function () {


                    var d = new Date(object.get('dateTraining'));
                    var curr_date = d.getDate();
                    var curr_month = d.getMonth() + 1; //Months are zero based
                    var curr_year = d.getFullYear();
                    $('#modal-add-nutmeg-to-player').find('#header-date').text("Datum: " + curr_date + "." + curr_month + "." + curr_year);

                    showPlayersForNutmegModal($(this).closest('tr').children('td:first').text());
                }));

            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function showPlayersForNutmegModal(dateTraining) {


    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.ascending("playerName");
    query.find({
        success: function (results) {
            $('#player-modal-table tr:not(:first)').remove();
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                listPlayerInNutmegModal(object.get('playerName'), dateTraining);
            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

}

function listPlayerInNutmegModal(playerName, dateTraining) {

    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.equalTo("playerName", playerName);
    query.ascending("playerName");
    query.first({
        success: function (player) {
            if (player != null) {
                var imgSrc = player.get("profilePic");
            }
            if (imgSrc == undefined) {
                imgSrc = "../img/avatar.jpg";
            }
            $("#player-modal-table").append($('<tr class="player-context-menu">').append($('<td><img src="' + imgSrc + '"></td>' + '<td>'
                + playerName + '</td>')).on("click", function () {
                addNutmegToPlayer($(this), $(this).closest('tr').children('td:last').text(), dateTraining);
            }));

        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function addNutmegToPlayer(object, playerName, dateTraining) {
    var teamNameNutmeg = Parse.User.current()['attributes']['teamname'] + "_players";

    var Tabelle = Parse.Object.extend(teamNameNutmeg);
    Tabelle.put("nm-" + dateTraining, 0);
    nutmegTable.save(null, {
        success: function (training) {

        },
        error: function (training, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });


    var query = new Parse.Query(Tabelle);
    query.equalTo("playerName", playerName);
    query.first({
        success: function (players) {
                updateNutmegTrCount(playerName, dateTraining, 1);

        },
        error: function (players, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });
}

function createNutmegTable (playerName, dateTraining) {
    var teamNameTraining = Parse.User.current()['attributes']['teamname'] + "_players";

    var Tabelle = Parse.Object.extend(teamNameTraining);
    var query = new Parse.Query(Tabelle);
    query.equalTo("playerName", playerName);
    query.first({
        success: function (player) {
            player.set("nm-" + dateTraining, 1);
            player.save();
        },
        error: function (players, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });
}


function updateNutmegTrCount(playerName, dateTraining, count) {

    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.equalTo("playerName", playerName);
    query.first({
        success: function (player) {
            var trCount = player.get("nutmegCount") + count;
            player.set("tr-" + dateTraining, trCount);
            player.save();
        },
        error: function (players, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });


}
