<?php 

namespace App\Controller;

use App\Model\User;

class UserControl {
     private $user;
    public function __construct() {
        $this->user = new User();
    }

    public function Login($data){
        return $this->user->login($data);
    }
    public function Ajouter($data) {
        return $this->user->Ajouter($data);
    }
    public function AfficherUserById($id) {
        return $this->user->AfficherUserById($id);
    }
    public function Editer($id,$data) {
        return $this->user->Editer($id,$data);
    }
    public function Suprimer($id) {
        return $this->user->Suprimer($id);
    }
    public function AfficherPourSuperviseur() {
        return $this->user->AfficherPourSuperviseur();
    }
    public function Desactive($id) {
        return $this->user->Desactive($$id);
    }

}



?>