import { Locator, Page, expect } from '@playwright/test';
import { safeGoto, recoverFromVignette } from '../utils/navigation';

export class ProductsPage {
    constructor(private page: Page) {}

    private async clickWithFallback(locator: Locator) {
        try {
            await locator.click({ timeout: 5000 });
        } catch {
            await locator.dispatchEvent('click');
        }
    }

    private get productsNavLink() {
        return this.page.getByRole('link', { name: /Products/i });
    }

    private get allProductsHeading() {
        return this.page.getByRole('heading', { name: /All Products/i });
    }

    private get searchedProductsHeading() {
        return this.page.getByRole('heading', { name: 'Searched Products' });
    }

    private get searchInput() {
        return this.page.locator('#search_product');
    }

    private get searchButton() {
        return this.page.locator('#submit_search');
    }

    private get productCards() {
        return this.page.locator('.features_items .col-sm-4');
    }

    private get firstViewProductLink() {
        return this.page.locator('a[href*="/product_details/"]').first();
    }

    private get firstAddToCartButton() {
        return this.page
            .locator('.features_items .productinfo.text-center a')
            .filter({ hasText: 'Add to cart' })
            .first();
    }

    private get viewCartFromModalLink() {
        return this.page.getByRole('link', { name: /View Cart/i }).first();
    }

    private get continueShoppingButton() {
        return this.page.getByRole('button', { name: /Continue Shopping/i });
    }

    private get cartRows() {
        return this.page.locator('tr[id^="product-"]');
    }

    private async waitForAddToCartFeedback() {
        await Promise.race([
            this.viewCartFromModalLink.waitFor({
                state: 'visible',
                timeout: 6000,
            }),
            this.continueShoppingButton.waitFor({
                state: 'visible',
                timeout: 6000,
            }),
            this.page.waitForTimeout(6000),
        ]).catch(() => {
            // Modal feedback can be flaky in Firefox CI; fallback is direct cart navigation.
        });
    }

    private async waitForProductsReady(timeout = 15000) {
        await Promise.race([
            this.allProductsHeading.waitFor({ state: 'visible', timeout }),
            this.productCards.first().waitFor({ state: 'visible', timeout }),
        ]);
    }

    async addFirstProductToCart() {
        await expect(this.firstAddToCartButton).toBeVisible({ timeout: 15000 });

        await this.clickWithFallback(this.firstAddToCartButton);
        await this.waitForAddToCartFeedback();

        await safeGoto(this.page, '/view_cart', 20000);
        if (this.page.url().includes('google_vignette')) {
            await recoverFromVignette(this.page, '/view_cart');
        }

        const itemsAfterFirstTry = await this.cartRows.count();
        if (itemsAfterFirstTry > 0) {
            return;
        }

        // Firefox CI occasionally misses the first add-to-cart interaction;
        // retry once from /products before failing.
        await safeGoto(this.page, '/products', 20000);
        if (this.page.url().includes('google_vignette')) {
            await recoverFromVignette(this.page, '/products');
        }

        await expect(this.allProductsHeading).toBeVisible({ timeout: 15000 });
        await this.clickWithFallback(this.firstAddToCartButton);
        await this.waitForAddToCartFeedback();
        await safeGoto(this.page, '/view_cart', 20000);

        if (this.page.url().includes('google_vignette')) {
            await recoverFromVignette(this.page, '/view_cart');
        }
    }

    async goToProductsPage() {
        for (let attempt = 0; attempt < 2; attempt++) {
            await safeGoto(this.page, '/products', 30000);
            if (this.page.url().includes('google_vignette')) {
                await recoverFromVignette(this.page, '/products', 30000);
            }

            await this.page.waitForURL(/\/products/, { timeout: 30000 });
            await expect(this.page).toHaveURL(/\/products/);

            try {
                await this.waitForProductsReady(15000);
                return;
            } catch {
                if (attempt === 1) {
                    throw new Error(
                        'Products page did not render expected content in time',
                    );
                }
            }
        }
    }

    async verifyProductsListVisible() {
        await expect(this.allProductsHeading).toBeVisible({ timeout: 15000 });
        await expect(this.productCards.first()).toBeVisible({ timeout: 15000 });
        expect(await this.productCards.count()).toBeGreaterThan(0);
    }

    async openFirstProductDetails() {
        const href = await this.firstViewProductLink.getAttribute('href');

        try {
            await Promise.all([
                this.page.waitForURL('**/product_details/**', {
                    timeout: 15000,
                }),
                this.firstViewProductLink.click({ force: true }),
            ]);
        } catch {
            if (!href) {
                throw new Error(
                    'Could not navigate to product details: href missing',
                );
            }
            await this.page.goto(href.startsWith('/') ? href : `/${href}`);
            await this.page.waitForURL('**/product_details/**', {
                timeout: 15000,
            });
        }
    }

    async verifyProductDetailsPageVisible() {
        await expect(this.page).toHaveURL(/\/product_details\//);
        await expect(this.page.getByText('Write Your Review')).toBeVisible({
            timeout: 15000,
        });
    }

    async searchProduct(keyword: string) {
        await this.searchInput.fill(keyword);
        await this.clickWithFallback(this.searchButton);
        await expect(this.searchedProductsHeading).toBeVisible({
            timeout: 15000,
        });
    }

    async verifySearchResultContains(text: string) {
        await expect(this.page.getByText(text).first()).toBeVisible({
            timeout: 15000,
        });
    }

    async addFirstProductToCartAndOpenCart() {
        await this.addFirstProductToCart();

        await expect(this.page).toHaveURL(/\/view_cart/);
        await expect(this.cartRows.first()).toBeVisible({ timeout: 15000 });
    }
}
