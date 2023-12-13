export const GetFilterArray = (inputArray, keyProp, AllValuesLabel) => {
    const allValues = inputArray.map(item => item[keyProp]);
    const uniqueValues = Array.from(new Set(allValues));

    const sortedUniqueValues = uniqueValues.sort();

    return [
        {
            value: '',
            label: AllValuesLabel,
        },
        ...sortedUniqueValues.map(value => ({
            value: value,
            label: value,
        }))
    ];
};