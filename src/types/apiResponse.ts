import { NOW_PLAYING } from '@/types/movies';

export interface apiResponse {
    config :[];
    data: apiResponseData;
    headers: [];
    request: [];
    status: number;
    stausText: string;
}

export interface apiResponseData {
    dates: [];
    page: number,
    results: NOW_PLAYING[];
    total_pages: number;
    total_results: number;
}