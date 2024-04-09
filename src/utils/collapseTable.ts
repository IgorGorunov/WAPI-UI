type InputObjectType = {
    [key: string]: number | string;
}

type ResultObjectType = {
    [key: string]: number | string;
}

const  rowDimensionsAreFilled =(row, dimensionColumns) => {
    for( let i=0; i<dimensionColumns.length; i++) {
        if (!row[dimensionColumns[i]] ) {
            return false;
        }
    }
    return true;
}

export function collapseTable<T extends InputObjectType, K extends keyof T>(
    dimensionColumns: K[],
    sumColumns: K[],
    uniqueColumns: K[],
) {
    return (arr: T[],callback: () => void): ResultObjectType[] => {
        const result: ResultObjectType[] = arr.reduce((acc, obj) => {
            // Extract only the specified properties
            const filteredObj: ResultObjectType = dimensionColumns.reduce((filtered, prop) => {
                filtered[prop as string] = obj[prop] as string;
                return filtered;
            }, {} as ResultObjectType);

            // Find the index of an existing object with the same properties
            const index = acc.findIndex(item => {
                return dimensionColumns.every(prop => String(item[prop]) === String(filteredObj[prop]));
            });

            // If the object exists, update the count values; otherwise, push a new object
            if (index !== -1) {
                sumColumns.forEach(sumColumn => {
                    acc[index][sumColumn as string] = (
                        (acc[index][sumColumn as string] as number) || 0
                    ) + (obj[sumColumn] as number || 0);
                });
                uniqueColumns.forEach(uniqueColumn => {
                    if (obj[uniqueColumn] !== '-') {
                        const uniqueValue = obj[uniqueColumn] as string;
                        const uniqueSet = acc[index][uniqueColumn as string] as Set<string>;
                        uniqueSet.add(uniqueValue);
                    }
                });
            } else {
                const newObj: ResultObjectType = {
                    ...filteredObj,
                };
                sumColumns.forEach(sumColumn => {
                    newObj[sumColumn as string] = obj[sumColumn] as number || 0;
                });
                uniqueColumns.forEach(uniqueColumn => {
                    if (obj[uniqueColumn] !== '-') {
                        //@ts-ignore
                        newObj[uniqueColumn as string] = new Set([obj[uniqueColumn] as string]);
                    } else {
                        //@ts-ignore
                        newObj[uniqueColumn as string] = new Set<string>();
                    }
                });
                acc.push(newObj);
            }

            return acc;
        }, []);

        // Update unique values to the actual count of unique values
        result.forEach(obj => {
            uniqueColumns.forEach(uniqueColumn => {
                const columnValue = obj[uniqueColumn as string];
                //@ts-ignore
                if (columnValue instanceof Set) {
                    obj[uniqueColumn as string] = columnValue.size;
                } else if (columnValue === '-') {
                    obj[uniqueColumn as string] = 0; // Set count to 0 for '-'
                } else {
                    obj[uniqueColumn as string] = 1; // Set count to 1 for single value
                }
            });
        });

        callback();
        return result;
    };
}

// const inputArray = [
//     { wh: 'WH1', prod: 'p1', doc: 'DOC1', count1: 1, count2: 1, uniqueColumn: 'value1' },
//     { wh: 'WH1', prod: 'p1', doc: 'DOC2', count1: 5, count2: 1, uniqueColumn: 'value2' },
//     { wh: 'WH2', prod: 'p1', doc: 'DOC1', count1: 3, count2: 1, uniqueColumn: 'value1' },
//     { wh: 'WH3', prod: 'p2', doc: 'DOC1', count1: 2, count2: 1, uniqueColumn: 'value3' }
// ];
//
// const result = collapseTable(['wh'], ['count1', 'count2'], ['uniqueColumn'])(inputArray);