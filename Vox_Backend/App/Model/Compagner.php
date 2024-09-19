<?php

namespace App\Model;

use App\Db\Db;
use PDOException;
use PDO;

class Compagner
{
  private $db;
  public function __construct()
  {
    $this->db = new Db();
  }


  // fonction affichage des compagnes
  public function Afficher()
  {
    try {
      // Préparation de la requête SQL pour récupérer le nom et le téléphone
      $sql = "SELECT * FROM compagner";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();

      // Vérification s'il y a des résultats
      if ($stmt->rowCount() > 0) {
        // Récupération des résultats sous forme de tableau associatif
        $compagne = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // Encodage en JSON pour l'affichage
        echo json_encode($compagne);
      } else {
        // Si aucune donnée n'est trouvée
        echo json_encode(["error" => "Erreur de récupération des données."]);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }
  //fonction qui afficher par nom les compagnes
  public function AfficherParNom($nom)
  {
    try {
      $Nom = json_decode($nom, true);
      // Préparation de la requête SQL pour récupérer le nom et le téléphone
      $sql = "SELECT * FROM compagner where Nom =:nom";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->bindParam(':nom', $Nom['nom']);
      $stmt->execute();

      // Vérification s'il y a des résultats
      if ($stmt->rowCount() > 0) {
        // Récupération des résultats sous forme de tableau associatif
        $compagne = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // Encodage en JSON pour l'affichage
        echo json_encode($compagne);
      } else {
        // Si aucune donnée n'est trouvée
        echo json_encode(["error" => "Erreur de récupération des données."]);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }
  //fonction qui afficher par id les compagnes 
  public function AfficherParId($id)
  {
    try {
      // Préparation de la requête SQL pour récupérer le nom et le téléphone
      $sql = "SELECT * FROM compagner where id =:id";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->bindParam(':id', $id);
      $stmt->execute();

      // Vérification s'il y a des résultats
      if ($stmt->rowCount() > 0) {
        // Récupération des résultats sous forme de tableau associatif
        $compagne = $stmt->fetch(PDO::FETCH_ASSOC);
        // Encodage en JSON pour l'affichage
        echo json_encode($compagne);
      } else {
        // Si aucune donnée n'est trouvée
        echo json_encode(["error" => "Erreur de récupération des données."]);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }
  //fonction ajouter de compagne
  public function Ajouter($id, $jsonData)
  {
    try {
      // Décodage des données JSON
      $data = json_decode($jsonData, true);

      // Vérification que toutes les données nécessaires sont présentes
      if (isset($data['Nom']) && isset($data['Societe']) && isset($data['Script'])) {

        // Préparation de la requête SQL pour l'insertion
        $sql = "INSERT INTO compagner (Nom, Societe, Script, Id_user) 
                          VALUES(:nom, :societe, :script, :id)";
        $stmt = $this->db->getPdo()->prepare($sql);

        // Liaison des paramètres
        $stmt->bindParam(':nom', $data['Nom']);
        $stmt->bindParam(':societe', $data['Societe']);
        $stmt->bindParam(':script', $data['Script']);
        $stmt->bindParam(':id', $id);

        // Exécution de la requête
        $stmt->execute();

        // Vérification si l'insertion a réussi
        if ($stmt->rowCount() > 0) {
          // Récupération de l'ID de la dernière insertion
          $lastInsertId = $this->db->getPdo()->lastInsertId();

          // Retourner un message de succès avec l'ID
          echo json_encode([
            'success' => 'Campagne ajoutée avec succès.',
            'id' => $lastInsertId  // Retourner l'ID de la campagne
          ]);
        } else {
          echo json_encode(['error' => 'Échec de l\'ajout de la campagne.']);
        }
      } else {
        echo json_encode(['error' => 'Données invalides.']);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  //fonction modifier de compagne
  public function Editer($id, $jsonData)
  {
    try {
      // Décodage des données JSON
      $data = json_decode($jsonData, true);

      // Vérification que toutes les données nécessaires sont présentes
      if (isset($data['Nom']) && isset($data['Societe']) && isset($data['Script'])) {

        // Préparation de la requête SQL pour la mise à jour
        $sql = "UPDATE compagner
                      SET Nom = :nom,
                          Societe = :societe,
                          Script = :script
                      WHERE id = :id";
        $stmt = $this->db->getPdo()->prepare($sql);

        // Liaison des paramètres
        $stmt->bindParam(':nom', $data['Nom']);
        $stmt->bindParam(':societe', $data['Societe']);
        $stmt->bindParam(':script', $data['Script']);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT); // Ajout de PDO::PARAM_INT pour s'assurer que l'id est un entier

        // Exécution de la requête
        $stmt->execute();

        // Vérification si la mise à jour a réussi
        if ($stmt->rowCount() > 0) {
          echo json_encode(['success' => 'Campagne mise à jour avec succès.']);
        } else {
          echo json_encode(['error' => 'Aucune modification effectuée ou données identiques.']);
        }
      } else {
        echo json_encode(['error' => 'Données invalides.']);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  //fonction supprimer compagne
  public function Supprimer($id)
  {
    try {
      // Préparation de la requête SQL pour la suppression
      $sql = "DELETE FROM compagner WHERE id = :id";
      $stmt = $this->db->getPdo()->prepare($sql);

      // Liaison du paramètre
      $stmt->bindParam(':id', $id);

      // Exécution de la requête
      $stmt->execute();

      // Vérification si la suppression a réussi
      if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => 'Campagne supprimée avec succès.']);
      } else {
        echo json_encode(['error' => 'Aucune campagne supprimée.']);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }
}
