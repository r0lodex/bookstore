<?php
require 'Horus.php';
require_once 'Twig/Autoloader.php';

Twig_Autoloader::register();
$app = new Horus();

$app->config->base = '/';

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

$app->on('/', function() {
    $this->end(_template('index', []));
})->on('/contact', function() {
    $this->end(_template('contact', []));
})->on('/how-to', function() {
    $this->end(_template('how-to', []));
})->on('/legal/policy', function() {
    $this->end(_template('legal_policy', []));
})->on('/legal/tnc', function() {
    $this->end(_template('legal_tnc', []));
})->on('/dashboard', function() {
    // Yang ni sepatutnya ada middleware that checks for session
    $this->end(_template('dashboard', []));
});