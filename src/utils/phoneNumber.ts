import { isValidPhoneNumber } from 'libphonenumber-js';

export const isPhoneValid = (phone: string): boolean => {
    if (!phone || phone.length <= 4) return false;
    try {
        return isValidPhoneNumber(phone);
    } catch {
        return false;
    }
};