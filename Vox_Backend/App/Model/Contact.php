<?php

namespace App\Model;

use App\Db\Db;
use PDOException;
use PDO;

class Contact
{
  private $db;
  public function __construct()
  {
    $this->db = new Db();
  }

  public function Ajouter() {}

  public function AfficherParId($idCompagne)
  {
    try {
      // Décodage du JSON pour extraire le nom de la compagne
      $compagneData = json_decode($idCompagne, true);
      $nom = $compagneData['Nom'];

      // Préparation de la première requête SQL pour récupérer l'ID de la compagne
      $sql1 = "SELECT id FROM compagner WHERE Nom = :nom";
      $stmt1 = $this->db->getPdo()->prepare($sql1);
      $stmt1->bindParam(':nom', $nom);
      $stmt1->execute();

      // Vérification si la compagne existe
      if ($stmt1->rowCount() > 0) {
        $data = $stmt1->fetch(PDO::FETCH_ASSOC);
        $idCompagne = $data['id'];

        // Préparation de la requête SQL pour récupérer les contacts associés
        $sql = "SELECT c.id, c.Nom, c.Telephone, co.Script 
                FROM contact c 
                JOIN compagner co ON c.Id_compagner = co.id 
                WHERE c.Id_compagner = :idCompagne 
                AND c.id NOT IN (SELECT id_contact FROM appel_contact);
                ";
        $stmt = $this->db->getPdo()->prepare($sql);
        $stmt->bindParam(':idCompagne', $idCompagne);
        $stmt->execute();

        // Vérification s'il y a des résultats
        if ($stmt->rowCount() > 0) {
          // Récupération des résultats sous forme de tableau associatif
          $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
          // Encodage en JSON pour l'affichage
          echo json_encode($contacts);
        } else {
          // Si aucune donnée n'est trouvée
          echo json_encode(["error" => "Aucun contact trouvé pour cette compagne."]);
        }
      } else {
        // Si la compagne n'existe pas
        echo json_encode(["error" => "Cette compagne n'existe pas."]);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  public function AfficherAujourdhui($Jsondata)
  {
    try {
      // Décodage du JSON en tableau associatif
      $data = json_decode($Jsondata, true);

      // Première requête pour obtenir l'ID de la campagne
      $sql = "SELECT id FROM compagner WHERE Nom = :nom";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->bindParam(':nom', $data['Compagne']);
      $stmt->execute();

      if ($stmt->rowCount() > 0) {
        // Récupération de l'ID
        $id = $stmt->fetch(PDO::FETCH_ASSOC)['id'];

        // Seconde requête pour récupérer les contacts du jour
        $sql1 = "SELECT c.* FROM contact c, compagner co 
                       WHERE c.Date_Enregistrement = CURRENT_DATE 
                       AND c.Id_compagner = co.id 
                       AND co.id = :id";
        $stmt1 = $this->db->getPdo()->prepare($sql1);
        $stmt1->bindParam(':id', $id);
        $stmt1->execute();

        // Vérification et retour des résultats
        if ($stmt1->rowCount() > 0) {
          $contact = $stmt1->fetchAll(PDO::FETCH_ASSOC);
          echo json_encode($contact);
        } else {
          echo json_encode(["error" => "Aucun contact enregistré aujourd'hui pour cette compagne."]);
        }
      } else {
        echo json_encode(["error" => "Cette campagne n'existe pas."]);
      }
    } catch (PDOException $e) {
      echo json_encode(['error' => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }
  //fonction qui affiche un contact par son id .
  public function AfficherContactClassique($idcontact)
  {
    try {
      // Requête pour sélectionner un contact par son ID
      $sql = "SELECT * FROM contact WHERE id = :id";
      $stmt = $this->db->getPdo()->prepare($sql);

      // Liaison de la variable :id à la valeur de $idcontact
      $stmt->bindParam(":id", $idcontact);

      // Exécution de la requête
      $stmt->execute();

      // Vérification si un contact a été trouvé
      if ($stmt->rowCount() > 0) {
        $contactData = $stmt->fetch(PDO::FETCH_ASSOC);
        // Encodage des résultats en JSON
        echo json_encode($contactData);
      } else {
        // Aucune donnée trouvée
        echo json_encode(["error" => "Aucun contact trouvé."]);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs PDO
      echo json_encode(["error" => "Erreur lors de la récupération : " . $e->getMessage()]);
    }
  }



//  fonction qui permet de modifier un contact 
  public function Editer($jsonData, $id_contact)
  {
    try {
      // Décodage du JSON en tableau associatif
      $data = json_decode($jsonData, true);

      // Vérification des données requises
      if (
        isset($id_contact) && isset($data['Adresse']) && isset($data['Date_Abonnement']) &&
        isset($data['Email']) && isset($data['Frais_Douane']) && isset($data['Frais_Postaux']) &&
        isset($data['Nationalite']) && isset($data['Nom']) && isset($data['Nombre_colis']) &&
        isset($data['Poids']) && isset($data['Provenance']) && isset($data['Reference']) &&
        isset($data['Telephone'])
      ) {
        // Préparation de la requête SQL avec PDO
        $sql = "UPDATE contact SET 
                        Adresse = :Adresse, 
                        Date_Abonnement = :Date_Abonnement, 
                        Email = :Email, 
                        Frais_Douane = :Frais_Douane, 
                        Frais_Postaux = :Frais_Postaux, 
                        Nationaliter = :Nationalite, 
                        Nom = :Nom, 
                        Nombre_colis = :Nombre_colis, 
                        Poids = :Poids, 
                        Provenance = :Provenance, 
                        Reference = :Reference, 
                        Telephone = :Telephone
                    WHERE id = :id_contact";

        // Préparer la requête avec PDO
        $stmt = $this->db->getPdo()->prepare($sql);

        // Lier les paramètres avec bindParam
        $stmt->bindParam(':Adresse', $data['Adresse']);
        $stmt->bindParam(':Date_Abonnement', $data['Date_Abonnement']);
        $stmt->bindParam(':Email', $data['Email']);
        $stmt->bindParam(':Frais_Douane', $data['Frais_Douane']);
        $stmt->bindParam(':Frais_Postaux', $data['Frais_Postaux']);
        $stmt->bindParam(':Nationalite', $data['Nationalite']);
        $stmt->bindParam(':Nom', $data['Nom']);
        $stmt->bindParam(':Nombre_colis', $data['Nombre_colis']);
        $stmt->bindParam(':Poids', $data['Poids']);
        $stmt->bindParam(':Provenance', $data['Provenance']);
        $stmt->bindParam(':Reference', $data['Reference']);
        $stmt->bindParam(':Telephone', $data['Telephone']);
        $stmt->bindParam(':id_contact', $id_contact);

        // Exécuter la requête
        $stmt->execute();

        // Vérification du succès de la mise à jour
        if ($stmt->rowCount() > 0) {
          echo json_encode(["success" => "Contact modifié avec succès."]);
        } else {
          echo json_encode(["error" => "Aucun changement détecté, le contact n'a pas été modifié."]);
        }
      } else {
        echo json_encode(["error" => "Données manquantes ou invalides dans le JSON."]);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs de la requête SQL
      echo json_encode(["error" => "Erreur lors de la modification : " . $e->getMessage()]);
    }
  }

  public function Suprimer() {}

  public function Filtre_par_date() {}
}
