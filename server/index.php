<?php
/*

    1 - Setup static folder using Horus
    2 - Deny public access to non-static folders

*/


require 'Horus.php';
require_once 'Twig/Autoloader.php';

Twig_Autoloader::register();
$app = new Horus();

function _template($path, $data=null) {
    $loader   = new Twig_Loader_Filesystem('../templates');
    $twig     = new Twig_Environment($loader, array('debug'=>true));

    // Figure out mcm mana nak set global to the template...
    $ENV["BOOKSTORE_TITLE"] = 'Kedai Buku SIH';

    $twig->addExtension(new Twig_Extension_Debug());
    $twig->addGlobal('env', $ENV);

    $template = $twig->loadTemplate($path.'.twig');

    echo $template->render($data);
}

$app->on('GET /', function() {
    $this->end(_template('index', []));
})->on('GET /contact', function() {
    $this->end(_template('contact', []));
})->on('GET /how-to', function() {
    $this->end(_template('how-to', []));
})->on('GET /dashboard', function() {
    $this->end(_template('dashboard', []));
});