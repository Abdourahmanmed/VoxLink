import { DataTableImportation } from "../ReUsableDataTable";
import { ImportedData, ImportedColumns } from "./Culumns/CulumnsDataImported";

export default function DataImported() {
    const reporteData: ImportedData[] = [
        {
            id: '1',
            Nom: "Donald Trump",
            Email: "Donal@gmail.com",
            Telephone: 77323110,
            Adresse: "quartier 2",
        }
    ];
    return (
        <div>
            <DataTableImportation data={reporteData} columns={ImportedColumns} typeName="Nom" />
        </div>
    )
}