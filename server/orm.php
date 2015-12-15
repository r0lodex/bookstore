<?php

function run($query, $param, $action='', $db=null) {
    $response = false;
    $db = new db(null, $db);
    $db->query($query);
    $db->execute($param);

    switch($action) {
        case 'fetch':
            $response = $db->fetch();
        break;
        case 'update':
            $response = $db;
        break;
        case 'insert':
            $response = $db->lastInsertId();
        break;
        default:
            $response = $db->fetchset();
        break;
    }
    return $response;
}

class db{
    private $dbh;
    private $stmt;
    private $error;

    public function __construct($opt=null, $db=null){
        $host = DB_HOST;
        $user = DB_USER;
        $pass = DB_PASS;
        $dbname = (!$db) ? DB_NAME: $db;

        // Set DSN
        $dsn = 'mysql:host=' .$host . ';dbname=' .$dbname;
        // Set options
        $options = array(
            PDO::ATTR_PERSISTENT         => true,
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
        );
        // Create a new PDO instance
        try{
            $this->dbh = new PDO($dsn, $user, $pass, $options);
        }
        // Catch any errors
        catch(PDOException $e){
            $this->error = $e->getMessage();
        }
    }

    public function query($query){
        $this->stmt = $this->dbh->prepare($query);
    }

    public function bind($param, $value, $opt = null, $type = null){
        if (is_null($type)){
            switch (true){
                case is_int($value):
                    $type = PDO::PARAM_INT;
                    break;
                case is_bool($value):
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($value):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;
            }
        }
        if($opt == 'param'){
            $this->stmt->bindParam($param, $value, $type);
        }else{
            $this->stmt->bindValue($param, $value, $type);
        }
    }

    public function execute($prm){
        return $this->stmt->execute($prm);
    }

    public function fetch($opt = null){
        if($opt == 'asc'){
            return $this->stmt->fetch(PDO::FETCH_ASSOC);
        }elseif ($opt == 'both'){
            return $this->stmt->fetch(PDO::FETCH_BOTH);
        }else{
            return $this->stmt->fetch(PDO::FETCH_OBJ);
        }
    }

    public function fetchset($opt = null){
        if($opt == 'asc'){
            return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
        }elseif ($opt == 'both'){
            return $this->stmt->fetchAll(PDO::FETCH_BOTH);
        }else{
            return $this->stmt->fetchAll(PDO::FETCH_OBJ);
        }
    }

    public function result($opt = null){
        $this->stmt->execute();
        if($opt == 'asc'){
            return $this->stmt->fetch(PDO::FETCH_ASSOC);
        }elseif ($opt == 'both'){
            return $this->stmt->fetch(PDO::FETCH_BOTH);
        }else{
            return $this->stmt->fetch(PDO::FETCH_OBJ);
        }
    }

    public function resultset($opt = null){
        $this->stmt->execute();
        if($opt == 'asc'){
            return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
        }elseif ($opt == 'both'){
            return $this->stmt->fetchAll(PDO::FETCH_BOTH);
        }else{
            return $this->stmt->fetchAll(PDO::FETCH_OBJ);
        }
    }

    public function rowCount(){
        return $this->stmt->rowCount();
    }

    public function lastInsertId(){
        return $this->dbh->lastInsertId();
    }

    public function beginTransaction(){
        return $this->dbh->beginTransaction();
    }
    public function endTransaction(){
        return $this->dbh->commit();
    }

    public function cancelTransaction(){
        return $this->dbh->rollBack();
    }

    public function debugDumpParams(){
        return $this->stmt->debugDumpParams();
    }

    public function close(){
        $this->dbh = null;
        return true;
    }
}