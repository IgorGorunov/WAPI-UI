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

const exportFileXLS = (data: any, fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);

    // Устанавливаем ширину столбцов
    ws['!cols'] = setColWidth(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, fileName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export {exportFileXLS}
