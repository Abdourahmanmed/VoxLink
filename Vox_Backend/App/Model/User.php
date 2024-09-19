<?php

namespace App\Model;

use App\Db\Db;
use PDOException;
use PDO;

class User
{
    private $db;
    public function __construct()
    {
        $this->db = new Db();
    }

    // Fonction pour ajouter un utilisateur avec des données JSON
    public function Ajouter($jsonData)
    {
        try {
            $data = json_decode($jsonData, true);  // Décoder les données JSON
            if (isset($data['Nom']) && isset($data['Email']) && isset($data['Password']) && isset($data['Telephone'])  && isset($data['Adresse']) && isset($data['Role'])) {
                $sql = "INSERT INTO users (Nom, Email, Password, Telephone, Adresse, Role) 
                        VALUES (:nom, :email, :password, :telephone, :adresse, :role)";
                $stmt = $this->db->getPdo()->prepare($sql);
                $stmt->bindParam(':nom', $data['Nom']);
                $stmt->bindParam(':email', $data['Email']);
                $stmt->bindParam(':password', $data['Password']);
                $stmt->bindParam(':telephone', $data['Telephone']);
                $stmt->bindParam(':adresse', $data['Adresse']);
                $stmt->bindParam(':role', $data['Role']);

                $stmt->execute();
                if ($stmt->rowCount() > 0) {
                    echo json_encode(["success" => "Utilisateur ajouté avec succès"]);
                } else {
                    echo json_encode(["error" => "Utilisateur non ajouté"]);
                }
            } else {
                echo json_encode(["error" => "vous avez entre une donne ivalide"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["error" => "Erreur lors de l'ajout de l'utilisateur: " . $e->getMessage()]);
        }
    }

    // Fonction pour éditer un utilisateur avec des données JSON
    public function Editer($id, $jsonData)
    {
        try {
            $data = json_decode($jsonData, true);  // Décoder les données JSON
            if (isset($data['Nom']) && isset($data['Email']) && isset($data['Password']) && isset($data['Telephone'])  && isset($data['Adresse']) && isset($data['Role'])) {
                $sql = "UPDATE users SET 
                    Nom = :nom, 
                    Email = :email, 
                    Password = :password, 
                    Telephone = :telephone, 
                    Adresse = :adresse, 
                    Role = :role
                    WHERE id = :id";
                $stmt = $this->db->getPdo()->prepare($sql);
                $stmt->bindParam(':id', $id);
                $stmt->bindParam(':nom', $data['Nom']);
                $stmt->bindParam(':email', $data['Email']);
                $stmt->bindParam(':password', $data['Password']);
                $stmt->bindParam(':telephone', $data['Telephone']);
                $stmt->bindParam(':adresse', $data['Adresse']);
                $stmt->bindParam(':role', $data['Role']);

                $stmt->execute();
                if ($stmt->rowCount() > 0) {
                    echo json_encode(["success" => "Utilisateur modifié avec succès"]);
                } else {
                    echo json_encode(["error" => "Utilisateur non modifié"]);
                }
            } else {
                echo json_encode(["error" => "vous avez entre une donne ivalide"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["error" => "Erreur lors de la modification de l'utilisateur: " . $e->getMessage()]);
        }
    }

    // Fonction pour supprimer un utilisateur
    public function Suprimer($id)
    {
        try {
            $sql = "DELETE FROM users WHERE id = :id";
            $stmt = $this->db->getPdo()->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => "Utilisateur supprimé avec succès"]);
            } else {
                echo json_encode(["error" => "Utilisateur non supprimé"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["error" => "Erreur lors de la suppression de l'utilisateur: " . $e->getMessage()]);
        }
    }
    //fonction affiche un utilisateur par id 
    // Fonction qui affiche un utilisateur par id
    public function AfficherUserById($id)
    {
        try {
            $sql = "SELECT * FROM users WHERE id = :id"; // Correction de la syntaxe SQL
            $stmt = $this->db->getPdo()->prepare($sql);
            $stmt->bindParam(":id", $id, PDO::PARAM_INT); // Optionnel : ajouter le type de paramètre PDO
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $data = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($data);
            } else {
                echo json_encode(["error" => "Aucun utilisateur trouvé"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["error" => "Erreur lors de la récupération : " . $e->getMessage()]);
        }
    }

    // Fonction pour afficher tous les utilisateurs pour le super AMIN
    public function AfficherPourSuperAdmin()
    {
        try {
            $sql = "SELECT * FROM users where Role in ('Admin','Superviseur','Teleconseiller','AgentCommerce')";
            $stmt = $this->db->getPdo()->prepare($sql);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                echo json_encode(["error" => "Theirs is not users found."]);
            }
        } catch (PDOException $e) {
            echo json_encode(["error" => "Erreur lors de la récupération des utilisateurs: " . $e->getMessage()]);
        }
    }

    // Fonction pour afficher tous les utilisateurs pour l'admin
    public function AfficherPourAdmin()
    {
        try {
            $sql = "SELECT * FROM users where Role in ('Superviseur','Teleconseiller','AgentCommerce')";
            $stmt = $this->db->getPdo()->prepare($sql);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                echo json_encode(["error" => "Theirs is not users found."]);
            }
        } catch (PDOException $e) {
            echo json_encode(["error" => "Erreur lors de la récupération des utilisateurs: " . $e->getMessage()]);
        }
    }

    // Fonction pour afficher tous les utilisateurs du superviseur
    public function AfficherPourSuperviseur()
    {
        try {
            $sql = "SELECT * FROM users where Role in ('Teleconseiller','AgentCommerce')";
            $stmt = $this->db->getPdo()->prepare($sql);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                echo json_encode(["error" => "Theirs is not users found."]);
            }
        } catch (PDOException $e) {
            echo json_encode(["error" => "Erreur lors de la récupération des utilisateurs: " . $e->getMessage()]);
        }
    }

    // Fonction pour activer un utilisateur qui est desactive
    public function Active($id)
    {
        try {
            $sql = "UPDATE users SET State = 'Active' WHERE id = :id";
            $stmt = $this->db->getPdo()->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => "Utilisateur activé avec succès"]);
            } else {
                echo json_encode(["error" => "Utilisateur non active"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["error" => "Erreur lors de l'activation de l'utilisateur: " . $e->getMessage()]);
        }
    }


