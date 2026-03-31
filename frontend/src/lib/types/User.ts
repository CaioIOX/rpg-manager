export interface User {
    id: string;
    username: string;
    email: string;
    is_premium?: boolean;
    document_count?: number;
    created_at: string;
}