Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");
var currentUser = Parse.User.current();
var managerString = "manager";
var userName = currentUser['attributes']['username'];
console.log(userName);
if (userName.indexOf(managerString) >= 0) {
    $(document).ready(function () {

        $('#button-logout').on('click', function () {
            Parse.User.logOut();
        });

        showTrainingListNutmeg();

    });
} else {
    window.location.href = "../index.html";
}

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

                $("#training-table").append($("<tr href='#' data-reveal-id='modal-add-nutmeg-to-player'>").append($('<td>' + object.get('dateTraining') + '</td>' + '<td>' + object.get('timeTraining') + '</td>'
                )).on("click", function () {
                    var d = new Date($(this).closest('tr').children('td:first').text());
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
            var date = dateTraining.replace(/-/g, "_");
            var nutmegCount = player.get("nm_" + date);

            $("#player-modal-table").append($('<tr class="player-context-menu">').append($('<td><img src="' + imgSrc + '"></td>' + '<td class="nm-player player-name-column">'
                + playerName + '</td>' + '<td>' + '<i onclick="minusButtonClicked($(this))" class="minus foundicon-minus minus-column"></i>'
                + '</td>' + '<td class="nutmeg-count nutmeg-column">' + nutmegCount + '</td>' + '<td>' + '<i onclick="plusButtonClicked($(this))" class="plus foundicon-plus plus-column"></i>' + '</td>')));

        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function minusButtonClicked(object) {

    updateNutmegTrCount(object.closest('tr').find('.nm-player').text(), $('#modal-add-nutmeg-to-player').find('#header-date').text(), -1, object.closest('tr').find('.nutmeg-count'));
}

function plusButtonClicked(object) {
    updateNutmegTrCount(object.closest('tr').find('.nm-player').text(), $('#modal-add-nutmeg-to-player').find('#header-date').text(), 1, object.closest('tr').find('.nutmeg-count'));
}


function updateNutmegTrCount(playerName, dateTraining, count, countView) {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);

    var d = new Date(dateTraining);

    function addZ(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    var curr_date = addZ(d.getDate());
    var curr_month = addZ(d.getMonth() + 1); //Months are zero based
    var curr_year = d.getFullYear();


    var date = curr_year + "_" + curr_date + "_" + curr_month;

    query.equalTo("playerName", playerName);
    query.first({
        success: function (player) {

            var temp = player.get("nm_" + date);

            if (count == -1) {
                if (temp > 0) {
                    temp = temp + count;
                }

            } else {
                temp = temp + count;
            }


            player.set("nm_" + date, temp);
            player.save();
            countView.text(temp);
        },
        error: function (players, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });
}
