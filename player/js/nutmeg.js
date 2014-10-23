$(document).ready(function () {

    Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");

    $('#button-logout').on('click', function () {
        Parse.User.logOut();

        var currentUser = Parse.User.current();
        checkIfUserLoggedIn();
    });
    showNutmegTrainingList();
    showNutmegPlayerList();
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


function showNutmegTrainingList() {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_trDates";
    var trDates = Parse.Object.extend(teamName);
    var query = new Parse.Query(trDates);

    query.find({
        success: function (results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                //von Training Gesamt-Anzahl Beiner zählen und für X einfügen
                $("#training-nutmeg-table").append($("<tr>").append($('<td>' + object.get('dateTraining') + '</td>' + '<td>' + object.get('timeTraining') + '</td>'
                    + '<td>' + "X" + '</td>')));
            }
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
}


function trNutmegCount(player, imgSrc) {
    var teamTrainingName = Parse.User.current()['attributes']['teamname'] + "_training";
    var training = Parse.Object.extend(teamTrainingName);
    var query = new Parse.Query(training);
    query.equalTo("playerName", playerName);
    query.ascending("trCount");

    query.count({
        success: function (count) {
            $("#training-nutmeg-table").append($("<tr>").append($('<td>' + object.get('dateTraining') + '</td>' + '<td>' + object.get('timeTraining') + '</td>'
                + '<td>' + "X" + '</td>')));

        },
        error: function (error) {
            // The request failed
        }
    });
}

















