Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");
var currentUser = Parse.User.current();
var managerString = "manager";
var userName = currentUser['attributes']['username'];
console.log(userName);
if (userName.indexOf(managerString) >= 0) {
    $(document).ready(function () {

        Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");

        $('#button-logout').on('click', function () {
            Parse.User.logOut();

            var currentUser = Parse.User.current();
            checkIfUserLoggedIn();
        });


        //reloads page to refresh count of players in training
        //@todo: evtl noch mit ajax machen
        $('#close-player-addition-modal').on('click', function () {
            location.reload();
        });
        updatePlayerInfoBox();
        showTrainingList();
        showPlayerList();

    });
} else {
    window.location.href = "../index.html";
}


function checkIfUserLoggedIn() {
    var currentUser = Parse.User.current();
    if (currentUser) {
        $('#button-logout').show();
    } else {
        $('#button-logout').hide();
        $('.login-form').show();
    }
}


function updatePlayerInfoBox() {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_playerInfoBox";
    var infoBox = Parse.Object.extend(teamName);
    var query = new Parse.Query(infoBox);
    query.descending("createdAt");
    query.first({
        success: function (object) {
            if (object != undefined) {
                var d = new Date(object.createdAt);
                var curr_date = d.getDate();
                var curr_month = d.getMonth() + 1; //Months are zero based
                var curr_year = d.getFullYear();
                var timeHours = d.getHours();
                var timeMin = d.getMinutes();
                var formatedDate = curr_date + "." + curr_month + "." + curr_year + " " + timeHours + ":" + timeMin + " Uhr";


                $("#player-infobox-label").text(object.get('playerInfoBox'));
                $("#player-infobox-createdat").text(" (Erstellt am: " + formatedDate + ")");

            } else {
                $("#player-infobox-label").text("Es gibt im Moment keine aktuellen Infos!");
            }


        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
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

                $("#training-table").append($("<tr>").append($('<td>' + object.get('dateTraining') + '</td>' + '<td>' + object.get('timeTraining') + '</td>'
                    + '<td>' + object.get('trPlayerCount') + '</td>')));
            }
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
}


function showPlayerTrDetails(playerName, imgSrc) {

    $('#modal-tr-detail-player').foundation('reveal', 'open');


    $('#modal-tr-detail-player').find(".img-player").attr("src", imgSrc);
    $('#modal-tr-detail-player').find("h3").text(playerName);


    $('#player-tr-detail-table tr:not(:first)').remove();
    showPlayerTrDates(playerName);

}
function showPlayerTrDates(playerName) {
    var teamNameTraining = Parse.User.current()['attributes']['teamname'] + "_training";
    var Tabelle = Parse.Object.extend(teamNameTraining);
    var trainingQuery = new Parse.Query(Tabelle);
    trainingQuery.equalTo("playerName", playerName);
    trainingQuery.find({
        success: function (results) {
            for (var i = 0; i < results.length; i++) {
                var tr = results[i];
                var d = new Date(tr.get("dateTraining"));
                var curr_date = d.getDate();
                var curr_month = d.getMonth() + 1; //Months are zero based
                var curr_year = d.getFullYear();


                $("#player-tr-detail-table").append($('<tr>').append($('<td>').text(curr_date + "." + curr_month + "." + curr_year)));
            }

        },
        error: function (players, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });


}
function showPlayerList() {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.descending("trCount");
    query.find({
        success: function (results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var imgSrc = object.get("profilePic");
                if (imgSrc == undefined) {
                    imgSrc = "../img/avatar.jpg";
                }

                $("#player-training-table").append($("<tr class='player-tr-table'>").append($('<td><img class="img-src" src="' + imgSrc + '"></td>'
                    + '<td class="name-player">' + object.get('playerName') + '</td>' + '<td>' + object.get('trCount') + '</td>')).on("click", function () {
                    showPlayerTrDetails($(this).closest('tr').find('.name-player').text(), $(this).closest('tr').find('.img-src').attr('src'));
                }));

            }
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
}

function trCount(player, imgSrc) {
    var teamTrainingName = Parse.User.current()['attributes']['teamname'] + "_training";
    var training = Parse.Object.extend(teamTrainingName);
    var query = new Parse.Query(training);
    query.ascending("trCount");

    query.count({
        success: function (count) {

            $("#player-training-table").append($("<tr class='player-tr-table'>").append($('<td><img src="' + imgSrc + '"></td>'
                + '<td class="name-player">' + player.get('playerName') + '</td>' + '<td>' + player.get('trCount') + '</td>')));
        },
        error: function (error) {
            // The request failed
        }
    });
}








