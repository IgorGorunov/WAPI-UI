export const orderFieldLabels = {
    'MX': {
        state_region: 'State/region (Estado)',
        county_district: 'District (Municipio)',
        city_subdivision: 'City subdivision (Colonia)',
        street: 'Street (Calle)',
        street_number: 'House number (Numero exterior)',
        house_number: 'House number (Numero exterior)',
        building: 'Building (Edificio)',
        unit: 'Unit (Departamento)',
        details: 'Details (Referencias)',
        receiverAddress: 'Address',
    },
    default: {
        state_region: 'State/region',
        county_district: 'District',
        city_subdivision: 'City subdivision',
        street: 'Street',
        street_number: 'House number',
        house_number: 'House number',
        building: 'Building',
        unit: 'Unit',
        details: 'Details',
        receiverAddress: 'Full address (incl. street & building)',
    }
};

export const getOrderFieldLabel = (country: string, field: keyof typeof orderFieldLabels.default) => {
    const labels = orderFieldLabels[country as keyof typeof orderFieldLabels] || orderFieldLabels.default;
    return labels[field] || orderFieldLabels.default[field];
};

const requiredFields: Record<string, string[]> = {
    'MX': ['street', 'house_number', 'state_region'],
    'BGWH4': ['street', 'building'],

}

export const isFieldRequired = (country: string, warehouse: string, field: string) => {
    return (requiredFields[country] || []).includes(field) || (requiredFields[warehouse] || []).includes(field) || false;
};