import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/cart.page';
import { ProductsPage } from '../../pages/products.page';

test.describe('Products Tests', () => {
    test.beforeEach(async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clearCartIfNeeded();
    });

    test('PROD-001 should display all products page and listing', async ({
        page,
    }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.goToProductsPage();
        await productsPage.verifyProductsListVisible();
    });

    test('PROD-002 should search product by keyword and show result', async ({
        page,
    }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.goToProductsPage();
        await productsPage.searchProduct('Blue Top');
        await productsPage.verifySearchResultContains('Blue Top');
    });

    test('PROD-003 should navigate to category-filtered products', async ({
        page,
    }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.goToProductsPage();
        await page.locator('a[href="#Women"]').first().click({ force: true });
        await page
            .locator('a[href*="/category_products/"]')
            .filter({ hasText: /Dress/i })
            .first()
            .click({ force: true });

        await expect(page).toHaveURL(/\/category_products\//);
        await expect(
            page.getByRole('heading', { name: /Women - Dress Products/i }),
        ).toBeVisible({ timeout: 15000 });
    });

    test('PROD-004 should open product details page from listing', async ({
        page,
    }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.goToProductsPage();
        await productsPage.openFirstProductDetails();
        await productsPage.verifyProductDetailsPageVisible();
    });

    test('PROD-005 should show key product details on product details page', async ({
        page,
    }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.goToProductsPage();
        await productsPage.openFirstProductDetails();

        await expect(page.getByText(/Category:/i)).toBeVisible({
            timeout: 15000,
        });
        await expect(page.getByText(/Availability:/i)).toBeVisible({
            timeout: 15000,
        });
        await expect(page.getByText(/Condition:/i)).toBeVisible({
            timeout: 15000,
        });
        await expect(page.getByText(/Brand:/i)).toBeVisible({ timeout: 15000 });
    });

    test('PROD-006 should add product to cart from products page', async ({
        page,
    }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        await productsPage.goToProductsPage();
        await productsPage.addFirstProductToCartAndOpenCart();
        await cartPage.verifyCartHasItems();
    });
});
