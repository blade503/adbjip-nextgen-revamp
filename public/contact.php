<?php
/**
 * Réception des formulaires du site (contact, estimation).
 *
 * Hébergement LWS mutualisé : PHP est disponible, aucun framework n'est
 * nécessaire. Ce fichier part avec le build (Vite recopie public/ dans dist/).
 *
 * Deux sorties, volontairement redondantes :
 *   1. un e-mail à l'agence ;
 *   2. une ligne dans leads.jsonl, sur le serveur.
 * La sauvegarde locale est là parce qu'un envoi qui échoue silencieusement est
 * exactement ce qui a fait perdre huit ans de demandes sur l'ancien site. Même
 * si mail() échoue, la demande reste récupérable.
 *
 * Le fichier leads.jsonl est rendu inaccessible par le .htaccess du site.
 *
 * ÉCRIT POUR PHP 5.6 ET AU-DELÀ, volontairement : l'hébergement LWS sert
 * aujourd'hui PHP 5.6 par défaut, parce que le Symfony encore en production
 * l'exige. Une syntaxe moderne — déclarations de types, opérateur ?? — ne
 * s'analyserait même pas et renverrait une erreur 500 muette : le visiteur
 * croirait avoir envoyé sa demande. Ce fichier doit fonctionner quelle que
 * soit la version servie, y compris si le réglage change par accident.
 * À relire le jour où le site principal passera en PHP 8.
 */

// --- Configuration -----------------------------------------------------------

/** Destinataires par service. La valeur par défaut sert si le service est vide. */
$destinataires = array(
    'defaut'              => 'j.immo.p@orange.fr',
    'gestion-locative'    => 'gerance@adbjip.fr',
    'gestion-copropriete' => 'copro@adbjip.fr',
);

/**
 * Expéditeur technique. Il DOIT appartenir au domaine du site, sinon les
 * fournisseurs de messagerie classent le message en indésirable (SPF).
 * L'adresse du visiteur va en Reply-To, pas en From.
 */
const EXPEDITEUR = 'site@adbjip.fr';

const FICHIER_LEADS = __DIR__ . '/leads.jsonl';

// --- Utilitaires -------------------------------------------------------------

function repondre($code, array $corps)
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($corps, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Lecture d'un champ absent sans opérateur ??, indisponible avant PHP 7. */
function champ(array $donnees, $cle, $defaut = '')
{
    return isset($donnees[$cle]) && is_scalar($donnees[$cle]) ? (string) $donnees[$cle] : $defaut;
}

/** Neutralise les retours à la ligne : sans ça, un champ permet d'injecter des en-têtes. */
function nettoyer($valeur, $longueur = 500)
{
    $valeur = str_replace(["\r", "\n", "\0"], ' ', $valeur);
    return mb_substr(trim(strip_tags($valeur)), 0, $longueur);
}

// --- Entrée ------------------------------------------------------------------

header('X-Content-Type-Options: nosniff');

if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    repondre(405, ['ok' => false, 'erreur' => 'Méthode non autorisée.']);
}

$brut = file_get_contents('php://input');
$donnees = json_decode($brut ? $brut : '', true);
if (!is_array($donnees)) {
    $donnees = $_POST;
}

// Champ leurre : invisible pour un humain, rempli par la plupart des robots.
if (!empty($donnees['website'])) {
    repondre(200, ['ok' => true]);
}

$type    = nettoyer(champ($donnees, 'type', 'contact'), 40);
$nom     = nettoyer(champ($donnees, 'nom'), 120);
$email   = nettoyer(champ($donnees, 'email'), 160);
$tel     = nettoyer(champ($donnees, 'telephone'), 40);
$service = nettoyer(champ($donnees, 'service'), 60);
$message = nettoyer(champ($donnees, 'message'), 5000);
$extra   = isset($donnees['details']) && is_array($donnees['details']) ? $donnees['details'] : [];

$erreurs = [];
if ($nom === '') {
    $erreurs[] = 'nom';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erreurs[] = 'email';
}
if ($message === '' && !$extra) {
    $erreurs[] = 'message';
}
if ($erreurs) {
    repondre(422, [
        'ok'      => false,
        'erreur'  => 'Merci de vérifier les champs signalés.',
        'champs'  => $erreurs,
    ]);
}

// --- Sauvegarde --------------------------------------------------------------

$lead = [
    'date'      => date('c'),
    'type'      => $type,
    'nom'       => $nom,
    'email'     => $email,
    'telephone' => $tel,
    'service'   => $service,
    'message'   => $message,
    'details'   => $extra,
    'ip'        => isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '',
];

$enregistre = @file_put_contents(
    FICHIER_LEADS,
    json_encode($lead, JSON_UNESCAPED_UNICODE) . PHP_EOL,
    FILE_APPEND | LOCK_EX
) !== false;

// --- Envoi -------------------------------------------------------------------

$destinataire = isset($destinataires[$service]) ? $destinataires[$service] : $destinataires['defaut'];

$titre = $type === 'estimation'
    ? "Demande d'estimation — $nom"
    : "Demande de contact — $nom";

$lignes = [
    "Nom       : $nom",
    "E-mail    : $email",
    "Téléphone : " . ($tel !== '' ? $tel : '—'),
    "Service   : " . ($service !== '' ? $service : '—'),
    '',
];

foreach ($extra as $cle => $valeur) {
    if (is_scalar($valeur) && (string) $valeur !== '') {
        $lignes[] = str_pad(nettoyer((string) $cle, 30), 10) . ': ' . nettoyer((string) $valeur, 200);
    }
}

if ($message !== '') {
    $lignes[] = '';
    $lignes[] = 'Message :';
    $lignes[] = $message;
}

$lignes[] = '';
$lignes[] = '— Envoyé depuis le formulaire de https://www.adbjip.fr';

$entetes = implode("\r\n", [
    'From: JIP — site <' . EXPEDITEUR . '>',
    'Reply-To: ' . $nom . ' <' . $email . '>',
    'Content-Type: text/plain; charset=utf-8',
    'X-Mailer: PHP/' . phpversion(),
]);

$envoye = @mail($destinataire, $titre, implode("\n", $lignes), $entetes);

if (!$envoye && !$enregistre) {
    repondre(500, [
        'ok'     => false,
        'erreur' => "L'envoi a échoué. Appelez-nous au 01 42 25 78 24, nous prenons votre demande directement.",
    ]);
}

repondre(200, ['ok' => true]);
