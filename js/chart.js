google.load("visualization", "1", {packages: ["corechart"]});
Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");


google.setOnLoadCallback(drawChart);
function drawChart() {
    data = [];
    data.push(['Datum', 'Spieler']);
    var tdata = new google.visualization.DataTable();
    tdata.addColumn('date', 'Datum');
    tdata.addColumn('number', 'Spieler');
    tdata.addColumn({type: 'number', role: 'annotation'});
    var options = {
        title: 'Spieler im Training'
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    function getDataForChart() {
        var teamName = Parse.User.current()['attributes']['teamname'] + "_trDates";
        var trDates = Parse.Object.extend(teamName);
        var query = new Parse.Query(trDates);

        query.find({
            success: function (results) {
                // Do something with the returned Parse.Object values
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    tdata.addRow([new Date(object.get('dateTraining')), parseInt(object.get('trPlayerCount')), parseInt(object.get('trPlayerCount'))]);
//                    tdata.addRow(["2014" , parseInt(object.get('trPlayerCount'))]);
                }
                data.sort(function (x, y) {
                    return x > y;
                });
                console.log(data);
//                tdata = new google.visualization.arrayToDataTable(data);
                chart.draw(tdata, options);
            },
            error: function (error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    }

    getDataForChart();


}