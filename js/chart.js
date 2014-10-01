/**
 * Created by max on 01.10.14.
 */
google.load("visualization", "1", {packages: ["corechart"]});
Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");


google.setOnLoadCallback(drawChart);
function drawChart() {
    var tdata = new google.visualization.DataTable();
    tdata.addColumn('date', 'Datum');
    tdata.addColumn('number', 'Spieler');
    function getDataForChart() {
        var teamName = Parse.User.current()['attributes']['teamname'] + "_trDates";
        var trDates = Parse.Object.extend(teamName);
        var query = new Parse.Query(trDates);

        query.find({
            success: function (results) {
                // Do something with the returned Parse.Object values
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    tdata.addRow([new Date(object.get('dateTraining')), parseInt(object.get('trPlayerCount'))]);
                }
            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }

    getDataForChart();

    console.log(tdata);
    var options = {
        title: 'Spieler im Training'
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    chart.draw(tdata, options);
}