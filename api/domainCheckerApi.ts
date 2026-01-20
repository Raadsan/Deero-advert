// frontend/api/domainApi.ts

export interface DomainCheckResult {
    domain: string;
    available: boolean;
    price: string;
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
    if (!url || url === 'undefined') return 'http://localhost:5000';
    return url;
};

// Fetch all available domain prices from backend
export const fetchAllDomainPrices = async (): Promise<DomainPrice[]> => {
    try {
        const response = await fetch(`${getApiUrl()}/api/domain-prices`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.success ? data.prices : [];
    } catch (error) {
        console.error("Failed to fetch domain prices:", error);
        return [];
    }
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

    const results: DomainCheckResult[] = [];
    const BATCH_SIZE = 3;

    for (let i = 0; i < tldsToCheck.length; i += BATCH_SIZE) {
        const batch = tldsToCheck.slice(i, i + BATCH_SIZE);
        const batchPromises = batch.map(async (tld) => {
            const domainName = (baseName + tld).toLowerCase();
            const price = priceMap.get(tld.toLowerCase()) || 14.99; // Fallback price

            try {
                // Using rdap.org for availability check
                const response = await fetch(`https://rdap.org/domain/${domainName}`);

                // Rate limit handling: If 429, wait and retry once or treat as unknown
                if (response.status === 429) {
                    console.warn(`Rate limited for ${domainName}, treating as available`);
                    return {
                        domain: domainName,
                        available: true,
                        price: `$${price.toFixed(2)}/Year`
                    };
                }

                return {
                    domain: domainName,
                    available: response.status === 404,
                    price: `$${price.toFixed(2)}/Year`
                };
            } catch (error) {
                console.error(`RDAP check failed for ${domainName}:`, error);
                return {
                    domain: domainName,
                    available: true, // Assume available on error
                    price: `$${price.toFixed(2)}/Year`
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
