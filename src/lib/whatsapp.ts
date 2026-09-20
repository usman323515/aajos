/**
 * Reusable WhatsApp helpers.
 *
 * A,A JOS COMM's number is stored in local Nigerian format (07036854747).
 * WhatsApp deep links require international format with no leading zero
 * and no "+" (e.g. 2347036854747).
 */

/** Converts a Nigerian local number (070..., 080..., 090...) to international format for wa.me links. */
export function toWhatsAppNumber(localOrIntlNumber: string): string {
  const digits = localOrIntlNumber.replace(/\D/g, "");

  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;

  // Already looks international without the leading 234 marker, or an
  // unexpected format — return digits as-is rather than guessing further.
  return digits;
}

/** Converts a Nigerian local number to E.164 for tel: links, e.g. +2347036854747. */
export function toTelNumber(localOrIntlNumber: string): string {
  return `+${toWhatsAppNumber(localOrIntlNumber)}`;
}

/** Builds a wa.me link, safely URL-encoding the optional message. */
export function buildWhatsAppLink(localOrIntlNumber: string, message?: string): string {
  const number = toWhatsAppNumber(localOrIntlNumber);
  if (!message) return `https://wa.me/${number}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Standard message asking for the current price of a specific product. */
export function priceInquiryMessage(businessPublicName: string, productLabel: string): string {
  return `Hello ${businessPublicName}, I am interested in the ${productLabel}. Please send me the current price.`;
}

/** Standard message asking about EasyBuy, optionally for a specific product. */
export function easyBuyInquiryMessage(businessPublicName: string, productLabel?: string): string {
  if (productLabel) {
    return `Hello ${businessPublicName}, I would like to ask about EasyBuy for the ${productLabel}.`;
  }
  return `Hello ${businessPublicName}, I would like to ask about EasyBuy.`;
}

/** General "chat with us" message for the contact page / floating button. */
export function generalInquiryMessage(businessPublicName: string): string {
  return `Hello ${businessPublicName}, I saw your website and I have a question.`;
}
