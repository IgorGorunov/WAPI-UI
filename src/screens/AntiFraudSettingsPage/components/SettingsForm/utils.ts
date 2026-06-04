//round helper
import {AntiFraudGradationType} from "@/screens/AntiFraudSettingsPage/types";

export const round2 = (n: number) => Math.round(n * 100) / 100;

//validation
export const validateGradationCoverage = (gradations: AntiFraudGradationType[], isPremium?: boolean) => {
    if (!gradations.length) return null;
    for (let i = 0; i < gradations.length; i++) {
        const row = gradations[i];
        
        // Convert to numbers since form inputs may provide strings
        const minVal = Number(row.minValue);
        const maxVal = Number(row.maxValue);
        
        // If either is NaN (e.g. empty string), let standard field validation handle it
        if (isNaN(minVal) || isNaN(maxVal)) continue;

        if (i === 0 && round2(minVal) !== 0) return `Row 1: min must be 0.00`;
        if (i > 0) {
            const prevMax = Number(gradations[i - 1].maxValue);
            if (!isNaN(prevMax)) {
                const expected = round2(prevMax) + 0.01;
                if (round2(minVal) !== expected) {
                    return `Row ${i + 1}: min must be ${expected.toFixed(2)} (prev max was ${prevMax.toFixed(2)})`;
                }
            }
        }
        
        if (maxVal < minVal) return `Row ${i + 1}: max must be greater or equal than min`;
        if (minVal < 0 || minVal > 100 || maxVal < 0 || maxVal > 100)
            return `Row ${i + 1}: values must be between 0 and 100`;
    }
    return null;
};