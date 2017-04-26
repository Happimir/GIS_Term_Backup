<?php
require_once("../twitter_php_interface/TwitterAPIExchange.php");

/**
 * Created by PhpStorm.
 * User: Michael Kovalsky
 * Date: 4/25/2017
 * Time: 7:06 PM
 */

$credentials = array(
    'oauth_access_token' => "847109906826186752-IqDb0ueSTWvNpx7PH24h8w9FrKOCJza",
    'oauth_access_token_secret' => "fInPOqtpCNd5wVONyQPHofxFepUbMuir1s1kWib8FUFIu",
    'consumer_key' => "jyIwjRE1QwU4yAFCuJRF1W2ND",
    'consumer_secret' => "lhtxvG8TYIy1DrxjLMkU22EqVU9tK5Zn2y3s521Y91m7HH3kHn"
);

$url = "https://api.twitter.com/1.1/search/tweets.json";
$urlTweetEmbed = "https://publish.twitter.com/oembed";
$requestMethod = "GET";

if(isset($_GET['reg']) && isset($_GET['hash']) && isset($_GET['cat']))  {

    $reg = $_GET['reg'];
    $hash = $_GET['hash'];
    $cat = $_GET['cat'];

    $query = '?q=' . $_GET['hash'] . '&count=15';

    $twitter = new TwitterAPIExchange($credentials);
    $result = json_decode($twitter->setGetfield($query)
    ->buildOauth($url, $requestMethod)
    ->performRequest(), $assoc = TRUE);



    $tweet = '';
    $tweetArray = array();

    foreach ($result as $item) {
        foreach ($item as $work) {
            $tweet = $work['text'];
            array_push($tweetArray, $tweet);
        }
    }


    $dsn = 'mysql:host=localhost:3306;dbname=gis_term_dynamic;charset=utf8';
    $user = 'root'; //Insert your username in here when testing.
    $pass = 'Jaljap2732!';//Insert your password in here when testing.
    $dbh = new PDO($dsn, $user, $pass);
    $dbh->exec("set names utf8");

    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);

    foreach ($tweetArray as $item) {
        $sql = "INSERT INTO tweet (region, category, tweet, sentiment) VALUES(?, ?, ?, ?)";
        $execute = $dbh->prepare($sql);
        $execute->execute(array($_GET['reg'], $_GET['cat'], $item, -1));
    }

    //C:xampp\htdocs\GIS\GIS_Fixed_Term\botCode\sentiment.js
    sleep(40);


} else {
    echo "Something is not set";
}