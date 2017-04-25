/**
 * Created by Michael Kovalsky on 4/25/2017.
 */

function sendData() {

    $("#submission_one").submit(function (e) {
       e.preventDefault();
    });

    $("#submission_two").submit(function (e) {
        e.preventDefault();
    });
    processData();
}

function processData() {

    var rOne = $("#region_one").val();
    var hOne = $("#hashtag_one").val();
    var cOne = $("#category_one").val();

    var rTwo = $("#region_two").val();
    var hTwo = $("#hashtag_two").val();
    var cTwo = $("#category_two").val();

    var result;

    var pArOne = [];
    var nArOne = [];
    var ntArOne = [];

    var pAvgOne = 0.0;
    var nAvgOne = 0.0;
    var ntAvgOne = 0.0;

    var pArTwo = [];
    var nArTwo = [];
    var ntArTwo = [];

    var pAvgTwo = 0.0;
    var nAvgTwo = 0.0;
    var ntAvgTwo = 0.0;

    $.when(

        $.get("../php/PrintOutTweets.php",
            {
                reg: rOne,
                hash: hOne,
                cat: cOne
            }, function (data) {

                $("#left-tweets").html(data);

            }),
        $.get("../php/PrintOutTweets.php",
            {
                reg: rTwo,
                hash: hTwo,
                cat: cTwo
            }, function (data) {
                $("#right-tweets").html(data);
            }
        ),
        $.get("../php/ProduceGraphData.php",
            {
                reg: rOne,
                hash: hOne,
                cat: cOne
            }, function (data_two) {


                result = JSON.parse(data_two);

                for(var i = 0; i < result.length; i++) {

                    console.log(result[i][0].score);

                    if(result[i][0].sentiment == 'negative') {
                        nArOne.push(result[i][0].score);
                    }
                    if(result[i][0].sentiment == 'positive') {
                        pArOne.push(result[i][0].score);
                    }
                    if(result[i][0].sentiment == 'neutral') {
                        ntArOne.push(result[i][0].score);
                    }
                }

                for(var k = 0; k < pArOne.length; k++) {
                    pAvgOne += parseFloat(pArOne[k]);
                }
                for(var j = 0; j < nArOne.length; j++) {
                    nAvgOne += parseFloat(nArOne[j]);
                }
                for(var l = 0; l < ntArOne.length; l++) {
                    ntAvgOne += parseFloat(ntArOne[l]);
                }

                pAvgOne = pAvgOne/(pArOne.length);
                nAvgOne = nAvgOne/(nArOne.length);
                ntAvgOne = ntAvgOne/(ntArOne.length);

                if(isNaN(ntAvgOne)) {
                    ntAvgOne = 0.0;
                }

                console.log("Positive 1 Avg: " + pAvgOne);
                console.log("Negative 1 Avg: " + nAvgOne);
                console.log("Neutral 1 Avg: " + ntAvgOne);
            }),
        $.get("../php/ProduceGraphData.php",
            {
                reg: rTwo,
                hash: hTwo,
                cat: cTwo
            }, function (data_two) {


                result = JSON.parse(data_two);

                for(var i = 0; i < result.length; i++) {

                    console.log(result[i][0].score);

                    if(result[i][0].sentiment == 'negative') {
                        nArTwo.push(result[i][0].score);
                    }
                    if(result[i][0].sentiment == 'positive') {
                        pArTwo.push(result[i][0].score);
                    }
                    if(result[i][0].sentiment == 'neutral') {
                        ntArTwo.push(result[i][0].score);
                    }
                }

                for(var k = 0; k < pArTwo.length; k++) {
                    pAvgTwo += parseFloat(pArTwo[k]);
                }
                for(var j = 0; j < nArTwo.length; j++) {
                    nAvgTwo += parseFloat(nArTwo[j]);
                }
                for(var l = 0; l < ntArTwo.length; l++) {
                    ntAvgTwo += parseFloat(ntArTwo[l]);
                }

                pAvgTwo = pAvgTwo/(pArTwo.length);
                nAvgTwo = nAvgTwo/(nArTwo.length);
                ntAvgTwo = ntAvgTwo/(ntArTwo.length);

                if(isNaN(ntAvgTwo)) {
                    ntAvgTwo = 0.0;
                }

                console.log("Positive 2 Avg: " + pAvgTwo);
                console.log("Negative 2 Avg: " + nAvgTwo);
                console.log("Neutral 2 Avg: " + ntAvgTwo);
            })
    ).then(function () {
        drawLeftGraph(pAvgOne, nAvgOne, ntAvgOne, pArOne, nArOne, ntArOne);
        drawRightGraph(pAvgTwo, nAvgTwo, ntAvgTwo, pArTwo, nArTwo, ntArTwo);

    });
}

function drawLeftGraph(posAvg, negAvg, neutAvg, posArr, negArr, neuArr) {

    var posAvgs = posAvg;
    var neutAvgs = neutAvg;
    var negAvgs = negAvg;
    var posArrs = posArr;
    var negArrs= negArr;
    var neuArrs = neuArr;


    console.log("Positive Left Avg: " + posAvg);
    console.log("Negative Left Avg: " + negAvg);
    console.log("Neutral Left Avg: " + neutAvg);

    //graph cannot display negative values.
    negAvgs = -1 * negAvgs;

    if(neutAvg < 0) {
        neutAvgs = -1 * neutAvgs;
    }

    //left graph is for avg sentiments
    $("#left-graph_one").highcharts({

        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: "Averages Pie Chart"
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Averages',
            colorByPoint: true,
            data: [{
                name: 'Negative Average',
                y: negAvgs
            }, {
                name: 'Positive Average',
                y: posAvgs
            }, {
                name: "Neutral Averages",
                y: neutAvgs
            }
            ]
        }]

    });

    //right is for total number
    $("#right-graph_one").highcharts({

        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: "Number of Occurrences"
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Count of Instances',
            colorByPoint: true,
            data: [{
                name: 'Negative Count',
                y: negArrs.length
            }, {
                name: 'Positive Count',
                y: posArrs.length
            }, {
                name: "Neutral Count",
                y: neuArrs.length
            }
            ]
        }]

    });



}

function drawRightGraph(posAvg, negAvg, neutAvg, posArr, negArr, neuArr) {

    var posAvgs = posAvg;
    var neutAvgs = neutAvg;
    var negAvgs = negAvg;
    var posArrs = posArr;
    var negArrs= negArr;
    var neuArrs = neuArr;


    console.log("Positive Right Avg: " + posAvg);
    console.log("Negative Right Avg: " + negAvg);
    console.log("Neutral Right Avg: " + neutAvg);

    //graph cannot display negative values.
    negAvgs = -1 * negAvgs;

    if(neutAvg < 0) {
        neutAvgs = -1 * neutAvgs;
    }

    //left graph is for avg sentiments
    $("#left-graph_two").highcharts({

        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: "Averages Pie Chart"
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Averages',
            colorByPoint: true,
            data: [{
                name: 'Negative Average',
                y: negAvgs
            }, {
                name: 'Positive Average',
                y: posAvgs
            }, {
                name: "Neutral Averages",
                y: neutAvgs
            }
            ]
        }]

    });

    //right is for total number
    $("#right-graph_two").highcharts({

        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: "Number of Occurrences"
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Count of Instances',
            colorByPoint: true,
            data: [{
                name: 'Negative Count',
                y: negArrs.length
            }, {
                name: 'Positive Count',
                y: posArrs.length
            }, {
                name: "Neutral Count",
                y: neuArrs.length
            }
            ]
        }]

    });



}