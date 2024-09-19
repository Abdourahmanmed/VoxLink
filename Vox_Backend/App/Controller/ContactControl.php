<?php

namespace App\Controller;

use App\Model\Contact;

class ContactControl
{
    private $contact;
    public function __construct()
    {
        $this->contact = new Contact();
    }

    public function afficher_contact($idCompagne){
        return $this->contact->AfficherParId($idCompagne);
    }
    public function AfficherParToday($data){
        return $this->contact->AfficherAujourdhui($data);
    }
    public function AfficherContactClassique($data){
        return $this->contact->AfficherContactClassique($data);
    }

    public function EditerContact($data,$id){
        return $this->contact->Editer($data,$id);
    }
    
}
