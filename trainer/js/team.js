Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");
var currentUser = Parse.User.current();
var trainerString = "trainer";
if (!trainerString.indexOf(currentUser['attributes']['username']) >= 0) {
    window.location.href = "../index.html";
} else {
    $(document).ready(function () {
        $('#button-logout').on('click', function () {
            Parse.User.logOut();

            var currentUser = Parse.User.current();
            checkIfUserLoggedIn();
        });

        $('#button-add-player').on('click', function () {
            addNewPlayer("add-player");
        });
        $('#button-add-next-player').on('click', function () {
            addNewPlayer("add-next-player");
        });

        showPlayers();
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

function addNewPlayer(string) {
    var playerName = $('#input-player-name').val();
    if (playerName != "") {
        if (string == "add-player") {
            savePlayer(playerName);
            $('#modal-add-player').foundation('reveal', 'close');
            $('#input-player-name').val("");
            $('#input-player-name').attr("placeholder", "Vorname Nachname");
        } else {
            savePlayer(playerName);
            $('#input-player-name').val("");
            $('#input-player-name').attr("placeholder", "Vorname Nachname");
        }
    }
}

function deletePlayer(playerName) {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.equalTo("playerName", playerName);

    query.find({
        success: function (myObj) {

            myObj[0].destroy({});
            location.reload();
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function savePlayer(playerName) {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var Tabelle = Parse.Object.extend(teamName);
    var players = new Tabelle();
    players.set("playerName", playerName);
    players.set("trCount", 0);
    players.save(null, {
        success: function (players) {
            $('#player-table tr:not(:first)').remove();
            showPlayers();
        },
        error: function (players, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });

}


function updatePicture(playerName, picUrl) {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.equalTo("playerName", playerName);

    query.first({
        success: function (player) {
            player.set("profilePic", picUrl);
            player.save();
            location.reload();
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function uploadFile(playerName) {
    var file;

    // Set an event listener on the Choose File field.
    $('.fileselect').bind("change", function (e) {
        var files = e.target.files || e.dataTransfer.files;
        // Our file var now holds the selected file
        file = files[0];
    });

    // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
    $('.uploadbutton').click(function () {
        var serverUrl = 'https://api.parse.com/1/files/' + file.name;

        $.ajax({
            type: "POST",
            beforeSend: function (request) {
                request.setRequestHeader("X-Parse-Application-Id", '9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz');
                request.setRequestHeader("X-Parse-REST-API-Key", 'Fw3q2oYcK0e8ZdEbEG7dZmEeCEjrQ8smGQCxmqRn');
                request.setRequestHeader("Content-Type", file.type);
            },
            url: serverUrl,
            data: file,
            processData: false,
            contentType: false,
            success: function (data) {
                updatePicture(playerName, data.url)
            },
            error: function (data) {
                var obj = jQuery.parseJSON(data);
                alert(obj.error);
            }
        });
    });
}


function getImageSrc(object, playerName) {

    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.equalTo("playerName", playerName);

    query.first({
        success: function (player) {
            var imgSrc = player.get("profilePic");
            if (imgSrc == undefined) {
                imgSrc = "../img/avatar.jpg";
            }

            $("#player-table").append($("<tr class='player-context-menu'>").append($('<td><img src="' + imgSrc + '"></td>'
                + '<td class="player-name">' + object.get('playerName') + '</td>')).on("click", function () {


                $('.modal-change-player').foundation('reveal', 'open');


                $('.modal-change-player').find(".img-player").attr("src", imgSrc);

                $('.modal-change-player').find(".input-player-name").attr("placeholder", $(this).closest('tr').find('.player-name').text());
                $('#input-player-name-small').on("change", function () {
                    $('#input-player-name-big').val($('#input-player-name-small').val());
                });

                $('.modal-change-player').find('.player-name-change-modal').text($(this).closest('tr').find('.player-name').text());

                $('#input-player-name-big').on("change", function () {
                    $('#input-player-name-small').val($('#input-player-name-big').val());
                });

                $('.modal-change-player').find(".button-save-changes").on("click", function () {
                    saveChangedPlayerName($('.input-player-name').attr("placeholder"), $('.input-player-name').val());
                });

                $('.button-delete-player').on('click', function () {
                    deletePlayer($('.input-player-name').attr("placeholder"));
                });
                uploadFile($('.modal-change-player').find('.input-player-name').attr("placeholder"));

            }));


        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });


}


function showPlayers() {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.ascending("playerName");
    query.find({
        success: function (results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                getImageSrc(object, object.get('playerName'));
            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

}


function saveChangedPlayerName(playerName, newPlayerName) {
    var teamName = Parse.User.current()['attributes']['teamname'] + "_players";
    var team = Parse.Object.extend(teamName);
    var query = new Parse.Query(team);
    query.equalTo("playerName", playerName);

    query.first({
        success: function (player) {

            player.set("playerName", newPlayerName);
            player.save();
            location.reload();
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

}









