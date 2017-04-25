<?php
/**
 * Created by PhpStorm.
 * User: Michael Kovalsky
 * Date: 4/24/2017
 * Time: 10:11 PM
 */

if(isset($_GET['reg']) && isset($_GET['hash']) && isset($_GET['cat'])) {

    $reg = $_GET['reg'];
    $hash = $_GET['hash'];
    $cat = $_GET['cat'];

    echo "u done good";

} else {
    echo "YOU DONE FUCKED IT UP!";
}