    // Fonction pour désactiver un utilisateur
    public function Desactive($id)
    {
        try {
            $sql = "UPDATE users SET State = 'Desactive' WHERE id = :id";
            $stmt = $this->db->getPdo()->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => "Utilisateur désactivé avec succès"]);
            } else {
                echo json_encode(["error" => "Utilisateur active désactivé"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["error" => "Erreur lors de la désactivation de l'utilisateur: " . $e->getMessage()]);
        }
    }

    public function Gestion_Role($id, $role)
    {
        try {
            // Requête SQL pour mettre à jour le rôle
            $sql = "UPDATE users SET Role = :role WHERE id = :id";
            $stmt = $this->db->getPdo()->prepare($sql);  // Préparer la requête
            $stmt->bindParam(':id', $id);      // Lier l'ID
            $stmt->bindParam(':role', $role);  // Lier le rôle
            $stmt->execute();  // Exécuter la requête

            // Vérifier si la mise à jour a affecté des lignes
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => "Le rôle de l'utilisateur a été modifié avec succès. Il est maintenant " . $role]);
            } else {
                echo json_encode(["error" => "Le rôle de l'utilisateur n'a pas été modifié."]);
            }
        } catch (PDOException $e) {
            // Gestion des erreurs
            echo json_encode(["error" => "Erreur lors de la modification du rôle de l'utilisateur : " . $e->getMessage()]);
        }
    }

    //fonction login
    public function Login($jsonData)
    {
        try {
            $data = json_decode($jsonData, true);

            if (!isset($data['email']) || !isset($data['password']) || empty($data['email']) || empty($data['password'])) {
                echo json_encode(["error" => "Username and password are required"]);
                return;
            }

            $username = $data['email'];
            $password = $data['password'];

            $sql = "SELECT id, Nom, Email, Password,Role FROM users WHERE Email = :username";
            $stmt = $this->db->getPdo()->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                if ($user['Password'] == $password) {
                    echo json_encode(["user" => $user]);
                } else {
                    echo json_encode(["error" => "Invalid password"]);
                }
            } else {
                echo json_encode(["error" => "User not found"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        } catch (\Exception $e) {
            echo json_encode(["error" => "General error: " . $e->getMessage()]);
        }
    }
}
