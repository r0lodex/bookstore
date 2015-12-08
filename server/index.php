<?php

require 'Horus.php';
require_once 'Twig/Autoloader.php';

Twig_Autoloader::register();
$app = new Horus();

function _template($path, $data=null) {
    $loader   = new Twig_Loader_Filesystem('../templates');
    $twig     = new Twig_Environment($loader, array('debug'=>true));

    $twig->addExtension(new Twig_Extension_Debug());

    $template = $twig->loadTemplate($path.'.twig');

    echo $template->render($data);
}

$app->on('GET /', function() {
    $this->render(_template('index', []));
});

$app->on('GET /about', function() {
    $this->render(_template('about', []));
});

$app->on('GET /contact', function() {
    $this->render(_template('contact', []));
});

$app->on('GET /how-to', function() {
    $this->render(_template('how-to', []));
});

$app->on('GET /dashboard', function() {
    $this->render(_template('dashboard', []));
});