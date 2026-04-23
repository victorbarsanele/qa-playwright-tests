import { Locator, Page, expect } from '@playwright/test';

export class CheckoutPage {
    constructor(private page: Page) {}

    private async clickWithFallback(locator: Locator) {
        try {
            await locator.click({ timeout: 5000 });
        } catch {
            await locator.dispatchEvent('click');
        }
    }

    private get proceedToCheckoutButton() {
        return this.page.getByText('Proceed To Checkout').first();
    }

    private get deliveryAddressHeading() {
        return this.page.getByRole('heading', { name: /Address Details/i });
    }

    private get reviewOrderHeading() {
        return this.page.getByRole('heading', { name: /Review Your Order/i });
    }

    private get placeOrderButton() {
        return this.page.getByRole('link', { name: /Place Order/i }).first();
    }

    private get nameOnCardInput() {
        return this.page.locator('input[name="name_on_card"]');
    }

    private get cardNumberInput() {
        return this.page.locator('input[name="card_number"]');
    }

    private get cvcInput() {
        return this.page.locator('input[name="cvc"]');
    }

    private get expiryMonthInput() {
        return this.page.locator('input[name="expiry_month"]');
    }

    private get expiryYearInput() {
        return this.page.locator('input[name="expiry_year"]');
    }

    private get payAndConfirmButton() {
        return this.page.getByRole('button', {
            name: /Pay and Confirm Order/i,
        });
    }

    private get orderPlacedHeading() {
        return this.page.getByRole('heading', { name: /Order Placed!/i });
    }

    private get orderConfirmedMessage() {
        return this.page.getByText(
            /Congratulations! Your order has been confirmed!/i,
        );
    }

    private get emptyCartMessage() {
        return this.page.getByText(
            'Cart is empty! Click here to buy products.',
        );
    }

    async proceedToCheckoutFromCart() {
        await this.clickWithFallback(this.proceedToCheckoutButton);
        await this.page.waitForURL('**/checkout', { timeout: 15000 });
    }

    async verifyCheckoutPageSections() {
        await expect(this.deliveryAddressHeading).toBeVisible({
            timeout: 15000,
        });
        await expect(this.reviewOrderHeading).toBeVisible({ timeout: 15000 });
    }

    async verifyDeliveryAddressContains(text: string) {
        await expect(this.page.getByText(text).first()).toBeVisible({
            timeout: 15000,
        });
    }

    async placeOrderAndOpenPayment() {
        await this.placeOrderButton.click({ force: true });

        await this.page.waitForURL(/\/payment|\/checkout#google_vignette/, {
            timeout: 15000,
        });

        if (this.page.url().includes('google_vignette')) {
            await this.page.goto('/payment');
        }

        await expect(this.page).toHaveURL(/\/payment/);
    }

    async fillPaymentDetails(details: {
        nameOnCard: string;
        cardNumber: string;
        cvc: string;
        expiryMonth: string;
        expiryYear: string;
    }) {
        await this.nameOnCardInput.fill(details.nameOnCard);
        await this.cardNumberInput.fill(details.cardNumber);
        await this.cvcInput.fill(details.cvc);
        await this.expiryMonthInput.fill(details.expiryMonth);
        await this.expiryYearInput.fill(details.expiryYear);
    }

    async submitPayment() {
        await this.clickWithFallback(this.payAndConfirmButton);
    }

    async verifyOrderPlacedSuccessfully() {
        await expect(this.orderPlacedHeading).toBeVisible({ timeout: 20000 });
        await expect(this.orderConfirmedMessage).toBeVisible({
            timeout: 20000,
        });
    }

    async submitPaymentWithoutRequiredDetails() {
        await this.clickWithFallback(this.payAndConfirmButton);
    }

    async verifyPaymentFieldRequired(
        field:
            | 'nameOnCard'
            | 'cardNumber'
            | 'cvc'
            | 'expiryMonth'
            | 'expiryYear',
    ) {
        const locatorMap = {
            nameOnCard: this.nameOnCardInput,
            cardNumber: this.cardNumberInput,
            cvc: this.cvcInput,
            expiryMonth: this.expiryMonthInput,
            expiryYear: this.expiryYearInput,
        };
        const locator = locatorMap[field];

        const validationMessage = await locator.evaluate(
            (el: HTMLInputElement) => el.validationMessage,
        );
        expect(validationMessage.length).toBeGreaterThan(0);

        const validity = await locator.evaluate((el: HTMLInputElement) => ({
            valid: el.validity.valid,
            valueMissing: el.validity.valueMissing,
        }));
        expect(validity).toEqual({ valid: false, valueMissing: true });
    }

    async verifyEmptyCartState() {
        await expect(this.emptyCartMessage).toBeVisible({ timeout: 15000 });
    }
}
