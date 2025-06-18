// utils/random-generator.ts

/**
 * Generates a random alphanumeric string of a specified length.
 * The string consists of uppercase letters (A-Z) and digits (0-9).
 *
 * @param length The desired length of the generated string. Defaults to 12.
 * @returns A random alphanumeric string.
 */
export const generateRandomString = (length: number = 12): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charsLength = chars.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsLength);
        result += chars[randomIndex];
    }

    return result;
};