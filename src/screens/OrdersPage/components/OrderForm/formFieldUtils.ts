export const orderFieldLabels = {
    'MX': {
        state_region: 'State/region (Estado)',
        county_district: 'District (Municipio)',
        city_subdivision: 'City subdivision (Colonia)',
        street: 'Street (Calle)',
        street_number: 'Street number (Numero exterior)',
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
        street_number: 'Street number',
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
    'MX': [],
    'BGWH4': ['street', 'building'],

}

export const isFieldRequired = (country: string, warehouse: string, field: string) => {
    console.log('chec k: ', country, warehouse, field, (requiredFields[country] || []).includes(field) || (requiredFields[warehouse] || []).includes(field) || false);
    return (requiredFields[country] || []).includes(field) || (requiredFields[warehouse] || []).includes(field) || false;
};