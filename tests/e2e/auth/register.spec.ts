import { test } from '@playwright/test';
import { RegisterPage } from '../../../pages/register.page';
import { createAccountViaApi } from '../../../requests/auth.api';
import { createRandomSignupUser } from '../../../utils/user-factory';

test.describe('Auth - Register', () => {
    test.describe.configure({ mode: 'serial' });

    // should sign up successfully with valid data
    test('should register successfully with valid data', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        const user = createRandomSignupUser();

        await page.goto('/login');
        await registerPage.register(user);
        await registerPage.verifyRegisterSuccess();
    });

    test('should show native validation when password is blank', async ({
        page,
    }) => {
        const registerPage = new RegisterPage(page);
        const user = createRandomSignupUser();

        await page.goto('/login');
        // Navigate to the account info form via the first step
        await registerPage.navigateToAccountForm(user.name, user.email);
        // Leave password empty and click Create Account to trigger HTML5 validation
        await registerPage.submitWithoutPassword();
        await registerPage.verifyFieldRequired(registerPage.passwordInput);
    });

    test('should show native validation when name is blank', async ({
        page,
    }) => {
        const registerPage = new RegisterPage(page);
        const user = createRandomSignupUser();

        await page.goto('/login');
        // Navigate to the account info form via the first step
        await registerPage.navigateToAccountForm(user.name, user.email);
        // Clear the name field and click Create Account to trigger HTML5 validation
        await registerPage.clearNameAndVerifyRequired();
    });

    // ── Step 1 form validation ──────────────────────────────────────────────

    test('should block step 1 when name is blank', async ({ page }) => {
        const registerPage = new RegisterPage(page);

        await page.goto('/login');
        await registerPage.verifyRegisterStep1NameRequired();
    });

    test('should block step 1 when email is blank', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        const user = createRandomSignupUser();

        await page.goto('/login');
        await registerPage.verifyRegisterStep1EmailRequired(user.name);
    });

    test('should block step 1 when email format is invalid', async ({
        page,
    }) => {
        const registerPage = new RegisterPage(page);
        const user = createRandomSignupUser();

        await page.goto('/login');
        await registerPage.verifyRegisterStep1EmailInvalid(
            user.name,
            'invalid-email',
        );
    });

    // ── Step 2 required field validation ───────────────────────────────────

    test('should show native validation when first name is blank', async ({
        page,
    }) => {
        const registerPage = new RegisterPage(page);
        const user = createRandomSignupUser();

        await page.goto('/login');
        await registerPage.navigateToAccountForm(user.name, user.email);
        await registerPage.clearFirstNameAndVerifyRequired();
    });

    test('should show native validation when last name is blank', async ({
        page,
    }) => {
        const registerPage = new RegisterPage(page);
        const user = createRandomSignupUser();

        await page.goto('/login');
        await registerPage.navigateToAccountForm(user.name, user.email);
        await registerPage.clearLastNameAndVerifyRequired();
    });

    test('should show native validation when address is blank', async ({
        page,
    }) => {
        const registerPage = new RegisterPage(page);
        const user = createRandomSignupUser();

        await page.goto('/login');
        await registerPage.navigateToAccountForm(user.name, user.email);
        await registerPage.clearAddressAndVerifyRequired();
    });

    test('should show native validation when mobile number is blank', async ({
        page,
    }) => {
        const registerPage = new RegisterPage(page);
        const user = createRandomSignupUser();

        await page.goto('/login');
        await registerPage.navigateToAccountForm(user.name, user.email);
        await registerPage.clearMobileAndVerifyRequired();
    });

    // ── Duplicate email ─────────────────────────────────────────────────────

    test('should show error when email is already registered', async ({
        page,
        request,
    }) => {
        const registerPage = new RegisterPage(page);
        const user = createRandomSignupUser();

        await createAccountViaApi(request, user);
        await page.goto('/login');
        await registerPage.fillAndSubmitRegisterStep1(user.name, user.email);
        await registerPage.verifyDuplicateEmailError();
    });
});
