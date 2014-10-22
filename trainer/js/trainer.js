$(document).ready(function () {

    Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");
    $('#button-logout').on('click', function () {
        Parse.User.logOut();

        var currentUser = Parse.User.current();
        checkIfUserLoggedIn();
    });


    $('#button-send-player-info').on('click', function () {
        updatePlayerInfo();
    });

    updatePlayerInfoBox();
});

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
            $("#player-infobox").text("Aktuelle Info an Ihre Spieler: " + object.get('playerInfoBox'));
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
}









