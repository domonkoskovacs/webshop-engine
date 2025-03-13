export function downloadCSV(base64Csv: string, filename: string = "data.csv") {
    if (!base64Csv) return;

    try {
        const csvData = atob(base64Csv);
        const blob = new Blob([csvData], {type: "text/csv"});
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        throw error
    }
}
