import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const VATSENSE_API_KEY = '3155297aa06bcf4e5fba809b82241b8e';

const EUCodes = ['AT', "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "EL", "ES", "FI", "FR", "HR", "HU", "IE",
    "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK", "XI"];


const isEU = (countryCode: string) => {
    return EUCodes.includes(countryCode);
}

export const checkVATWithVIES = async (
    countryCode: string,
    vatNumber: string
) => {

    const url = `https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number`;

    try {
        const { data } = await axios.post(url, {
            countryCode,
            vatNumber,
        });
        return data.valid
            ? { valid: true, source: "VIES", company: data.name || "Unknown" }
            : { valid: false, source: "VIES" };
    } catch (error) {
        //console.error("VIES API failed:", error.message);
        return null; // Indicate VIES failure
    }
};

export const checkVATWithVATSense = async (vatNumber: string)=> {
    if (!VATSENSE_API_KEY) {
        return { valid: false, source: "VATSense (API Key Missing)" };
    }

    try {
        const response = await axios.get("https://api.vatsense.com/1.0/validate", {
            params: { vat_number: vatNumber }, // Ensure correct query param
            auth: {
                username: "user", // VATSense requires "user" as a username
                password: VATSENSE_API_KEY,
            },
        });

        return {
            valid: response.data.data.valid,
            source: "VATSense",
            company: response.data.data.company_name || "Unknown",
        };

    } catch (error) {
        console.error("VATSense API failed:", error.message);
        return { valid: false, source: "VATSense (Error)" };
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { countryCode, vatNumber } = req.body;
    if (!countryCode || !vatNumber) {
        return res.status(400).json({ error: "Missing countryCode or vatNumber" });
    }

    let vatResult;
    // 1. Try VIES API
    if (isEU(countryCode)) {
        vatResult = await checkVATWithVIES(countryCode, vatNumber);
    }
    //console.log('vat vies:', vatResult);

    // 2. If VIES fails, use VATSense as a fallback
    if (!vatResult) {
        //console.log("Falling back to VATSense...");
        vatResult = await checkVATWithVATSense(`${countryCode}${vatNumber}`);
        //console.log('vat vatsense:', vatResult);
    }

    return res.status(200).json(vatResult);
}