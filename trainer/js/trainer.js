Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");
var currentUser = Parse.User.current();
if (currentUser == null) {
    window.location.href = "../index.html";
}
var trainerString = "admin";
var userName = currentUser['attributes']['username'];
console.log(userName);
if (userName.indexOf(trainerString) >= 0) {
    $(document).ready(function () {
        $('#button-logout').on('click', function () {
            Parse.User.logOut();
        });

        $('#button-send-player-info').on('click', function () {
            updatePlayerInfo();
        });

        updatePlayerInfoBox();
    });
} else {
    window.location.href = "../index.html";
}


function updatePlayerInfo() {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_playerInfoBox";
    var Tabelle = Parse.Object.extend(teamName);
    var playerInfoBox = new Tabelle();


    if ($("textarea#input-current-player-info").val() == undefined) {
        playerInfoBox.set("playerInfoBox", "Hier könnte eine aktuelle Info für Ihre Spieler stehen!");
    } else {
        playerInfoBox.set("playerInfoBox", $("textarea#input-current-player-info").val());
        }

    playerInfoBox.save(null, {
        success: function (infoBox) {
            updatePlayerInfoBox();
        },
        error: function (players, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });


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
                $("#player-infobox-label").text("Sie haben noch keine Infos an ihre Spieler übermittelt!");
            }


        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
}









