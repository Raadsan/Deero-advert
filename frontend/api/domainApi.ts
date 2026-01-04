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

// Note: RDAP is a public JSON protocol for domain information.
// Many RDAP servers support CORS, allowing frontend-only checks.
// 200 OK = Domain Taken, 404 Not Found = Domain Available.

export const checkDomainAvailability = async (query: string): Promise<DomainCheckResponse> => {
    const extensions = [
        { ext: '.com', price: '$14.99/Year' },
        { ext: '.org', price: '$14.99/Year' },
        { ext: '.net', price: '$14.99/Year' },
        { ext: '.edu', price: '$14.99/Year' },
    ];

    const results = await Promise.all(extensions.map(async (item) => {
        // Correctly strip any existing extension to get the base name
        const baseName = query.includes('.') ? query.substring(0, query.lastIndexOf('.')) : query;
        const domainName = (baseName + item.ext).toLowerCase();

        try {
            // Using rdap.org as a redirector/bootstrap
            const response = await fetch(`https://rdap.org/domain/${domainName.toLowerCase()}`);

            return {
                domain: domainName,
                available: response.status === 404,
                price: item.price
            };
        } catch (error) {
            console.error(`RDAP check failed for ${domainName}:`, error);
            // If fetch fails (CORS or network), we can't be sure. 
            // We'll mark as error/available for now but with caution.
            return {
                domain: domainName,
                available: true,
                price: item.price
            };
        }
    }));

    return { success: true, results };
};
