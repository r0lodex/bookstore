<?php
require 'env.php';
require 'orm.php';
require 'factory.php';
require 'Horus.php';
require_once 'Twig/Autoloader.php';

Twig_Autoloader::register();
$app = new Horus();

$app->config->base = '/';

function render($path, $data=null) {
    $loader   = new Twig_Loader_Filesystem('../templates');
    $twig     = new Twig_Environment($loader, array('debug'=>true));

    // Figure out mcm mana nak set global to the template...
    $ENV["BOOKSTORE_TITLE"] = 'Kedai Buku SIH';

    $twig->addExtension(new Twig_Extension_Debug());
    $twig->addGlobal('env', $ENV);

    $template = $twig->loadTemplate($path.'.twig');

    echo $template->render($data);
}


// STATIC PAGES
// =======================================
$app->on('GET /', function() {
    $this->end(render('index', []));

})->on('GET /contact', function() {
    $this->end(render('contact', []));

})->on('GET /how-to', function() {
    $this->end(render('how-to', []));

})->on('GET /booklist', function() {
    $books = [
        'books' => run(Factory::GETBOOKLIST, [])
    ];
    $this->end(render('booklist', $books));

})->on('GET /legal/policy', function() {
    $this->end(render('legal_policy', []));

})->on('GET /legal/tnc', function() {
    $this->end(render('legal_tnc', []));

})->on('GET /shop', function() {
    // Yang ni sepatutnya ada middleware that checks for session
    $this->end(render('shop', []));
});

// FORM SUBMISSION
// =======================================
$app->on('POST /', function() {
    $arr = [
        'email'      => $this->body->email,
        'submitted'  => ($this->body->email) ? true : false,
        'error'      => ($this->body->email) ? false : 'Ruangan ini perlu diisi'
    ];

    $this->end(render('index', $arr));

});

// API ENDPOINTS
// =======================================
$app->on('GET /api/booklist', function() {
    $arr = run(Factory::GETBOOKLIST, []);
    $this->json($arr);
});