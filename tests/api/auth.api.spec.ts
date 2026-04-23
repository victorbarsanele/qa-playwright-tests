import { expect, test } from '@playwright/test';
import { AuthApi } from '../../requests/auth.api';
import { UserApi } from '../../requests/user.api';
import { createRandomSignupUser } from '../../utils/user-factory';

test.describe('API - Auth', () => {
    test('should create, verify login, and delete account', async ({
        request,
    }) => {
        const user = createRandomSignupUser();
        const authApi = new AuthApi(request);

        const createResult = await authApi.createAccount(user);
        expect(createResult.responseCode).toBe(201);

        const verifyResult = await authApi.verifyLogin(
            user.email,
            user.password,
        );
        expect(verifyResult.responseCode).toBe(200);

        const deleteResult = await authApi.deleteAccount(
            user.email,
            user.password,
        );
        expect(deleteResult.responseCode).toBe(200);
    });

    test('should reject login with invalid password', async ({ request }) => {
        const user = createRandomSignupUser();
        const authApi = new AuthApi(request);

        const createResult = await authApi.createAccount(user);
        expect(createResult.responseCode).toBe(201);

        const invalidVerifyResult = await authApi.verifyLogin(
            user.email,
            'definitely-wrong-password',
        );
        expect(invalidVerifyResult.responseCode).not.toBe(200);

        const deleteResult = await authApi.deleteAccount(
            user.email,
            user.password,
        );
        expect(deleteResult.responseCode).toBe(200);
    });

    test('API-AUTH-003 should update account successfully', async ({
        request,
    }) => {
        const user = createRandomSignupUser();
        const authApi = new AuthApi(request);
        const userApi = new UserApi(request);

        const createResult = await authApi.createAccount(user);
        expect(createResult.responseCode).toBe(201);

        user.firstName = `${user.firstName}Updated`;
        user.city = `${user.city} Updated`;

        const updateResult = await userApi.updateAccount(user);
        expect(updateResult.responseCode).toBe(200);

        const deleteResult = await authApi.deleteAccount(
            user.email,
            user.password,
        );
        expect(deleteResult.responseCode).toBe(200);
    });

    test('API-AUTH-004 should return user detail by email', async ({
        request,
    }) => {
        const user = createRandomSignupUser();
        const authApi = new AuthApi(request);
        const userApi = new UserApi(request);

        const createResult = await authApi.createAccount(user);
        expect(createResult.responseCode).toBe(201);

        const userDetail = (await userApi.getUserDetailByEmail(user.email)) as {
            responseCode?: number;
            user?: { email?: string };
        };

        expect(userDetail.responseCode).toBe(200);
        expect(userDetail.user?.email?.toLowerCase()).toBe(
            user.email.toLowerCase(),
        );

        const deleteResult = await authApi.deleteAccount(
            user.email,
            user.password,
        );
        expect(deleteResult.responseCode).toBe(200);
    });

    test('API-AUTH-005 should verify login with valid credentials', async ({
        request,
    }) => {
        const user = createRandomSignupUser();
        const authApi = new AuthApi(request);

        const createResult = await authApi.createAccount(user);
        expect(createResult.responseCode).toBe(201);

        const verifyResult = await authApi.verifyLogin(
            user.email,
            user.password,
        );
        expect(verifyResult.responseCode).toBe(200);

        const deleteResult = await authApi.deleteAccount(
            user.email,
            user.password,
        );
        expect(deleteResult.responseCode).toBe(200);
    });

    test('API-AUTH-006 should reject verify login with invalid credentials', async ({
        request,
    }) => {
        const authApi = new AuthApi(request);

        const verifyResult = await authApi.verifyLogin(
            'not-registered@example.com',
            'wrong-password',
        );
        expect(verifyResult.responseCode).not.toBe(200);
    });

    test('API-AUTH-007 should reject DELETE method on /verifyLogin endpoint', async ({
        request,
    }) => {
        const response = await request.delete('/api/verifyLogin');
        const result = (await response.json()) as {
            responseCode: number;
            message?: string;
        };

        expect(result.responseCode).toBe(405);
        expect(result.message ?? '').toMatch(/not supported/i);
    });
});
