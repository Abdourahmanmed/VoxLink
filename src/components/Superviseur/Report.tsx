import { DataTableImportation } from "../ReUsableDataTable";
import { Report, ReportColumns } from "./Culumns/CulumnReport";

export default function Reporte() {
    const reporteData: Report[] = [
        {
            id: '1',
            Nom: "Donald Trump",
            Email: "Donal@gmail.com",
            Telephone: 77323110,
            Adresse: "quartier 2",
            Status: "indisponible",
            Commentaire: " cet appel est indisponible",
        }
    ];

    return (
        <div>
            <DataTableImportation data={reporteData} columns={ReportColumns} typeName="Nom" />
        </div>
    );
}
