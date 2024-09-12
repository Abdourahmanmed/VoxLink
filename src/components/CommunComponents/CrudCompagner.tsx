import CreateCompagne from "../FormCompagne";
import { ReUsableDataTableCrud } from "../ReUsableDataTableCrud";
import { CompagneColumns, CompagneData } from "../Superviseur/Culumns/CulumnsCompagner";

export default function CrudCompagner() {
    //test agents data
    const CompaData: CompagneData[] = [
        {
            id: '1',
            Nom: "Recouvrement",
            Societe: 'la poste',
            Script: 'le script du recouvrement.',
        }
    ];

    return (
        <div>
            <ReUsableDataTableCrud data={CompaData} columns={CompagneColumns} typeName="Nom" poptitle="Ajouter une compagne" children={<CreateCompagne />}/>
        </div>
    )
}