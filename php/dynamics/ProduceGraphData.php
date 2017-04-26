<?php
/**
 * Created by PhpStorm.
 * User: Michael Kovalsky
 * Date: 4/24/2017
 * Time: 11:32 PM
 */

if(isset($_GET['reg']) && isset($_GET['hash']) && isset($_GET['cat'])) {


    $reg = $_GET['reg'];
    $hash = $_GET['hash'];
    $cat = $_GET['cat'];

    $dsn = 'mysql:host=localhost:3306;dbname=gis_term_dynamic;charset=utf8';
    $user = 'root'; //Insert your username in here when testing.
    $pass = 'Jaljap2732!';//Insert your password in here when testing.
    $dbh = new PDO($dsn, $user, $pass);

    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);


    $sqlQuery = "SELECT * FROM tweet t WHERE t.category = ? AND t.region = ? AND t.tweet LIKE '%'".$hash."'%'";
    $execute = $dbh ->prepare($sqlQuery);
    $execute->execute(array($cat, $reg));

    $result = $execute->fetchAll();
    $arrayResult = array();

    foreach ($result as $item) {

        if(floatval($item['sentiment']) < -0.20 )
            array_push($arrayResult,  array(array("sentiment" => "negative", "score" => $item['sentiment'])));
        if(floatval($item['sentiment']) > 0.20 )
            array_push($arrayResult,  array(array("sentiment" => "positive","score" => $item['sentiment'])));
        if(floatval($item['sentiment']) < 0.20 && floatval($item['sentiment']) > -0.20)
            array_push($arrayResult,  array(array("sentiment" => "neutral","score" => $item['sentiment'])));
    }

    echo json_encode($arrayResult);


} else {
    echo "YOU FORGOT TO SET SOMETHING, BOY!";
}
