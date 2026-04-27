import { Locator, Page, expect } from '@playwright/test';
import { recoverFromVignette } from '../utils/navigation';

export class RegisterPage {
    constructor(private page: Page) {}

    private async clickWithFallback(locator: Locator) {
        try {
            await locator.click({ timeout: 5000 });
        } catch {
            await locator.dispatchEvent('click');
        }
    }

    private async checkWithFallback(locator: Locator) {
        try {
            await locator.check({ timeout: 5000 });
        } catch {
            await locator.setChecked(true, { force: true });
        }
    }

    private async fillWithFallback(locator: Locator, value: string) {
        try {
            await locator.fill(value, { timeout: 5000 });
        } catch {
            await locator.evaluate((el: HTMLInputElement, v: string) => {
                el.value = v;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }, value);
        }
    }

    // First page: initial register form
    private get nameInput() {
        return this.page.getByTestId('signup-name');
    }

    private get emailInput() {
        return this.page.getByTestId('signup-email');
    }

    private get registerButton() {
        return this.page.getByTestId('signup-button');
    }

    private get accountInformationHeading() {
        return this.page.getByRole('heading', {
            name: 'Enter Account Information',
        });
    }

    // Second page: account info form
    private titleRadio(value: 'Mr' | 'Mrs') {
        return this.page.getByRole('radio', { name: `${value}.` });
    }

    get passwordInput() {
        return this.page.getByTestId('password');
    }

    private get accountNameInput() {
        return this.page.getByTestId('name');
    }

    private get birthDaySelect() {
        return this.page.getByTestId('days');
    }

    private get birthMonthSelect() {
        return this.page.getByTestId('months');
    }

    private get birthYearSelect() {
        return this.page.getByTestId('years');
    }

    private get firstNameInput() {
        return this.page.getByTestId('first_name');
    }

    private get lastNameInput() {
        return this.page.getByTestId('last_name');
    }

    private get addressInput() {
        return this.page.getByTestId('address');
    }

    private get countrySelect() {
        return this.page.getByTestId('country');
    }

    private get stateInput() {
        return this.page.getByTestId('state');
    }

    private get cityInput() {
        return this.page.getByTestId('city');
    }

    private get zipCodeInput() {
        return this.page.getByTestId('zipcode');
    }

    private get mobileNumberInput() {
        return this.page.getByTestId('mobile_number');
    }

    private get createAccountButton() {
        return this.page.getByTestId('create-account');
    }

    /** Completes step 1 only — lands on the account info form. */
    async navigateToAccountForm(name: string, email: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        // Promise.all ensures the URL-change listener is registered before the
        // click fires, so we never miss the navigation event in Firefox.
        await Promise.all([
            this.page.waitForURL(/signup|google_vignette/, { timeout: 15000 }),
            this.clickWithFallback(this.registerButton),
        ]);
        if (this.page.url().includes('google_vignette')) {
            // The form was already submitted; recover to /signup where the
            // server would have redirected after processing the registration.
            await recoverFromVignette(this.page, '/signup');
        }
        await expect(this.accountInformationHeading).toBeVisible({
            timeout: 15000,
        });
    }

    /** Clicks Create Account without filling password to trigger HTML5 validation. */
    async submitWithoutPassword() {
        await this.clickWithFallback(this.createAccountButton);
    }

    // ── Step 1 form validation ────────────────────────────────────────────────

    /** Fills step 1 (name + email) and clicks Signup without waiting for step 2 navigation. */
    async fillAndSubmitRegisterStep1(name: string, email: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.clickWithFallback(this.registerButton);
    }

    /** Clicks Signup with blank name and verifies the name field is required. */
    async verifyRegisterStep1NameRequired() {
        await this.clickWithFallback(this.registerButton);
        await this.verifyFieldRequired(this.nameInput);
    }

    /** Fills name only, clicks Signup, and verifies the email field is required. */
    async verifyRegisterStep1EmailRequired(name: string) {
        await this.nameInput.fill(name);
        await this.clickWithFallback(this.registerButton);
        await this.verifyFieldRequired(this.emailInput);
    }

