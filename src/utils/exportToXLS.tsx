import * as XLSX from 'xlsx';

const convertJsonToXlsx = (jsonData, fileName = 'output.xlsx') => {
    const flattenJson = (data) => {
        const result = [];
        const recurse = (cur, prop) => {
            if (Object(cur) !== cur || Array.isArray(cur)) {
                result.push({ property: prop, value: cur });
            } else {
                let isEmpty = true;
                for (const p in cur) {
                    isEmpty = false;
                    recurse(cur[p], prop ? `${prop}.${p}` : p);
                }
                if (isEmpty && prop) result.push({ property: prop, value: '' });
            }
        };
        recurse(data, '');
        return result;
    };

    // Convert the JSON object to an array of rows with property and value
    const flatData = flattenJson(jsonData);
    const worksheet = XLSX.utils.json_to_sheet(flatData);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write the workbook to a file
    XLSX.writeFile(workbook, fileName);
};

export default convertJsonToXlsx;