import api from "./axios";

export interface DomainCheckResult {
    domain: string;
    available: boolean;
    price: string | null;
}

export interface DomainCheckResponse {
    success: boolean;
    results: DomainCheckResult[];
}

export const checkDomainAvailability = async (domain: string): Promise<DomainCheckResponse> => {
    const response = await api.get<DomainCheckResponse>(`/domains/check?domain=${domain}`);
    return response.data;
};
