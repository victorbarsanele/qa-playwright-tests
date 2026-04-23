import { test } from '@playwright/test';
import { CartPage } from '../../../pages/cart.page';
import { ProductsPage } from '../../../pages/products.page';

test.describe('Shop - Products', () => {
    test.beforeEach(async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clearCartIfNeeded();
    });

    test('should display products listing', async ({ page }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.goToProductsPage();
        await productsPage.verifyProductsListVisible();
    });

    test('should open product details from products listing', async ({
        page,
    }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.goToProductsPage();
        await productsPage.openFirstProductDetails();
        await productsPage.verifyProductDetailsPageVisible();
    });

    test('should search products by keyword', async ({ page }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.goToProductsPage();
        await productsPage.searchProduct('Blue Top');
        await productsPage.verifySearchResultContains('Blue Top');
    });
});
