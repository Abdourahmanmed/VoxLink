import { DataTableImportation } from "../ReUsableDataTable";
import { Report, ReportColumns } from "./Culumns/CulumnReport";

export default function StateCAll(){
    const reporteData: Report[] = [
        {
            id: '1',
            Nom: "Donald Trump",
            Email: "Donal@gmail.com",
            Telephone: 77323110,
            Adresse: "quartier 2",
            Status: "repondu",
            Commentaire: " cet appel est repondi avec succes",
        },
    ];
    return (
        <div>
            <DataTableImportation data={reporteData} columns={ReportColumns} typeName="Nom" />
        </div>
    )
}