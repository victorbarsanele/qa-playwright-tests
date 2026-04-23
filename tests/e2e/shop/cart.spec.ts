import { test } from '@playwright/test';
import { CartPage } from '../../../pages/cart.page';
import { ProductsPage } from '../../../pages/products.page';

test.describe('Shop - Cart', () => {
    test.beforeEach(async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clearCartIfNeeded();
    });

    test('should add a product to cart from products page', async ({
        page,
    }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        await productsPage.goToProductsPage();
        await productsPage.addFirstProductToCartAndOpenCart();
        await cartPage.verifyCartHasItems();
    });

    test('should show proceed to checkout when cart has item', async ({
        page,
    }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        await productsPage.goToProductsPage();
        await productsPage.addFirstProductToCartAndOpenCart();
        await cartPage.verifyProceedToCheckoutVisible();
    });

    test('should remove item from cart and show empty cart state', async ({
        page,
    }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        await productsPage.goToProductsPage();
        await productsPage.addFirstProductToCartAndOpenCart();
        await cartPage.removeFirstItem();
        await cartPage.verifyEmptyCart();
    });
});
