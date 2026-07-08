<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitizzazione dati
    $nome = strip_tags(trim($_POST["nome"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $telefono = strip_tags(trim($_POST["telefono"]));
    $servizio = strip_tags(trim($_POST["servizio"]));
    $quantita = filter_var(trim($_POST["quantita"]), FILTER_SANITIZE_NUMBER_INT);
    $carta = strip_tags(trim($_POST["carta"]));
    $nobilitazione = strip_tags(trim($_POST["nobilitazione"]));
    $dettagli = strip_tags(trim($_POST["dettagli"]));

    // Destinatario
    $destinatario = "tipografiaresta@gmail.com";

    // Oggetto email
    $soggetto = "Nuovo Preventivo dal Sito Web: " . $nome;

    // Contenuto email
    $corpo = "Hai ricevuto una nuova richiesta di preventivo dal sito web:\n\n";
    $corpo .= "Nome/Azienda: $nome\n";
    $corpo .= "Email: $email\n";
    $corpo .= "Telefono: $telefono\n\n";
    $corpo .= "--- Dettagli Stampa ---\n";
    $corpo .= "Servizio richiesto: $servizio\n";
    $corpo .= "Tiratura (Quantità): $quantita\n";
    $corpo .= "Tipo di carta: $carta\n";
    $corpo .= "Finitura/Nobilitazione: $nobilitazione\n\n";
    $corpo .= "Note/Dettagli aggiuntivi:\n$dettagli\n";

    // Intestazioni email
    $headers = "From: Nuova Tipolitografia Resta <no-reply@tipografiaresta.it>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Invio
    if (mail($destinatario, $soggetto, $corpo, $headers)) {
        http_response_code(200);
        echo "Success";
    } else {
        http_response_code(500);
        echo "Error";
    }
} else {
    http_response_code(403);
    echo "Access denied";
}
?>
