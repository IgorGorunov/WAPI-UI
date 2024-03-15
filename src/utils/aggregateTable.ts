interface TableObject {
    [key: string]: string | number;
}

function aggregateTableData(table: TableObject[], dimensions: string[], sumResources: string[], uniqueResources: string[], concatenatedResources: string[]): Promise<TableObject[]> {
    return new Promise((resolve, reject) => {
        try {
            const result: TableObject[] = [];

            // Group table data by dimensions
            const groupedData: { [key: string]: TableObject[] } = {};
            table.forEach((row) => {
                const key = dimensions.map((dim) => row[dim]).join('-');
                if (!groupedData[key]) {
                    groupedData[key] = [];
                }
                groupedData[key].push(row);
            });

            // Process each group
            for (const key in groupedData) {
                if (Object.prototype.hasOwnProperty.call(groupedData, key)) {
                    const group = groupedData[key][0]; // Just need one row to represent the group
                    const processedRow: TableObject = {};

                    // Add dimensions
                    dimensions.forEach((dim) => {
                        processedRow[dim] = group[dim];
                    });

                    // Sum resources
                    sumResources.forEach((resource) => {
                        processedRow[resource] = groupedData[key].reduce((acc, row) => acc + (Number(row[resource]) || 0), 0);
                    });

                    // Count unique values for specified resources excluding '-'
                    uniqueResources.forEach((resource) => {
                        const uniqueValues = new Set();
                        groupedData[key].forEach((row) => {
                            if (row[resource] !== '-') {
                                uniqueValues.add(row[resource]);
                            }
                        });
                        processedRow[resource] = uniqueValues.size;
                    });

                    // Concatenate unique values for specified resources with ';'
                    concatenatedResources.forEach((resource) => {
                        const uniqueConcatenatedValues = Array.from(new Set(groupedData[key].map(row => row[resource]).filter(value => value !== '-'))).join(';');
                        const newColumnName = resource + "_c"; // New column name suffixed by "_c"
                        processedRow[newColumnName] = uniqueConcatenatedValues; // Create new column with concatenated values
                    });

                    result.push(processedRow);
                }
            }

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

export {aggregateTableData}