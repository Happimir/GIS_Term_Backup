//all great things, start small

var mysql = require('mysql'); //mysql
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js'); //watson natural language processing. 
//dacd2a8f-6765-4925-9a67-b90aef0578ec
//plqnAWZXxGkH
var watson = new NaturalLanguageUnderstandingV1({
    'username': '5f6afa50-edb8-48ce-818a-297e972f000d',
    'password': 'nQTD1RdoKLqb',
    'version_date': '2017-02-27'
});


var globalCounter = 0;
var parameters = {
    'text': '',

    'features': {
        'entities': {
            'emotion': false,
            'sentiment': true,
            'limit': 2
        },
        'keywords': {
            'emotion': false,
            'sentiment': true,
            'limit': 2
        }
    }
};

var async = require("async");

var con = mysql.createConnection(
    {

        host: "localhost",
        user: "root",
        port:"3306",
        password: "Jaljap2732!",
        dateStrings: true,
        datebase: "gis_term_dynamic"
    });

function doConnect() {
    con.connect(function(err) {
        if(err) {
            console.log("Error Connecting " + err);
        } else {
            console.log("DEUS VULT, INFIDEL!");
            populateArray();
        }
    });
}

var array = [];
function populateArray() {

    console.log("Running Inititated");
    var iterator = 0;
    con.query("use gis_term_dynamic");
    con.query("select * from tweet t where t.sentiment = -1;" , function(err, rows, fields) {
        if(err) {
            console.log("Select error: " + err);
        } else {

            for(var i in rows) {
                iterator++;
                array.push(rows[i].tweet);

                if(iterator >= rows.length) {
                    console.log("iterator is: " + iterator);
                    console.log("Length is: " + rows.length);
                    console.log("array length is: " + array.length);
                    console.log("GOing to create sentiment");
                    createSentiment(array, 0);

                }
            }
        }
    });
}

var watsonSentiment = [];
function createSentiment(result, index) {

    var localArray = result;
    console.log("In create sentiment");
    var iterator = 0;
    var innerIndex = index;
    var avg = 0;

    console.log("innerIndex: " + innerIndex);
    console.log("array length: " + localArray.length);
    if(globalCounter >= 20) {
        console.log("inserting to sql");
        insertIntoSQL(watsonSentiment);
    }

    parameters.text = localArray[globalCounter];
    globalCounter++;
    console.log("Text: " + parameters.text);
    //select * from tweet t where t.sentiment is null;
    //694
    watson.analyze(parameters, function(err, data) {

        if(err) {
            console.log("Error in Analyze: " + err);
            watsonSentiment.push(0.50);
            createSentiment(localArray, globalCounter);

        } else {

            try {



                if(data['keywords'].length) {
                    for(var i = 0; i < data['keywords'].length; i++) {
                        iterator++;
                        try {
                            avg = avg + data['keywords'][i]['sentiment'].score;
                        } catch(e) {

                            watsonSentiment.push(0.50);
                            createSentiment(localArray, globalCounter);
                        }

                        if(iterator == data['keywords'].length) {
                            avg = avg/(data['keywords'].length);
                            watsonSentiment.push(avg);

                            createSentiment(localArray, globalCounter);
                        }
                    }
                } else {
                    watsonSentiment.push(0.50);
                }

            } catch (e){

            }
        }


    });


}

function insertIntoSQL(watsonArray) {

    var localArray = watsonArray;
    //var localIndex = myIndex;
    var iterator = 0;

    con.query("use gis_term_dynamic");
    con.query("select * from tweet t where t.sentiment = -1;", function(err, rows) {
        if(err) {
            console.log("Selection error: " + err);
        } else {
            for(var k in rows) {
                con.query("use gis_term_dynamic");
                con.query("UPDATE tweet SET ? WHERE ?", [{sentiment: localArray[k]}, {id: rows[k].id}], function(err) {
                    if(err) {
                        iterator++;
                        console.log("Error in updating: " + err);
                    } else {
                        iterator++;
                        console.log("Successfully Updated");
                    }
                });

                if(iterator == rows.length || iterator >= 20) {
                    process.exit();
                }
            }
        }
    });


}

doConnect();
setInterval(populateArray, 2000);