
import { PhoneNumberUtil } from 'google-libphonenumber';

export const isPhoneValid = (phone: string) => {
    const phoneUtil = PhoneNumberUtil.getInstance();

    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};