import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/cart.page';
import { ProductsPage } from '../../pages/products.page';
import { safeGoto } from '../../utils/navigation';

function parseCurrencyValue(text: string): number {
    const digits = text.replace(/[^0-9]/g, '');
    return Number(digits);
}

async function waitForAddToCartFeedback(page: any) {
    await Promise.race([
        page
            .getByRole('link', { name: /View Cart/i })
            .first()
            .waitFor({ state: 'visible', timeout: 6000 }),
        page
            .getByRole('button', { name: /Continue Shopping/i })
            .first()
            .waitFor({ state: 'visible', timeout: 6000 }),
        page.waitForTimeout(6000),
    ]).catch(() => {
        // Firefox CI can miss transient modal render; cart navigation is the fallback.
    });
}

async function continueShoppingToProducts(page: any) {
    const continueShopping = page
        .getByRole('button', { name: /Continue Shopping/i })
        .first();

    if (
        await continueShopping.isVisible({ timeout: 2000 }).catch(() => false)
    ) {
        await continueShopping.click({ timeout: 5000 }).catch(async () => {
            await continueShopping.dispatchEvent('click');
        });
        await expect(page).toHaveURL(/\/products/, { timeout: 15000 });
        return;
    }

    await safeGoto(page, '/products', 30000);
    await expect(page).toHaveURL(/\/products/, { timeout: 15000 });
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
        await productsPage.addFirstProductToCart();
        await safeGoto(page, '/products');

        const addButtons = page
            .locator('.features_items .productinfo.text-center a')
            .filter({ hasText: 'Add to cart' });

        await addButtons.nth(1).click({ force: true });
        await waitForAddToCartFeedback(page);
        await safeGoto(page, '/view_cart');

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

        await productsPage.addFirstProductToCart();
        await continueShoppingToProducts(page);

        await productsPage.addFirstProductToCartAndOpenCart();
        await cartPage.verifyCartHasItems();
    });
});
