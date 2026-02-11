// frontend/api/domainApi.ts

export interface DomainCheckResult {
    domain: string;
    available: boolean;
    price: string;
    id: string;
    invalidTld?: boolean;
}

export interface DomainCheckResponse {
    success: boolean;
    results: DomainCheckResult[];
}

export interface DomainPrice {
    tld: string;
    newPrice: number;
    duration: string;
}

// Helper to get API URL with fallback
const getApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url || url === 'undefined') return 'https://deero-advert-backend.onrender.com/api';
    return url;
};

// Fetch all available domain prices from backend
// Hardcoded prices since backend endpoint is removed
import { VALID_TLDS } from "./validTlds";

export const fetchAllDomainPrices = async (): Promise<DomainPrice[]> => {
    return [
        { tld: '.com', newPrice: 13.48, duration: '1 Year' },
        { tld: '.net', newPrice: 14.88, duration: '1 Year' },
        { tld: '.org', newPrice: 13.88, duration: '1 Year' },
        { tld: '.io', newPrice: 41.88, duration: '1 Year' },
        { tld: '.co', newPrice: 36.88, duration: '1 Year' },
        { tld: '.ai', newPrice: 215.76, duration: '2 Year' },
        { tld: '.info', newPrice: 9.99, duration: '1 Year' },
        { tld: '.biz', newPrice: 12.99, duration: '1 Year' },
        { tld: '.online', newPrice: 5.28, duration: '1 Year' }, // Added per request
        { tld: '.xyz', newPrice: 10.99, duration: '1 Year' },
        { tld: '.tech', newPrice: 9.99, duration: '1 Year' },
        { tld: '.store', newPrice: 19.99, duration: '1 Year' },
        { tld: '.me', newPrice: 18.99, duration: '1 Year' },
        { tld: '.site', newPrice: 2.99, duration: '1 Year' }
    ];
};

// Check domain availability for specific TLDs
// If no TLDs provided, defaults to ALL available TLDs from backend
export const checkDomainAvailability = async (
    query: string,
    selectedTlds?: string[]
): Promise<DomainCheckResponse> => {
    // Get all prices from backend
    const allPrices = await fetchAllDomainPrices();

    // If selectedTlds is provided, use it.
    // Otherwise, use ALL TLDs from the backend.
    // Only fallback to hardcoded list if backend fetch fails completely (empty array).
    let tldsToCheck: string[];

    if (selectedTlds && selectedTlds.length > 0) {
        tldsToCheck = selectedTlds;
    } else if (allPrices.length > 0) {
        tldsToCheck = allPrices.map(p => p.tld);
    } else {
        tldsToCheck = ['.com', '.org', '.net', '.edu']; // Final fallback
    }

    // Find prices for selected TLDs
    const priceMap = new Map(allPrices.map(p => [p.tld.toLowerCase(), p.newPrice]));

    // Strip any existing extension to get base name
    const baseName = query.includes('.') ? query.substring(0, query.lastIndexOf('.')) : query;

    // Detect if user typed a specific extension that wasn't covered
    if (query.includes('.')) {
        const ext = query.substring(query.lastIndexOf('.')).toLowerCase();

        // VALIDATION: Check if it's a real TLD
        if (!VALID_TLDS.includes(ext)) {
            // If explicit extension is invalid, fail immediately for this batch
            return {
                success: true,
                results: [{
                    id: query,
                    domain: query,
                    available: false,
                    price: 'N/A',
                    invalidTld: true
                }]
            };
        }

        if (!tldsToCheck.includes(ext)) {
            tldsToCheck.push(ext);
        }
    }

    const results: DomainCheckResult[] = [];
    const BATCH_SIZE = 3;
    const API_URL = getApiUrl(); // Use the helper to get base API URL

    for (let i = 0; i < tldsToCheck.length; i += BATCH_SIZE) {
        const batch = tldsToCheck.slice(i, i + BATCH_SIZE);
        const batchPromises = batch.map(async (tld) => {
            const domainName = (baseName + tld).toLowerCase();
            let fallbackPrice = priceMap.get(tld.toLowerCase()) || 19.99;

            try {
                // Call backend API instead of RDAP
                const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
                const response = await fetch(`${baseUrl}/domain/check-domain?domain=${domainName}`);

                if (!response.ok) {
                    throw new Error(`Backend API error: ${response.status}`);
                }

                const data = await response.json();

                // Backend returns: { domain, available, price, currency }
                // If backend price is null, use fallback
                const finalPrice = data.price ? data.price : fallbackPrice;
                const currency = data.currency || 'USD';

                // Format price string
                // Assuming price is number.
                const priceString = `$${Number(finalPrice).toFixed(2)}/Year`;

                return {
                    id: domainName,
                    domain: data.domain || domainName,
                    available: data.available,
                    price: priceString
                };
            } catch (error) {
                console.error(`Domain check failed for ${domainName}:`, error);

                // In case of error (e.g. backend down), return as unavailable or handle gracefully
                // Previous implementation returned checking as available on error which is risky.
                // Let's assume unavailable if check fails to be safe, or return error state.
                // But to match previous behavior of non-blocking UI, we might return a default state.
                // However, returning 'available: false' is safer than 'available: true'.
                return {
                    id: domainName,
                    domain: domainName,
                    available: false,
                    price: `$${fallbackPrice.toFixed(2)}/Year`
                };
            }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Small delay between batches to be nice to the API
        if (i + BATCH_SIZE < tldsToCheck.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    return { success: true, results };
};

