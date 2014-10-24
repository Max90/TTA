Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");
var currentUser = Parse.User.current();
var managerString = "manager";
if (!currentUser) {
    window.location.href = "../index.html";
} else {
    $(document).ready(function () {

        $('#button-logout').on('click', function () {
            Parse.User.logOut();
        });
        showNutmegTrainingList();
    });
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
                /* $("#training-nutmeg-table").append($("<tr>").append($('<td>' + object.get('dateTraining') + '</td>' + '<td>' + object.get('timeTraining') + '</td>'
                 + '<td>' + "X" + '</td>')));*/


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

            saveTrNutmegCount(object.get('dateTraining').replace(/-/g, "_"), sum);



            $("#training-nutmeg-table").append($("<tr>").append($('<td>' + object.get('dateTraining') + '</td>' + '<td>' + object.get('timeTraining') + '</td>'
                + '<td>' + sum + '</td>')));

        },
        error: function (error) {
            // The request failed
        }
    });
}


function saveTrNutmegCount(dateTraining, sum) {

    var teamNameTraining = Parse.User.current()['attributes']['teamname'] + "_trDates";

    var Tabelle = Parse.Object.extend(teamNameTraining);
    var training = new Parse.Query(Tabelle);

    training.equalTo("dateTraining", dateTraining);
    training.first({
        success: function (training) {
            training.set("trNutmegPlayerCount", count);
            training.save();
        },
        error: function (training, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });


}













