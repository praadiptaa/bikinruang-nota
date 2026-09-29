/**
 * Format an integer amount into Indonesian Rupiah format.
 * Example: 350000 -> "Rp350.000"
 */
export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp0';
  }
  const rounded = Math.round(amount);
  return 'Rp' + rounded.toLocaleString('id-ID');
}

/**
 * Parse a raw user input string into an integer Rupiah number.
 * Example: "Rp 350.000" -> 350000
 */
export function parseRupiahInput(value: string): number {
  if (!value) return 0;
  // Remove all non-digit characters
  const cleanNumber = value.replace(/\D/g, '');
  return cleanNumber ? parseInt(cleanNumber, 10) : 0;
}

/**
 * Format date string into Indonesian readable date
 * Example: "2026-09-25" -> "25 September 2026"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Format date string to short format
 * Example: "2026-09-25" -> "25 Sep 2026"
 */
export function formatDateShort(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Format percentage
 * Example: 62.5 -> "62.5%"
 */
export function formatPercentage(value: number): string {
  if (isNaN(value)) return '0%';
  return `${Math.round(value * 10) / 10}%`;
}
