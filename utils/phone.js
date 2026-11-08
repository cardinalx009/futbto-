/**
 * Utility functions for phone number formatting
 */

/**
 * Normalize phone number to Uzbek international format (+998XXXXXXXXX)
 * Handles: +998975372043, 998975372043, 975372043, 8998975372043, etc.
 */
function formatPhoneNumber(phone) {
  if (!phone) return phone;

  // Remove all non-digit characters
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return phone;

  // Drop leading 8 (national trunk prefix)
  if (digits.length === 13 && digits.startsWith('8')) {
    digits = digits.slice(1);
  }

  // Drop country code 998 to get the 9-digit local number
  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  }

  // Uzbek local number is 9 digits
  if (digits.length === 9) {
    return `+998${digits}`;
  }

  return phone;
}

/**
 * Mask phone number for privacy
 * Example: +998970986226 -> +99897***6226
 */
function maskPhoneNumber(phone) {
  if (!phone) return 'Ko\'rsatilmagan';
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If phone starts with +998 (Uzbekistan)
  if (cleaned.startsWith('+998') && cleaned.length >= 12) {
    const countryCode = '+998';
    const rest = cleaned.substring(4); // Remove +998 (12 digits total: +998 + 9 digits)
    
    if (rest.length >= 9) {
      // Show first 2 digits after country code, mask middle, show last 4
      // +998970986226 -> +99897***6226
      const firstPart = rest.substring(0, 2); // 97
      const lastPart = rest.substring(rest.length - 4); // 6226
      return `${countryCode}${firstPart}***${lastPart}`;
    }
  }
  
  // For other formats, show first 3 and last 4
  if (cleaned.length >= 7) {
    const firstPart = cleaned.substring(0, Math.min(3, cleaned.length - 4));
    const lastPart = cleaned.substring(cleaned.length - 4);
    return `${firstPart}***${lastPart}`;
  }
  
  // If too short, just mask it
  return '***' + cleaned.substring(Math.max(0, cleaned.length - 3));
}

module.exports = {
  formatPhoneNumber,
  maskPhoneNumber
};

