import { BusinessInfo, BusinessInfoStore } from "./types";

/**
 * Normalizes an address string to a standard format for comparison.
 * Handles both formats:
 * - Google Drive format: "1599_US_70_GARNER_NC_27529" (uppercase, underscore-separated)
 * - CSV format: "2151 Hawkins St, Charlotte, NC 28203, USA" (standard address)
 */
export function normalizeAddress(address: string): string {
  if (!address || typeof address !== "string") {
    return "";
  }
  
  return address
    // Convert to uppercase
    .toUpperCase()
    // Remove "USA" suffix if present
    .replace(/,?\s*USA$/i, "")
    // Replace common separators with single space
    .replace(/[_,]+/g, " ")
    // Remove common abbreviations periods
    .replace(/\./g, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    // Remove common words that might differ
    .replace(/\b(STREET|ST|AVENUE|AVE|ROAD|RD|DRIVE|DR|LANE|LN|BOULEVARD|BLVD|COURT|CT|PLACE|PL|WAY|CIRCLE|CIR)\b/gi, "")
    // Remove all non-alphanumeric characters except spaces
    .replace(/[^A-Z0-9\s]/g, "")
    // Normalize whitespace again
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts zip code from an address string.
 */
export function extractZipCode(address: string): string | null {
  if (!address) return null;
  
  // Match 5-digit US zip code
  const zipMatch = address.match(/\b(\d{5})(?:-\d{4})?\b/);
  return zipMatch ? zipMatch[1] : null;
}

/**
 * Extracts street number from an address string.
 */
export function extractStreetNumber(address: string): string | null {
  if (!address) return null;
  
  // Match leading numbers (street number)
  const numMatch = address.match(/^(\d+)/);
  return numMatch ? numMatch[1] : null;
}

/**
 * Attempts to find a matching business info for the given address.
 * Uses multiple matching strategies for robustness.
 */
export function findBusinessInfo(
  driveAddress: string,
  businessInfoStore: BusinessInfoStore
): BusinessInfo | null {
  if (!driveAddress || Object.keys(businessInfoStore).length === 0) {
    return null;
  }

  try {
    const normalizedDrive = normalizeAddress(driveAddress);
    const driveZip = extractZipCode(driveAddress);
    const driveStreetNum = extractStreetNumber(driveAddress);
    
    // Strategy 1: Direct normalized match
    if (businessInfoStore[normalizedDrive]) {
      return businessInfoStore[normalizedDrive];
    }
    
    // Strategy 2: Find best partial match
    let bestMatch: BusinessInfo | null = null;
    let bestScore = 0;
    
    for (const [normalizedCsv, info] of Object.entries(businessInfoStore)) {
      let score = 0;
      
      // Check zip code match (high weight)
      const csvZip = extractZipCode(info.address || normalizedCsv);
      if (driveZip && csvZip && driveZip === csvZip) {
        score += 50;
      }
      
      // Check street number match (high weight)
      const csvStreetNum = extractStreetNumber(info.address || normalizedCsv);
      if (driveStreetNum && csvStreetNum && driveStreetNum === csvStreetNum) {
        score += 30;
      }
      
      // Check if normalized addresses contain each other's significant parts
      const driveWords = normalizedDrive.split(" ").filter(w => w.length > 2);
      const csvWords = normalizedCsv.split(" ").filter(w => w.length > 2);
      
      for (const word of driveWords) {
        if (csvWords.includes(word)) {
          score += 5;
        }
      }
      
      // Check if all significant drive words are in csv
      const allDriveWordsMatch = driveWords.every(w => normalizedCsv.includes(w));
      if (allDriveWordsMatch && driveWords.length > 2) {
        score += 20;
      }
      
      if (score > bestScore && score >= 50) { // Minimum threshold
        bestScore = score;
        bestMatch = info;
      }
    }
    
    return bestMatch;
  } catch (error) {
    // Fail silently - this is an optional feature
    console.error("Error finding business info:", error);
    return null;
  }
}

/**
 * Parses a CSV string into an array of objects.
 * Handles quoted fields and commas within quotes.
 */
export function parseCSV(csvString: string): Record<string, string>[] {
  if (!csvString || typeof csvString !== "string") {
    return [];
  }

  try {
    const lines = csvString.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) {
      return []; // Need at least header + one data row
    }

    // Parse header row
    const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
    
    // Parse data rows
    const results: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === 0) continue;
      
      const row: Record<string, string> = {};
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        const value = values[j] || "";
        row[header] = value.trim();
      }
      results.push(row);
    }
    
    return results;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    return [];
  }
}

/**
 * Parses a single CSV line, handling quoted fields.
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        // End of quoted field
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        // Start of quoted field
        inQuotes = true;
      } else if (char === ",") {
        // Field separator
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  
  // Add last field
  result.push(current);
  
  return result;
}

/**
 * Creates a BusinessInfoStore from parsed CSV data.
 */
export function createBusinessInfoStore(
  csvData: Record<string, string>[]
): BusinessInfoStore {
  const store: BusinessInfoStore = {};
  
  for (const row of csvData) {
    // Try to find the address field (could be "address", "Address", etc.)
    const addressKey = Object.keys(row).find(k => 
      k.toLowerCase() === "address" || 
      k.toLowerCase().includes("address")
    );
    
    if (!addressKey || !row[addressKey]) {
      continue;
    }
    
    const address = row[addressKey];
    const normalizedKey = normalizeAddress(address);
    
    if (!normalizedKey) {
      continue;
    }
    
    // Map CSV columns to BusinessInfo
    const info: BusinessInfo = {
      address: address,
    };
    
    // Map common field names
    for (const [key, value] of Object.entries(row)) {
      const lowerKey = key.toLowerCase();
      if (lowerKey === "name" || lowerKey.includes("business") && lowerKey.includes("name")) {
        info.name = value;
      } else if (lowerKey === "type" || lowerKey.includes("type") || lowerKey.includes("category")) {
        info.type = value;
      } else if (lowerKey === "rating" || lowerKey.includes("rating")) {
        info.rating = value;
      } else if (lowerKey === "status" || lowerKey.includes("status")) {
        info.status = value;
      } else if (lowerKey !== addressKey.toLowerCase()) {
        // Store any other fields
        info[key] = value;
      }
    }
    
    store[normalizedKey] = info;
  }
  
  return store;
}

/**
 * Validates a CSV file for business info upload.
 * Returns an error message if invalid, null if valid.
 */
export function validateBusinessInfoCSV(csvString: string): { 
  isValid: boolean; 
  error?: string; 
  rowCount?: number;
} {
  if (!csvString || typeof csvString !== "string") {
    return { isValid: false, error: "Empty or invalid file content" };
  }

  try {
    const parsed = parseCSV(csvString);
    
    if (parsed.length === 0) {
      return { isValid: false, error: "No data rows found in CSV" };
    }
    
    // Check if address column exists
    const firstRow = parsed[0];
    const hasAddress = Object.keys(firstRow).some(k => 
      k.toLowerCase() === "address" || 
      k.toLowerCase().includes("address")
    );
    
    if (!hasAddress) {
      return { 
        isValid: false, 
        error: "CSV must have an 'Address' column. Found columns: " + Object.keys(firstRow).join(", ")
      };
    }
    
    return { isValid: true, rowCount: parsed.length };
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : "Failed to parse CSV" 
    };
  }
}
