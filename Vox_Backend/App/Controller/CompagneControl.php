<?php

namespace App\Controller;

use App\Model\Compagner;

class CompagneControl
{
    private $compagner;
    public function __construct()
    {
        $this->compagner = new Compagner();
    }

    public function afficher_compagner(){
        return $this->compagner->Afficher();
    }
    public function afficher_compagner_par_nom($nom){
        return $this->compagner->AfficherParNom($nom);
    }
    public function AfficherParId($id){
        return $this->compagner->AfficherParId($id);
    }
    public function Editer($id, $jsonData){
        return $this->compagner->Editer($id, $jsonData);
    }
    public function AjouterCompagne($id, $jsonData){
        return $this->compagner->Ajouter($id, $jsonData);
    }

    public function Supprimer($id) {
        return $this->compagner->Supprimer($id);
    }
}