    /** Fills step 1 with an invalid email format and verifies typeMismatch. */
    async verifyRegisterStep1EmailInvalid(name: string, email: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.clickWithFallback(this.registerButton);
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

    // ── Step 2 required field validation ─────────────────────────────────────

    /** Clears the name field (step 2), submits, and verifies it is required. */
    async clearNameAndVerifyRequired() {
        await this.accountNameInput.fill('');
        await this.submitWithoutPassword();
        await this.verifyFieldRequired(this.accountNameInput);
    }

    /** Clears first name, submits step 2, and verifies field is required. */
    async clearFirstNameAndVerifyRequired() {
        await this.firstNameInput.fill('');
        await this.submitWithoutPassword();
        await this.verifyFieldRequired(this.firstNameInput);
    }

    /** Clears last name, submits step 2, and verifies field is required. */
    async clearLastNameAndVerifyRequired() {
        await this.lastNameInput.fill('');
        await this.submitWithoutPassword();
        await this.verifyFieldRequired(this.lastNameInput);
    }

    /** Clears address, submits step 2, and verifies field is required. */
    async clearAddressAndVerifyRequired() {
        await this.addressInput.fill('');
        await this.submitWithoutPassword();
        await this.verifyFieldRequired(this.addressInput);
    }

    /** Clears mobile number, submits step 2, and verifies field is required. */
    async clearMobileAndVerifyRequired() {
        await this.mobileNumberInput.fill('');
        await this.submitWithoutPassword();
        await this.verifyFieldRequired(this.mobileNumberInput);
    }

    // ── Duplicate email ───────────────────────────────────────────────────────

    /** Verifies the duplicate-email error message is visible after step 1 submission. */
    async verifyDuplicateEmailError() {
        await expect(
            this.page.getByText('Email Address already exist!'),
        ).toBeVisible({ timeout: 10000 });
    }

    async register(userData: {
        name: string;
        email: string;
        title: 'Mr' | 'Mrs';
        password: string;
        birthDay: string;
        birthMonth: string;
        birthYear: string;
        firstName: string;
        lastName: string;
        address: string;
        country: string;
        state: string;
        city: string;
        zipCode: string;
        mobileNumber: string;
    }) {
        await this.nameInput.fill(userData.name);
        await this.emailInput.fill(userData.email);
        await this.clickWithFallback(this.registerButton);
        await expect(this.accountInformationHeading).toBeVisible({
            timeout: 15000,
        });
        await this.checkWithFallback(this.titleRadio(userData.title));
        await this.passwordInput.fill(userData.password);
        await this.birthDaySelect.selectOption(userData.birthDay);
        await this.birthMonthSelect.selectOption(userData.birthMonth);
        await this.birthYearSelect.selectOption(userData.birthYear);
        await this.firstNameInput.fill(userData.firstName);
        await this.lastNameInput.fill(userData.lastName);
        await this.addressInput.fill(userData.address);
        await this.countrySelect.selectOption(userData.country);
        await this.fillWithFallback(this.stateInput, userData.state);
        await this.fillWithFallback(this.cityInput, userData.city);
        await this.fillWithFallback(this.zipCodeInput, userData.zipCode);
        await this.fillWithFallback(
            this.mobileNumberInput,
            userData.mobileNumber,
        );
        await Promise.all([
            this.page.waitForURL('**/account_created', { timeout: 20000 }),
            this.clickWithFallback(this.createAccountButton),
        ]);
    }

    /**
     * Asserts that a required field is blocking submission via HTML5 native validation.
     * The browser tooltip ("preencha este campo") is not in the DOM so it cannot be
     * queried with a locator — use this method instead.
     *
     * @param locator - any Locator pointing to the input to verify
     */
    async verifyFieldRequired(locator: ReturnType<Page['locator']>) {
        const validationMessage = await locator.evaluate(
            (el: HTMLInputElement) => el.validationMessage,
        );
        expect(validationMessage.length).toBeGreaterThan(0);

        // Extract only the properties you need to avoid object comparison issues
        const validity = await locator.evaluate((el: HTMLInputElement) => ({
            valid: el.validity.valid,
            valueMissing: el.validity.valueMissing,
        }));
        expect(validity).toEqual({
            valid: false,
            valueMissing: true,
        });
    }

    async verifyRegisterSuccess() {
        await expect(
            this.page.getByRole('heading', { name: 'Account Created!' }),
        ).toBeVisible({ timeout: 20000 });
    }
}
