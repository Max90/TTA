$(document).ready(function () {
    $('#button-add-player').on('click', function () {
        addNewPlayer("add-player");
    });
    $('#button-add-next-player').on('click', function () {
        addNewPlayer("add-next-player");
    });
});


function addNewPlayer(string) {
    var playerName = $('#input-player-name').val();
    if(string == "add-player"){
        $('#modal-add-player').foundation('reveal', 'close');
        $('#input-player-name').val("");
        $('#input-player-name').attr("placeholder", "Vorname Nachname");
    }else{
        $('#input-player-name').val("");
        $('#input-player-name').attr("placeholder", "Vorname Nachname");
    }
}
