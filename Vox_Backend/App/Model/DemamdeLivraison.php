<?php

namespace App\Model;

use App\Db\Db;
use PDOException;
use PDO;

class DemamdeLivraison
{
  private $db;
  public function __construct()
  {
    $this->db = new Db();
  }


  public function Ajouter($Id_Telconseiller, $jsonData)
  {
    try {
      // Décodage des données JSON
      $data = json_decode($jsonData, true);

      // Vérification que toutes les données nécessaires sont présentes
      if (isset($data['Nom']) && isset($data['Telephone']) && isset($data['Adresse']) && isset($data['Date_livraison']) && isset($data['Compagne'])) {

        // Requête SQL pour vérifier si la compagne existe
        $sql1 = "SELECT id FROM compagner WHERE Nom = :Nom";
        $stmt1 = $this->db->getPdo()->prepare($sql1);
        $stmt1->bindParam(':Nom', $data['Compagne']);  // Correction ici : utilisation du nom de la compagne
        $stmt1->execute();

        // Vérification de l'existence de la compagne
        if ($stmt1->rowCount() > 0) {
          $comp = $stmt1->fetch(PDO::FETCH_ASSOC);
          $id_compagner = $comp['id'];  // Récupération de l'ID de la compagne

          // Préparation de la requête SQL pour l'insertion de la demande de livraison
          $sql = "INSERT INTO demamde_livraison (Nom, Telephone, Adresse, Date_livraison, Id_Telconseiller, Id_compagner) 
                        VALUES (:Nom, :Telephone, :Adresse, :Date_livraison, :Id_Telconseiller, :Id_compagner)";
          $stmt = $this->db->getPdo()->prepare($sql);

          // Liaison des paramètres
          $stmt->bindParam(':Nom', $data['Nom']);
          $stmt->bindParam(':Telephone', $data['Telephone']);
          $stmt->bindParam(':Adresse', $data['Adresse']);
          $stmt->bindParam(':Date_livraison', $data['Date_livraison']);
          $stmt->bindParam(':Id_Telconseiller', $Id_Telconseiller);
          $stmt->bindParam(':Id_compagner', $id_compagner);

          // Exécution de la requête
          $stmt->execute();

          // Vérification si l'insertion a réussi
          if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => 'Demande de livraison ajoutée avec succès.']);
          } else {
            echo json_encode(['error' => 'Échec de l\'ajout de la demande de livraison.']);
          }
        } else {
          echo json_encode(['error' => 'La compagne sélectionnée est introuvable.']);
        }
      } else {
        echo json_encode(['error' => 'Données incomplètes.']);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }



  public function Afficher()
  {
    try {
      // Préparation de la requête SQL pour récupérer toutes les demandes
      $sql = "SELECT * FROM demamde_livraison";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();

      // Vérification du nombre de résultats
      if ($stmt->rowCount() > 0) {
        // Récupération des résultats sous forme de tableau associatif
        $demandes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // Encodage en JSON pour l'affichage
        echo json_encode($demandes);
      } else {
        // Si aucune donnée n'est trouvée
        echo json_encode(["error" => "Aucune demande trouvée."]);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }



  public function Filtre_par_date($date)
  {
    try {
      // Préparation de la requête SQL pour filtrer les demandes par date
      $sql = "SELECT * FROM demande_livraison WHERE Date_livraison = :date";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->bindParam(':date', $date);
      $stmt->execute();

      // Vérification du nombre de résultats
      if ($stmt->rowCount() > 0) {
        // Récupération des résultats sous forme de tableau associatif
        $demandes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // Encodage en JSON pour l'affichage
        echo json_encode($demandes);
      } else {
        // Si aucune donnée n'est trouvée
        echo json_encode(["error" => "Aucune demande trouvée pour cette date."]);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }
}
