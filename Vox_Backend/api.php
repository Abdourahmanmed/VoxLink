<?php

// Inclure le fichier autoload

use App\Controller\AppelContactControl;
use App\Controller\CompagneControl;
use App\Controller\ContactControl;
use App\Controller\DemandeLivraisonControl;
use App\Controller\UserControl;

require_once __DIR__ . '/autolaod.php';

// Définir les en-têtes de réponse
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permettre les requêtes de toutes les origines
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS'); // Méthodes HTTP autorisées
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // En-têtes autorisés
header('Access-Control-Allow-Credentials: true'); // Permettre l'envoi de cookies et autres informations d'identification


// Gérer les requêtes préliminaires OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
$user = new UserControl();
$contact = new ContactControl();
$compagner = new CompagneControl();
$appel = new AppelContactControl();
$Demande = new DemandeLivraisonControl();

$method = $_GET['method'] ?? null; // Vérifier si le paramètre 'method' est défini

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($method === "Compagnes") {
        $compagner->afficher_compagner();
    } elseif ($method === "DemandeLivraison") {
        $Demande->Afficher();
    }elseif ($method === "DeleteCompagne") {
        $id = $_GET['id'];
        $compagner->Supprimer($id);
    }elseif ($method === "AfficherCompagneParId") {
        $id = $_GET['id'];
        $compagner->AfficherParId($id);
    }elseif ($method === "AfficherContactClassique") {
        $id = $_GET['id'];
        $contact->AfficherContactClassique($id);
    }elseif ($method === "AfficherPourSuperviseur") {
        $user->AfficherPourSuperviseur();
    }elseif ($method === "AfficherUserById") {
        $id = $_GET['id'];
        $user->AfficherUserById($id);
    }elseif ($method === "SuprimerUser") {
        $id = $_GET['id'];
        $user->Suprimer($id);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') { // enregistre des information avec la methode poste
    if ($method === 'Connexion') {
        $data = file_get_contents('php://input');
        if ($data) {
            $user->Login($data);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
    } elseif ($method === 'Appel') {
        $data = file_get_contents('php://input');
        if ($data) {
            $appel->ajouterAppel($data);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
    } elseif ($method === 'CompagneParNom') {
        $data = file_get_contents('php://input');
        if ($data) {
            $compagner->afficher_compagner_par_nom($data);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
    } elseif ($method === 'ContactsTEleconseil') {
        $data = file_get_contents('php://input');
        if ($data) {
            $contact->afficher_contact($data);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
    } elseif ($method === 'AjouterDemande') {
        $data = file_get_contents('php://input');
        $id = $_GET['id'];
        if ($data) {
            $Demande->AjouterDemamde($id, $data);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
    } elseif ($method === 'AfficherParCompagne') {
        $data = file_get_contents('php://input');
        if ($data) {
            $appel->AfficherRapel($data);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
    } elseif ($method === 'AfficherStatusCallMessage') {
        $id = $_GET['id'];
        if ($id) {
            $appel->AfficherStatusCallMessage($id);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
    } elseif ($method === 'ModifierAppel') {
        $data = file_get_contents('php://input');
        $id = $_GET['id'];
        if ($data) {
            $appel->Modifier($id,$data);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
    }elseif ($method === 'AjouterCompagne') {
        $data = file_get_contents('php://input');
        $id = $_GET['id'];
        if ($data) {
            $compagner->AjouterCompagne($id, $data);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
    }elseif ($method === 'EditerCompagne') {
        $data = file_get_contents('php://input');
        $id = $_GET['id'];
        if ($data) {
            $compagner->Editer($id, $data);
        } else {
            $data = file_get_contents('php://input');
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
    }elseif ($method === "AfficherContactAujourdhui") {
        $data = file_get_contents('php://input');
        if ($data) {
            $contact->AfficherParToday($data);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
       
    }elseif ($method === "AfficherAppelPositiveParCompagne") {
        $data = file_get_contents('php://input');
        if ($data) {
            $appel->AfficherAppelPositive($data);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
       
    }elseif ($method === "AfficherAppelNegativeParCompagne") {
        $data = file_get_contents('php://input');
        if ($data) {
            $appel->AfficherAppelNegative($data);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
       
    }elseif ($method === "EditerUnContact") {
        $data = file_get_contents('php://input');
        $id = $_GET['id'];
        if ($data) {
            $contact->EditerContact($data,$id);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
       
    }elseif ($method === "AjouterUser") {
        $data = file_get_contents('php://input');
        if ($data) {
            $user->Ajouter($data);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
       
    }elseif ($method === "EditerUnUser") {
        $data = file_get_contents('php://input');
        $id = $_GET['id'];
        if ($data) {
            $user->Editer($id,$data);
        } else {
            echo json_encode(['error' => 'Missing data for CreateUser']);
        }
       
    }
} else {
    header("HTTP/1.1 404 Not Found");
    echo json_encode(['error' => 'Invalid request method']);
}
