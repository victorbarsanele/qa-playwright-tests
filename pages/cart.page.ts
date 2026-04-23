import { Locator, Page, expect } from '@playwright/test';

export class CartPage {
    constructor(private page: Page) {}

    private async clickWithFallback(locator: Locator) {
        try {
            await locator.click({ timeout: 5000 });
        } catch {
            await locator.dispatchEvent('click');
        }
    }

    private get cartRows() {
        return this.page.locator('tr[id^="product-"]');
    }

    private get removeButtons() {
        return this.page.locator('a.cart_quantity_delete');
    }

    private get emptyCartMessage() {
        return this.page.getByText(
            'Cart is empty! Click here to buy products.',
        );
    }

    private get proceedToCheckoutButton() {
        return this.page.getByText('Proceed To Checkout');
    }

    async goToCartPage() {
        await this.page.goto('/view_cart');
    }

    async clearCartIfNeeded() {
        await this.goToCartPage();
        let count = await this.removeButtons.count();
        while (count > 0) {
            await this.clickWithFallback(this.removeButtons.first());
            await expect(this.cartRows).toHaveCount(count - 1, {
                timeout: 15000,
            });
            count = await this.removeButtons.count();
        }
    }

    async verifyCartHasItems() {
        await expect(this.cartRows.first()).toBeVisible({ timeout: 15000 });
        expect(await this.cartRows.count()).toBeGreaterThan(0);
    }

    async removeFirstItem() {
        const countBefore = await this.cartRows.count();
        await this.clickWithFallback(this.removeButtons.first());
        await expect(this.cartRows).toHaveCount(Math.max(countBefore - 1, 0), {
            timeout: 15000,
        });
    }

    async verifyEmptyCart() {
        await expect(this.emptyCartMessage).toBeVisible({ timeout: 15000 });
    }

    async verifyProceedToCheckoutVisible() {
        await expect(this.proceedToCheckoutButton).toBeVisible({
            timeout: 15000,
        });
    }
}
