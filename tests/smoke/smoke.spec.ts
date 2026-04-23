import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/cart.page';
import { LoginPage } from '../../pages/login.page';
import { ProductsPage } from '../../pages/products.page';
import { createAccountViaApi } from '../../requests/auth.api';
import { ProductsApi } from '../../requests/products.api';
import { createRandomSignupUser } from '../../utils/user-factory';

test.describe('Smoke Tests', () => {
    test('SMK-001 should load home page successfully', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Automation Exercise/i);
        await expect(page.getByRole('link', { name: /Home/i })).toBeVisible({
            timeout: 15000,
        });
    });

    test('SMK-002 should login successfully with valid user', async ({
        page,
        request,
    }) => {
        const user = createRandomSignupUser();
        const loginPage = new LoginPage(page);

        await createAccountViaApi(request, user);
        await page.goto('/login');
        await loginPage.login(user.email, user.password);
        await loginPage.verifyLoginSuccess();
    });

    test('SMK-003 should display products page content', async ({ page }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.goToProductsPage();
        await productsPage.verifyProductsListVisible();
    });

    test('SMK-004 should add product to cart from products page', async ({
        page,
    }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        await cartPage.clearCartIfNeeded();
        await productsPage.goToProductsPage();
        await productsPage.addFirstProductToCartAndOpenCart();
        await cartPage.verifyCartHasItems();
    });

    test('SMK-005 should pass API health check through products list endpoint', async ({
        request,
    }) => {
        const productsApi = new ProductsApi(request);

        const result = (await productsApi.getProductsList()) as {
            responseCode: number;
            products?: unknown[];
        };

        expect(result.responseCode).toBe(200);
        expect(Array.isArray(result.products)).toBeTruthy();
        expect(result.products?.length ?? 0).toBeGreaterThan(0);
    });
});
