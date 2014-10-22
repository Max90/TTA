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


            // holt die Trainings von Parse und gibt diese aus
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                creatNutmegColumns(results[i].get('dateTraining'));

                /*  $("#training-table").append($("<tr href='#' data-reveal-id='modal-add-nutmeg-to-player'>").append($('<td>'
                 + object.get('dateTraining') + '</td>' + '<td>' + object.get('timeTraining') + '</td>')).on("click", function () {


                 var d = new Date(object.get('dateTraining'));
                 var curr_date = d.getDate();
                 var curr_month = d.getMonth() + 1; //Months are zero based
                 var curr_year = d.getFullYear();
                 $('#modal-add-nutmeg-to-player').find('#header-date').text("Datum: " + curr_date + "." + curr_month + "." + curr_year);

                 showPlayersForNutmegModal(object.get('dateTraining'));
                 }));*/


                $("#training-table").append($("<tr href='#' data-reveal-id='modal-add-nutmeg-to-player'>").append($('<td>' + object.get('dateTraining') + '</td>' + '<td>' + object.get('timeTraining') + '</td>'
                )).on("click", function () {


                    var d = new Date($(this).closest('tr').children('td:first').text());
                    var curr_date = d.getDate();
                    var curr_month = d.getMonth() + 1; //Months are zero based
                    var curr_year = d.getFullYear();
                    $('#modal-add-nutmeg-to-player').find('#header-date').text("Datum: " + curr_date + "." + curr_month + "." + curr_year);
                    // console.log("printbeiclick " + $(this).closest('tr').children('td:first').text());
                    showPlayersForNutmegModal($(this).closest('tr').children('td:first').text());
                }));


            }


        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function creatNutmegColumns(dateTraining) {

    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var Tabelle = Parse.Object.extend(teamName);
    var training = new Parse.Query(Tabelle);

    training.find({
        success: function (training) {
            for (var i = 0; i < training.length; i++) {
                var object = training[i];


                if (object.get(columname) == undefined) {
                    var date = dateTraining.replace(/-/g, "_");
                    var columname = "nm_" + date;
                    console.log("Nutmeg: " + dateTraining + " columnname: " + columname);
                    object.set(columname, 0);
                    object.save();
                }

            }
        },
        error: function (training, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            console.log('Failed to create new object, with error code: ' + error.message);
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
    var query = new Parse.Query(teamName);
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
                updateNutmegTrCount(playerName, dateTraining, 1)
            }));

        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}


function updateNutmegTrCount(playerName, dateTraining, count) {

    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    var date = dateTraining.replace(/-/g, "_");
    query.equalTo("playerName", playerName);
    query.first({
        success: function (player) {
            var temp = player.get("nm_" + date);
            temp = temp + count;
            player.set("nm_" + date, temp);
            player.save();
        },
        error: function (players, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });
}
