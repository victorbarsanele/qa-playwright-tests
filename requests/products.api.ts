import { APIRequestContext, APIResponse } from '@playwright/test';

// AutomationExercise Products API helper
// Endpoints: GET /productsList, GET /brandsList,
// POST /searchProduct (form param: search_product)
// All use form data for POST requests.

export class ProductsApi {
    constructor(private request: APIRequestContext) {}

    async getProductsList(retries = 3, delayMs = 2000): Promise<unknown> {
        let lastError: unknown;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await this.request.get('/api/productsList');
                return this.readJson<unknown>(response);
            } catch (error) {
                lastError = error;
                if (attempt < retries) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, delayMs),
                    );
                }
            }
        }
        throw lastError;
    }

    async getBrandsList(): Promise<unknown> {
        const response = await this.request.get('/api/brandsList');
        return this.readJson<unknown>(response);
    }

    async searchProduct(searchProduct: string): Promise<unknown> {
        const response = await this.request.post('/api/searchProduct', {
            form: { search_product: searchProduct },
        });
        return this.readJson<unknown>(response);
    }

    private async readJson<T>(response: APIResponse): Promise<T> {
        return (await response.json()) as T;
    }
}
