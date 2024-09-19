<?php

namespace App\Controller;

use App\Model\DemamdeLivraison;

class DemandeLivraisonControl
{
    private $DemandeLivraison;
    public function __construct()
    {
        $this->DemandeLivraison = new DemamdeLivraison();
    }

    public function Afficher(){
        return $this->DemandeLivraison->Afficher();
    }

    public function AjouterDemamde($Id_Telconseiller, $jsonData){
        return $this->DemandeLivraison->Ajouter($Id_Telconseiller, $jsonData);
    }
}
