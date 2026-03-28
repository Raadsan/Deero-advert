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
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:5000/api';
    }
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url || url === 'undefined') return 'https://deero-advert-production-a27c.up.railway.app/api';
    return url;
};

// Fetch all active domain prices from backend
export const fetchAllDomainPrices = async (): Promise<DomainPrice[]> => {
    try {
        const res = await fetch(`${getApiUrl()}/domain-prices`, {
            method: "GET",
            cache: "no-store",
        });
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
            return data.data
                .filter((item: any) => item.isActive)
                .map((item: any) => ({
                    tld: item.tld,
                    newPrice: item.price,
                    duration: '1 Year'
                }));
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch domain prices:", error);
        return [];
    }
};

// Check domain availability
export const checkDomainAvailability = async (
    domain: string
): Promise<DomainCheckResponse> => {
    const res = await fetch(
        `${getApiUrl()}/domain/check?domain=${encodeURIComponent(domain)}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message || "Failed to check domain");
    }

    // Get price from backend
    const allPrices = await fetchAllDomainPrices();
    const lastDotIndex = domain.lastIndexOf('.');
    const tld = lastDotIndex !== -1 ? domain.substring(lastDotIndex).toLowerCase() : '.com';
    const priceObj = allPrices.find(p => p.tld.toLowerCase() === tld);
    const priceText = priceObj?.newPrice ? `$${priceObj.newPrice.toFixed(2)}` : "$13.99";

    return {
        success: true,
        results: [
            {
                id: domain,
                domain,
                available: data.result.available,
                invalidTld: false,
                price: priceText,
            },
        ],
    };
};
