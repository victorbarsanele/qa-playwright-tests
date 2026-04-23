import { Locator, Page, expect } from '@playwright/test';

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

    async goToProductsPage() {
        await this.page.goto('/products');
        await expect(this.page).toHaveURL(/\/products/);
        await expect(this.allProductsHeading).toBeVisible({ timeout: 15000 });
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
        await this.clickWithFallback(this.firstAddToCartButton);
        await expect(this.viewCartFromModalLink).toBeVisible({
            timeout: 15000,
        });
        await this.clickWithFallback(this.viewCartFromModalLink);

        try {
            await this.page.waitForURL(/\/view_cart|google_vignette/, {
                timeout: 15000,
            });
        } catch {
            await this.page.goto('/view_cart');
        }

        if (this.page.url().includes('google_vignette')) {
            await this.page.goto('/view_cart');
        }

        await expect(this.page).toHaveURL(/\/view_cart/);
    }
}
