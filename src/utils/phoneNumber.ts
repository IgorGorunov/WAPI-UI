
// Lazy load google-libphonenumber to reduce initial bundle size
export const isPhoneValid = async (phone: string): Promise<boolean> => {
    try {
        // Dynamic import - only loads when function is called
        const { PhoneNumberUtil } = await import('google-libphonenumber');
        const phoneUtil = PhoneNumberUtil.getInstance();

        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};