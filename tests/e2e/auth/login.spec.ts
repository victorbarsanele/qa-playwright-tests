import { test } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { createRandomSignupUser } from '../../../utils/user-factory';
import { createAccountViaApi } from '../../../requests/auth.api';

test.describe('Auth - Login', () => {
    test('should login successfully with valid credentials', async ({
        page,
        request,
    }) => {
        const user = createRandomSignupUser();
        const loginPage = new LoginPage(page);

        // Create a fresh account via API to keep login tests fast and stable.
        await createAccountViaApi(request, user);

        await page.goto('/login');
        await loginPage.login(user.email, user.password);
        await loginPage.verifyLoginSuccess();
    });

    test('should fail to login with invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await page.goto('/login');
        await loginPage.login('invalid.user@example.com', 'invalidpassword');
        await loginPage.verifyLoginFailure();
    });

    test('should fail to login with wrong password for registered user', async ({
        page,
        request,
    }) => {
        const user = createRandomSignupUser();
        const loginPage = new LoginPage(page);

        await createAccountViaApi(request, user);

        await page.goto('/login');
        await loginPage.login(user.email, 'wrongpassword');
        await loginPage.verifyLoginFailure();
    });

    // ── Field validation ───────────────────────────────────────────────────────

    test('should block login when email is blank', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await page.goto('/login');
        await loginPage.verifyEmailRequired();
    });

    test('should block login when password is blank', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const user = createRandomSignupUser();
        await page.goto('/login');
        await loginPage.verifyPasswordRequired(user.email);
    });

    test('should block login when email format is invalid', async ({
        page,
    }) => {
        const loginPage = new LoginPage(page);
        await page.goto('/login');
        await loginPage.verifyEmailInvalid('invalid-email');
    });
});
