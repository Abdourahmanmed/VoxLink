<?php

namespace App\Controller;

use App\Model\AppelContact;

class AppelContactControl
{
    private $appel;
    public function __construct()
    {
        $this->appel = new AppelContact();
    }

    public function ajouterAppel($data)
    {
        return $this->appel->Qualifier($data);
    }
    public function AfficherRapel($data)
    {
        return $this->appel->AfficherAppelRappeler($data);
    }
    public function AfficherAppelPositive($Jsondata)
    {
        return $this->appel->AfficherAppelPositive($Jsondata);
    }
    public function AfficherAppelNegative($Jsondata)
    {
        return $this->appel->AfficherAppelNegative($Jsondata);
    }
    public function AfficherStatusCallMessage($id)
    {
        return $this->appel->afficherStatusCallMessage($id);
    }

    public function Modifier($id, $jsonData)
    {
        return $this->appel->Modifier($id, $jsonData);
    }
}
