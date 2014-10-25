Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");
var currentUser = Parse.User.current();
if (currentUser == null) {
    window.location.href = "../index.html";
}
var playerString = "player";
var userName = currentUser['attributes']['username'];

if (userName.indexOf(playerString) >= 0) {
    $(document).ready(function () {

        $('#button-logout').on('click', function () {
            Parse.User.logOut();
        });
        showNutmegTrainingList();
        getNutmegSumForPlayerTable();
        creatNutmegSumColumn();
    });
} else {
    window.location.href = "../index.html"
}

function creatNutmegSumColumn() {

    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var Tabelle = Parse.Object.extend(teamName);
    var training = new Parse.Query(Tabelle);

    training.find({
        success: function (training) {
            for (var i = 0; i < training.length; i++) {
                var object = training[i];


                if (object.get(columname) == undefined) {

                    var columname = "nutmegSum";

                    object.set(columname, 0 * 1);
                    object.save();


                }


                if (object.get(column) == undefined) {

                    var column = "nutmegPaid";

                    object.set(column, 0);
                    object.save();

                }

            }
        },
        error: function (training, error) {
            console.log(error.message);
        }
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
        }
    });
}
function getNutmegSumForPlayerTable() {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_trDates";
    var trDates = Parse.Object.extend(teamName);
    var query = new Parse.Query(trDates);

    query.find({
        success: function (results) {
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
    query.ascending("playerName");
    query.find({
        success: function (results) {

            for (var i = 0; i < results.length; i++) {
                var obj = results[i];
                var sum = 0;
                for (var j = 0; j < columnNmDateNames.length; j++) {
                    sum = sum + obj.get(columnNmDateNames[j]);

                }
                var imgSrc = obj.get("profilePic");
                if (imgSrc == undefined) {
                    imgSrc = "../img/avatar.jpg";
                }

                fillNutmegSumColumn(obj.get('playerName'), sum);

                $("#player-nutmeg-table").append($("<tr>").append($('<td><img src="' + imgSrc + '"></td>'
                    + '<td class="player-nm-name">' + obj.get('playerName') + '</td>'
                    + '<td>' + sum + '</td>' + '<td>' + obj.get('nutmegNotPaid') + '</td>')));
            }


        },
        error: function (error) {
            // The request failed
        }
    });
}
function newNotPaidNutmeg(obj) {
    var playerName = obj.closest('tr').find('.player-nm-name').text();
    var numPaidNutmegs = obj.closest('tr').find('.input-nm-val').val();
    if (numPaidNutmegs == "") {
        numPaidNutmegs = 0;
    }
    if (numPaidNutmegs * 1 < 0) {
        numPaidNutmegs = 0;
    }
    console.log(playerName, numPaidNutmegs);


    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var Tabelle = Parse.Object.extend(teamName);
    var player = new Parse.Query(Tabelle);
    player.equalTo("playerName", playerName);
    player.first({
        success: function (player) {
            var nmNotPaid = player.get('nutmegNotPaid');
            var nmPaid = player.get('nutmegPaid');

            if (player.get('nutmegNotPaid') > 0) {
                nmNotPaid = player.get('nutmegNotPaid') - numPaidNutmegs * 1;
                nmPaid = player.get('nutmegPaid') + numPaidNutmegs * 1;
            }

            player.set("nutmegNotPaid", nmNotPaid);
            player.set("nutmegPaid", nmPaid);
            player.save();

        },
        error: function (training, error) {
            console.log(error.message);
        }
    });


}

function fillNutmegSumColumn(playerName, sum) {

    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var Tabelle = Parse.Object.extend(teamName);
    var player = new Parse.Query(Tabelle);
    player.equalTo("playerName", playerName);
    player.first({
        success: function (player) {
            player.set("nutmegSum", sum);
            player.save();
        },
        error: function (training, error) {
            console.log(error.message);
        }
    });


}







