import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/cart.page';
import { ProductsPage } from '../../pages/products.page';

function parseCurrencyValue(text: string): number {
    const digits = text.replace(/[^0-9]/g, '');
    return Number(digits);
}

test.describe('Cart Tests', () => {
    test.beforeEach(async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clearCartIfNeeded();
    });

    test('CART-001 should add a single product to cart', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        await productsPage.goToProductsPage();
        await productsPage.addFirstProductToCartAndOpenCart();
        await cartPage.verifyCartHasItems();
    });

    test('CART-002 should add multiple products to cart', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        await productsPage.goToProductsPage();

        const addButtons = page
            .locator('.features_items .productinfo.text-center a')
            .filter({ hasText: 'Add to cart' });

        await addButtons.nth(0).click({ force: true });
        await page.getByRole('button', { name: /Continue Shopping/i }).click();
        await addButtons.nth(1).click({ force: true });
        await page
            .getByRole('link', { name: /View Cart/i })
            .first()
            .click();

        await cartPage.verifyCartHasItems();
        await expect(page.locator('tr[id^="product-"]')).toHaveCount(2, {
            timeout: 15000,
        });
    });

    test('CART-003 should remove product from cart', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        await productsPage.goToProductsPage();
        await productsPage.addFirstProductToCartAndOpenCart();
        await cartPage.removeFirstItem();
        await cartPage.verifyEmptyCart();
    });

    test('CART-004 should verify product price, quantity, and total in cart', async ({
        page,
    }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.goToProductsPage();
        await productsPage.addFirstProductToCartAndOpenCart();

        const row = page.locator('tr[id^="product-"]').first();
        await expect(row).toBeVisible({ timeout: 15000 });

        const unitPriceText = (
            await row.locator('.cart_price p').first().innerText()
        ).trim();
        const quantityText = (
            await row.locator('.cart_quantity button').first().innerText()
        ).trim();
        const totalPriceText = (
            await row.locator('.cart_total p').first().innerText()
        ).trim();

        const unitPrice = parseCurrencyValue(unitPriceText);
        const quantity = Number(quantityText);
        const totalPrice = parseCurrencyValue(totalPriceText);

        expect(unitPrice).toBeGreaterThan(0);
        expect(quantity).toBeGreaterThan(0);
        expect(totalPrice).toBe(unitPrice * quantity);
    });

    test('CART-005 should continue shopping after adding product', async ({
        page,
    }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        await productsPage.goToProductsPage();

        const firstAddButton = page
            .locator('.features_items .productinfo.text-center a')
            .filter({ hasText: 'Add to cart' })
            .first();

        await firstAddButton.click({ force: true });
        await page.getByRole('button', { name: /Continue Shopping/i }).click();

        await expect(page).toHaveURL(/\/products/);

        await firstAddButton.click({ force: true });
        await page
            .getByRole('link', { name: /View Cart/i })
            .first()
            .click();
        await cartPage.verifyCartHasItems();
    });
});
