Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");
var currentUser = Parse.User.current();
if (currentUser == null) {
    window.location.href = "../index.html";
}
var managerString = "manager";
var userName = currentUser['attributes']['username'];
console.log(userName);
if (userName.indexOf(managerString) >= 0) {
    $(document).ready(function () {

        $('#button-logout').on('click', function () {
            Parse.User.logOut();
        });

        //showTrainingListNutmeg();
        showNutmegTrainingList();
        getNutmegSumForPlayerTable();
        creatNutmegSumColumn();


    });
} else {
    window.location.href = "../index.html";
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

            $("#training-nutmeg-table").append($("<tr href='#' data-reveal-id='modal-add-nutmeg-to-player'>").append($('<td class="training-date">' + object.get('dateTraining') + '</td>'
                + '<td class="training-time">' + object.get('timeTraining') + '</td>'
                + '<td class="training-nutmeg-number">' + sum + '</td>')).on("click", function () {
                console.log("MODAL");
                var d = new Date($(this).closest('tr').children('td:first').text());
                var curr_date = d.getDate();
                var curr_month = d.getMonth() + 1; //Months are zero based
                var curr_year = d.getFullYear();


                $('#modal-add-nutmeg-to-player').find('#header-date').text("Datum: " + curr_date + "." + curr_month + "." + curr_year);
                showPlayersForNutmegModal($(this).closest('tr').children('td:first').text());
            }));

        },
        error: function (error) {
            // The request failed
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

                    object.set(columname, 0);
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
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            console.log('Failed to create new object, with error code: ' + error.message);
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
                    + '<td class="player-nm-name name-player">' + obj.get('playerName') + '</td>'
                    + '<td class="nutmeg-sum">' + sum + '</td>' + '<td class="nutmeg-not-paid-sum">'
                    + obj.get('nutmegNotPaid') + '</td>' + '<td class="input-nm">' + '<input class="input-nm-val" type="text" placeholder="0">'
                    + '</td>' + '<td class="checkmark-nm">' + '<i onclick="newNotPaidNutmeg($(this))" class="foundicon-checkmark"></i>' + '</td>')));
            }


        },
        error: function (error) {
            // The request failed
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
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            console.log('Failed to create new object, with error code: ' + error.message);
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
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });


}

