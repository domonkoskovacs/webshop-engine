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

export function downloadSampleCSV(filename: string = "sample.csv") {
    const sampleData = `product_name,product_description,price,quantity
Example Product 1,Description for product 1,10.00,100
Example Product 2,Description for product 2,20.00,200
Example Product 3,Description for product 3,30.00,300`; //todo finalize when product finalized

    const base64Csv = btoa(sampleData);
    downloadCSV(base64Csv, filename);
}


export class FileToBase64Error extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FileToBase64Error";
    }
}

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = (reader.result as string).split(",")[1];
            resolve(base64String);
        };
        reader.onerror = () => {
            reject(new FileToBase64Error("Failed to convert file to Base64. Please try again."));
        };
    });
};

export const downloadImage = async (url: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], "image.jpg", {type: blob.type});
};