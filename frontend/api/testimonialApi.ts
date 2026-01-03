import axios from "@/api/axios";

export interface Testimonial {
    _id: string;
    clientName: string;
    clientTitle: string;
    clientImage: string;
    message: string;
    rating: number;
    createdAt?: string;
    updatedAt?: string;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
    const response = await axios.get("/testimonials");
    return response.data;
};

export const addTestimonial = async (formData: FormData) => {
    const response = await axios.post("/testimonials", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateTestimonial = async (id: string, formData: FormData) => {
    const response = await axios.patch(`/testimonials/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteTestimonial = async (id: string) => {
    const response = await axios.delete(`/testimonials/${id}`);
    return response.data;
};
