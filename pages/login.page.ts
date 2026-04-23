import { Page, expect } from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) {}

    private get emailInput() {
        return this.page.getByTestId('login-email');
    }

    private get passwordInput() {
        return this.page.getByTestId('login-password');
    }

    private get loginButton() {
        return this.page.getByTestId('login-button');
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyLoginSuccess() {
        await expect(
            this.page.getByRole('link', { name: 'Logout' }),
        ).toBeVisible();
    }

    async verifyLoginFailure() {
        await expect(
            this.page.getByText(/your email or password is incorrect/i),
        ).toBeVisible({ timeout: 10000 });
    }

    private async verifyFieldRequired(locator: ReturnType<Page['locator']>) {
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

    /** Clicks Login with blank email and verifies the email field is required. */
    async verifyEmailRequired() {
        await this.loginButton.click();
        await this.verifyFieldRequired(this.emailInput);
    }

    /** Fills email, leaves password blank, clicks Login, and verifies password is required. */
    async verifyPasswordRequired(email: string) {
        await this.emailInput.fill(email);
        await this.loginButton.click();
        await this.verifyFieldRequired(this.passwordInput);
    }

    /** Fills an invalid email format, clicks Login, and verifies typeMismatch. */
    async verifyEmailInvalid(email: string) {
        await this.emailInput.fill(email);
        await this.loginButton.click();
        const validationMessage = await this.emailInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage,
        );
        expect(validationMessage.length).toBeGreaterThan(0);
        const validity = await this.emailInput.evaluate(
            (el: HTMLInputElement) => ({
                valid: el.validity.valid,
                typeMismatch: el.validity.typeMismatch,
            }),
        );
        expect(validity).toEqual({ valid: false, typeMismatch: true });
    }
}
