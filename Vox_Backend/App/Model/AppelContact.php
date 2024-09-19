<?php

namespace App\Model;

use App\Db\Db;
use PDOException;
use PDO;

class AppelContact
{
  private $db;
  public function __construct()
  {
    $this->db = new Db();
  }

  // cette fonction est pour les appelles positives 
  public function AfficherAppelPositive($Jsondata)
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

        // Correction de la requête SQL pour sélectionner les appels qualifiés de "repondu"
        $sql1 = "SELECT co.Nom,co.Email,co.Telephone,co.Adresse,a.Qualification,a.Commentaire 
                       FROM appel_contact a 
                       JOIN contact co ON a.id_contact = co.id
                       JOIN compagner c ON co.Id_compagner = c.id
                       WHERE c.id = :id AND a.Qualification = 'repondu'";

        $stmt1 = $this->db->getPdo()->prepare($sql1);
        $stmt1->bindParam(':id', $id);
        $stmt1->execute();

        // Vérification du nombre de résultats
        if ($stmt1->rowCount() > 0) {
          // Récupération des résultats sous forme de tableau associatif
          $appelPositive = $stmt1->fetchAll(PDO::FETCH_ASSOC);
          // Encodage en JSON pour l'affichage
          echo json_encode($appelPositive);
        } else {
          // Si aucune donnée n'est trouvée
          echo json_encode(["error" => "Aucune donnée trouvée."]);
        }
      } else {
        // Si la campagne n'existe pas
        echo json_encode(["error" => "Cette campagne n'existe pas."]);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }
  // cette fonction est pour les appelles positives 
  public function AfficherAppelNegative($Jsondata)
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

        // Correction de la requête SQL pour sélectionner les appels qualifiés de "repondu"
        $sql1 = "SELECT co.Nom,co.Email,co.Telephone,co.Adresse,a.Qualification,a.Commentaire 
                       FROM appel_contact a 
                       JOIN contact co ON a.id_contact = co.id
                       JOIN compagner c ON co.Id_compagner = c.id
                       WHERE c.id = :id AND a.Qualification = 'rappeller'or a.Qualification = 'abouti' OR a.Qualification = 'indisponible'";

        $stmt1 = $this->db->getPdo()->prepare($sql1);
        $stmt1->bindParam(':id', $id);
        $stmt1->execute();

        // Vérification du nombre de résultats
        if ($stmt1->rowCount() > 0) {
          // Récupération des résultats sous forme de tableau associatif
          $appelNegative = $stmt1->fetchAll(PDO::FETCH_ASSOC);
          // Encodage en JSON pour l'affichage
          echo json_encode($appelNegative);
        } else {
          // Si aucune donnée n'est trouvée
          echo json_encode(["error" => "Aucune donnée trouvée."]);
        }
      } else {
        // Si la campagne n'existe pas
        echo json_encode(["error" => "Cette campagne n'existe pas."]);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  // Cette fonction est pour les appels à rappeler du teleconseiller 
  public function AfficherAppelRappeler($Compagne)
  {
    try {
      // Décodage de l'entrée JSON
      $data = json_decode($Compagne, true);

      // Vérification que le nom de la campagne est fourni
      if (isset($data['Compagne'])) {
        // Requête pour obtenir l'ID de la campagne à partir de son nom
        $sql1 = "SELECT id FROM compagner WHERE Nom = :nom";  // Correction du nom de la table
        $stmt1 = $this->db->getPdo()->prepare($sql1);
        $stmt1->bindValue(":nom", $data["Compagne"]);
        $stmt1->execute();

        // Vérification si la campagne existe
        if ($stmt1->rowCount() > 0) {
          $fetchData = $stmt1->fetch(PDO::FETCH_ASSOC);

          // Requête pour obtenir les appels à rappeler
          $sql = "SELECT ct.id,ct.Nom ,ct.Telephone,c.Script
                        FROM appel_contact a
                        INNER JOIN contact ct ON a.id_contact = ct.id
                        INNER JOIN compagner c ON ct.Id_compagner = c.id
                        WHERE c.id = :id
                        AND a.Qualification = 'rappeller'";
          $stmt = $this->db->getPdo()->prepare($sql);
          $stmt->bindValue(":id", $fetchData["id"]);
          $stmt->execute();

          // Vérification si des appels à rappeler sont trouvés
          if ($stmt->rowCount() > 0) {
            $appelRappeler = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($appelRappeler);
          } else {
            // Aucun appel à rappeler trouvé
            echo json_encode(["error" => "Aucune donnée trouvée."]);
          }
        } else {
          // La campagne n'existe pas
          echo json_encode(["error" => "Compagne introuvable."]);
        }
      } else {
        // Si la donnée 'Compagne' n'est pas fournie
        echo json_encode(["error" => "Veuillez entrer une donnée valide."]);
      }
    } catch (PDOException $e) {
      // Retour d'une erreur en cas d'exception
      http_response_code(500);
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }
 
  // fonction qui permet recuper un appel et son qualification.
  public function afficherStatusCallMessage($id)
  {
    try {
      // La requête SQL pour obtenir les données d'appel
      $sql = "SELECT Qualification, Commentaire FROM appel_contact WHERE id_contact = :id";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->bindValue(":id", $id, PDO::PARAM_INT);
      $stmt->execute();

      // Vérification si des données sont retournées
      if ($stmt->rowCount() > 0) {
        $fetchData = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($fetchData);
      } else {
        // Aucun enregistrement trouvé pour l'identifiant donné
        echo json_encode(["error" => "Aucune donnée trouvée."]);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs de requête SQL
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  // fonction de filtrage par jour pour les appelles totales
  public function NombreAppelsParJour()
  {
    try {
      // Requête SQL pour compter le nombre d'appels aujourd'hui
      $sql = "SELECT COUNT(*) as total_appels FROM appel_contact WHERE DATE(Date_appel) = CURDATE()";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        header('Content-Type: application/json');
        echo json_encode(['total_appels_jour' => $result['total_appels']]);
      } else {
        echo json_encode(['error' => 'Aucune donnée trouvée.']);
      }
    } catch (PDOException $e) {
      header('Content-Type: application/json');
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  // fonction de filtrage par semaine pour les appelles totales
  public function NombreAppelsParSemaine()
  {
    try {
      // Requête SQL pour compter le nombre d'appels cette semaine
      $sql = "SELECT COUNT(*) as total_appels FROM appel_contact WHERE YEARWEEK(Date_appel, 1) = YEARWEEK(CURDATE(), 1)";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        header('Content-Type: application/json');
        echo json_encode(['total_appels_semaine' => $result['total_appels']]);
      } else {
        echo json_encode(['error' => 'Aucune donnée trouvée.']);
      }
    } catch (PDOException $e) {
      header('Content-Type: application/json');
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  // fonction de filtrage par mois pour les appelles totales
  public function NombreAppelsParMois()
  {
    try {
      // Requête SQL pour compter le nombre d'appels ce mois
      $sql = "SELECT COUNT(*) as total_appels FROM appel_contact WHERE MONTH(Date_appel) = MONTH(CURDATE()) AND YEAR(Date_appel) = YEAR(CURDATE())";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        header('Content-Type: application/json');
        echo json_encode(['total_appels_mois' => $result['total_appels']]);
      } else {
        echo json_encode(['error' => 'Aucune donnée trouvée.']);
      }
    } catch (PDOException $e) {
      header('Content-Type: application/json');
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  //ajouter un appelle 
  public function Qualifier($jsonData)
  {
    try {
      // Décodage des données JSON
      $data = json_decode($jsonData, true);

      // Vérification que toutes les données nécessaires sont présentes
      if (isset($data['qualifier']) && isset($data['commentaire']) && isset($data['id_teleconseil']) && isset($data['id_contact'])) {

        // Préparation de la requête SQL
        $sql = "INSERT INTO appel_contact (Qualification, Commentaire, Date_appel, id_teleconseil, id_contact) 
                    VALUES(:qualifier, :commentaire, NOW(), :id_teleconseil, :id_contact)";
        $stmt = $this->db->getPdo()->prepare($sql);

        // Liaison des paramètres
        $stmt->bindParam(':qualifier', $data['qualifier']);
        $stmt->bindParam(':commentaire', $data['commentaire']);
        $stmt->bindParam(':id_teleconseil', $data['id_teleconseil']);
        $stmt->bindParam(':id_contact', $data['id_contact']);

        // Exécution de la requête
        $stmt->execute();

        // Vérification si l'insertion a réussi
        if ($stmt->rowCount() > 0) {
          echo json_encode(['success' => 'Données enregistrées.']);
        } else {
          echo json_encode(['error' => 'Échec de l\'enregistrement.']);
        }
      } else {
        echo json_encode(['error' => 'Données invalides.']);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  // Modifier un appel
  public function Modifier($id, $jsonData)
  {
    try {
      // Décodage des données JSON
      $data = json_decode($jsonData, true);

      // Vérification que toutes les données nécessaires sont présentes
      if (isset($data['qualifier']) && isset($data['commentaire'])) {

        // Préparation de la requête SQL pour la mise à jour
        $sql = "UPDATE appel_contact
                        SET Qualification = :qualifier,
                            Commentaire = :commentaire,
                            Date_appel = NOW()
                        WHERE id_contact = :id";
        $stmt = $this->db->getPdo()->prepare($sql);

        // Liaison des paramètres
        $stmt->bindParam(':qualifier', $data['qualifier']);
        $stmt->bindParam(':commentaire', $data['commentaire']);
        $stmt->bindParam(':id', $id);

        // Exécution de la requête
        $stmt->execute();

        // Vérification si la mise à jour a réussi
        if ($stmt->rowCount() > 0) {
          echo json_encode(['success' => 'Données mises à jour.']);
        } else {
          echo json_encode(['error' => 'Aucune modification effectuée.']);
        }
      } else {
        echo json_encode(['error' => 'Données invalides.']);
      }
    } catch (PDOException $e) {
      // Gestion des erreurs et retour d'un message d'erreur en JSON
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }


  // fonction de filtrage par Ans pour les appelles totals
  public function NombreAppelsParAn()
  {
    try {
      // Requête SQL pour compter le nombre d'appels cette année
      $sql = "SELECT COUNT(*) as total_appels FROM appel_contact WHERE YEAR(Date_appel) = YEAR(CURDATE())";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        header('Content-Type: application/json');
        echo json_encode(['total_appels_an' => $result['total_appels']]);
      } else {
        echo json_encode(['error' => 'Aucune donnée trouvée.']);
      }
    } catch (PDOException $e) {
      header('Content-Type: application/json');
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  // fonction de filtrage par jour pour les appelles negatives
  public function NombreAppelsNegativeParJour()
  {
    try {
      // Requête SQL pour compter le nombre d'appels négatifs aujourd'hui
      $sql = "SELECT COUNT(*) as total_appels_negative FROM appel_contact WHERE DATE(Date_appel) = CURDATE() AND Qualification IN (indisponible', 'abouti')";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        echo json_encode(['total_appels_negative_jour' => $result['total_appels_negative']]);
      } else {
        echo json_encode(['error' => 'Aucune donnée trouvée.']);
      }
    } catch (PDOException $e) {
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  // fonction de filtrage par semaine pour les appelles negatives
  public function NombreAppelsNegativeParSemaine()
  {
    try {
      // Requête SQL pour compter le nombre d'appels négatifs cette semaine
      $sql = "SELECT COUNT(*) as total_appels_negative FROM appel_contact WHERE YEARWEEK(Date_appel, 1) = YEARWEEK(CURDATE(), 1) AND Qualification IN ('indisponible', 'abouti')";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        header('Content-Type: application/json');
        echo json_encode(['total_appels_negative_semaine' => $result['total_appels_negative']]);
      } else {
        echo json_encode(['error' => 'Aucune donnée trouvée.']);
      }
    } catch (PDOException $e) {
      header('Content-Type: application/json');
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }


  // fonction de filtrage par mois pour les appelles negatives
  public function NombreAppelsNegativeParMois()
  {
    try {
      // Requête SQL pour compter le nombre d'appels négatifs ce mois
      $sql = "SELECT COUNT(*) as total_appels_negative FROM appel_contact WHERE MONTH(Date_appel) = MONTH(CURDATE()) AND YEAR(Date_appel) = YEAR(CURDATE()) AND Qualification IN ('indisponible', 'abouti')";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        header('Content-Type: application/json');
        echo json_encode(['total_appels_negative_mois' => $result['total_appels_negative']]);
      } else {
        echo json_encode(['error' => 'Aucune donnée trouvée.']);
      }
    } catch (PDOException $e) {
      header('Content-Type: application/json');
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  // fonction de filtrage par ans pour les appelles negatives
  public function NombreAppelsNegativeParAn()
  {
    try {
      // Requête SQL pour compter le nombre d'appels négatifs cette année
      $sql = "SELECT COUNT(*) as total_appels_negative FROM appel_contact WHERE YEAR(Date_appel) = YEAR(CURDATE()) AND Qualification IN ('indisponible', 'abouti')";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        header('Content-Type: application/json');
        echo json_encode(['total_appels_negative_an' => $result['total_appels_negative']]);
      } else {
        echo json_encode(['error' => 'Aucune donnée trouvée.']);
      }
    } catch (PDOException $e) {
      header('Content-Type: application/json');
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  // fonction de filtrage par jour pour les appelles positives 
  public function NombreAppelsPositiveParJour()
  {
    try {
      // Requête SQL pour compter le nombre d'appels positifs aujourd'hui
      $sql = "SELECT COUNT(*) as total_appels_positive FROM appel_contact WHERE DATE(Date_appel) = CURDATE() AND Qualification IN ('repondu')";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        header('Content-Type: application/json');
        echo json_encode(['total_appels_positive_jour' => $result['total_appels_positive']]);
      } else {
        echo json_encode(['error' => 'Aucune donnée trouvée.']);
      }
    } catch (PDOException $e) {
      header('Content-Type: application/json');
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  // fonction de filtrage par semain pour les appelles positives 
  public function NombreAppelsPositiveParSemaine()
  {
    try {
      // Requête SQL pour compter le nombre d'appels positifs cette semaine
      $sql = "SELECT COUNT(*) as total_appels_positive FROM appel_contact WHERE YEARWEEK(Date_appel, 1) = YEARWEEK(CURDATE(), 1) AND Qualification IN ('repondu')";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        header('Content-Type: application/json');
        echo json_encode(['total_appels_positive_semaine' => $result['total_appels_positive']]);
      } else {
        echo json_encode(['error' => 'Aucune donnée trouvée.']);
      }
    } catch (PDOException $e) {
      header('Content-Type: application/json');
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  // fonction de filtrage par mois pour les appelles positives 
  public function NombreAppelsPositiveParMois()
  {
    try {
      // Requête SQL pour compter le nombre d'appels positifs ce mois
      $sql = "SELECT COUNT(*) as total_appels_positive FROM appel_contact WHERE MONTH(Date_appel) = MONTH(CURDATE()) AND YEAR(Date_appel) = YEAR(CURDATE()) AND Qualification IN ('repondu')";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        header('Content-Type: application/json');
        echo json_encode(['total_appels_positive_mois' => $result['total_appels_positive']]);
      } else {
        echo json_encode(['error' => 'Aucune donnée trouvée.']);
      }
    } catch (PDOException $e) {
      header('Content-Type: application/json');
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }

  // fonction de filtrage par ans pour les appelles positives 
  public function NombreAppelsPositiveParAn()
  {
    try {
      // Requête SQL pour compter le nombre d'appels positifs cette année
      $sql = "SELECT COUNT(*) as total_appels_positive FROM appel_contact WHERE YEAR(Date_appel) = YEAR(CURDATE()) AND Qualification IN ('repondu')";
      $stmt = $this->db->getPdo()->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        header('Content-Type: application/json');
        echo json_encode(['total_appels_positive_an' => $result['total_appels_positive']]);
      } else {
        echo json_encode(['error' => 'Aucune donnée trouvée.']);
      }
    } catch (PDOException $e) {
      header('Content-Type: application/json');
      echo json_encode(["error" => "Erreur lors de l'exécution : " . $e->getMessage()]);
    }
  }
}
