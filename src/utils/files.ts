import * as XLSX from "xlsx";

const setColWidth = (data: any[]) => {
    const widths = data.map(row =>
        Object.values(row).map(val =>
            (val ? String(val).length : 0) + 5
        )
    );

    return widths[0].map((_, i) => ({
        wch: Math.max(...widths.map(row => row[i]))
    }));
};

const exportFileXLS = (data: any[], fileName: string) => {

    if (data.length === 0) {
        return null;
    }

    const ws = XLSX.utils.json_to_sheet(data);

    ws['!cols'] = setColWidth(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, fileName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
}


// download / send files
const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

const arrayBufferToBase64 = (arrayBuffer) => {
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

const base64ToBlob = (base64String, type) => {
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type });
};


export {exportFileXLS, readFileAsArrayBuffer, arrayBufferToBase64, base64ToBlob}
