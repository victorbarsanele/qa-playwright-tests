import { expect, test } from '@playwright/test';
import { ProductsApi } from '../../requests/products.api';

type ProductsApiResponse = {
    responseCode: number;
    message?: string;
    products?: unknown[];
    brands?: unknown[];
};

test.describe('API - Products', () => {
    test('PROD-007 should return products list with GET /productsList', async ({
        request,
    }) => {
        const productsApi = new ProductsApi(request);

        const result =
            (await productsApi.getProductsList()) as ProductsApiResponse;

        expect(result.responseCode).toBe(200);
        expect(Array.isArray(result.products)).toBeTruthy();
        expect(result.products?.length ?? 0).toBeGreaterThan(0);
    });

    test('PROD-008 should reject POST /productsList with method not supported', async ({
        request,
    }) => {
        const response = await request.post('/api/productsList');
        const result = (await response.json()) as ProductsApiResponse;

        expect(result.responseCode).toBe(405);
        expect(result.message ?? '').toMatch(/not supported/i);
    });

    test('PROD-009 should return brands list with GET /brandsList', async ({
        request,
    }) => {
        const productsApi = new ProductsApi(request);

        const result =
            (await productsApi.getBrandsList()) as ProductsApiResponse;

        expect(result.responseCode).toBe(200);
        expect(Array.isArray(result.brands)).toBeTruthy();
        expect(result.brands?.length ?? 0).toBeGreaterThan(0);
    });

    test('PROD-010 should reject PUT /brandsList with method not supported', async ({
        request,
    }) => {
        const response = await request.put('/api/brandsList');
        const result = (await response.json()) as ProductsApiResponse;

        expect(result.responseCode).toBe(405);
        expect(result.message ?? '').toMatch(/not supported/i);
    });

    test('PROD-011 should search product with POST /searchProduct and parameter', async ({
        request,
    }) => {
        const productsApi = new ProductsApi(request);

        const result = (await productsApi.searchProduct(
            'top',
        )) as ProductsApiResponse;

        expect(result.responseCode).toBe(200);
        expect(Array.isArray(result.products)).toBeTruthy();
        expect(result.products?.length ?? 0).toBeGreaterThan(0);
    });

    test('PROD-012 should reject POST /searchProduct without parameter', async ({
        request,
    }) => {
        const response = await request.post('/api/searchProduct');
        const result = (await response.json()) as ProductsApiResponse;

        expect(result.responseCode).toBe(400);
        expect(result.message ?? '').toMatch(
            /search_product|parameter|bad request/i,
        );
    });
});
