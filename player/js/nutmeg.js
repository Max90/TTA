$(document).ready(function () {

    Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");

    $('#button-logout').on('click', function () {
        Parse.User.logOut();

        var currentUser = Parse.User.current();
        checkIfUserLoggedIn();
    });
    showNutmegTrainingList();
    getNutmegSumForPlayerTable();
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
                trNutmegCount(object);
            }
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
}


function trNutmegCount(object) {
    var teamTrainingName = Parse.User.current()['attributes']['teamname'] + "_players";
    var training = Parse.Object.extend(teamTrainingName);
    var query = new Parse.Query(training);


    query.find({
        success: function (results) {
            var sum = 0;
            for (var i = 0; i < results.length; i++) {
                var obj = results[i];
                sum = sum + obj.get("nm_" + object.get('dateTraining').replace(/-/g, "_"));
            }

            $("#training-nutmeg-table").append($("<tr>").append($('<td>' + object.get('dateTraining') + '</td>' + '<td>' + object.get('timeTraining') + '</td>'
                + '<td>' + sum + '</td>')));

        },
        error: function (error) {
            // The request failed
        }
    });
}
function getNutmegSumForPlayerTable() {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_trDates";
    var trDates = Parse.Object.extend(teamName);
    var query = new Parse.Query(trDates);

    query.find({
        success: function (results) {
            // Do something with the returned Parse.Object values
            var columnNmDateNames = [];
            for (var i = 0; i < results.length; i++) {
                var object = results[i];


                var columnNmDateName = "nm_" + object.get('dateTraining').replace(/-/g, "_");
                columnNmDateNames.push(columnNmDateName);
            }
            showNutmegPlayerTable(columnNmDateNames);

        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });

}
function showNutmegPlayerTable(columnNmDateNames) {
    var teamTrainingName = Parse.User.current()['attributes']['teamname'] + "_players";
    var training = Parse.Object.extend(teamTrainingName);
    var query = new Parse.Query(training);
    query.ascending("playerName")
    query.find({
        success: function (results) {

            for (var i = 0; i < results.length; i++) {
                var obj = results[i];
                var sum = 0;
                for (var j = 0; j < columnNmDateNames.length; j++) {
                    sum = sum + obj.get(columnNmDateNames[j]);

                }
                obj.set("nutmegSum", sum);

                $("#player-nutmeg-table").append($("<tr>").append($('<td>' + obj.get('playerName') + '</td>'
                    + '<td>' + sum + '</td>')));

            }


        },
        error: function (error) {
            // The request failed
        }
    });
}








