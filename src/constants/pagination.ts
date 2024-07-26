export const PageOptions=(tGen) => [
    { value: '10', label: `10 ${tGen('perPageText')}` },
    { value: '20', label: `20 ${tGen('perPageText')}` },
    { value: '50', label: `50 ${tGen('perPageText')}` },
    { value: '100', label: `100 ${tGen('perPageText')}` },
    { value: '1000', label: `1000 ${tGen('perPageText')}`},
    { value: '1000000', label: tGen('allText') },
];