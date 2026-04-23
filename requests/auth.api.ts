import { APIRequestContext, APIResponse } from '@playwright/test';
import { SignupUser } from '../utils/user-factory';

export type AuthApiMessageResponse = {
    responseCode: number;
    message: string;
};

/** Auth-focused API client for account lifecycle and credential verification. */
export class AuthApi {
    constructor(private request: APIRequestContext) {}

    async createAccount(user: SignupUser): Promise<AuthApiMessageResponse> {
        const response = await this.request.post('/api/createAccount', {
            form: {
                name: user.name,
                email: user.email,
                password: user.password,
                title: user.title,
                birth_date: user.birthDay,
                birth_month: user.birthMonth,
                birth_year: user.birthYear,
                firstname: user.firstName,
                lastname: user.lastName,
                company: '',
                address1: user.address,
                address2: '',
                country: user.country,
                zipcode: user.zipCode,
                state: user.state,
                city: user.city,
                mobile_number: user.mobileNumber,
            },
        });

        return this.readJson<AuthApiMessageResponse>(response);
    }

    async deleteAccount(
        email: string,
        password: string,
    ): Promise<AuthApiMessageResponse> {
        const response = await this.request.delete('/api/deleteAccount', {
            form: { email, password },
        });

        return this.readJson<AuthApiMessageResponse>(response);
    }

    async verifyLogin(
        email: string,
        password: string,
    ): Promise<AuthApiMessageResponse> {
        const response = await this.request.post('/api/verifyLogin', {
            form: { email, password },
        });

        return this.readJson<AuthApiMessageResponse>(response);
    }

    private async readJson<T>(response: APIResponse): Promise<T> {
        return (await response.json()) as T;
    }
}

/** Convenience helper for test setup with strict response assertion. */
export async function createAccountViaApi(
    request: APIRequestContext,
    user: SignupUser,
): Promise<AuthApiMessageResponse> {
    const api = new AuthApi(request);
    const result = await api.createAccount(user);

    if (result.responseCode !== 201) {
        throw new Error(
            `Failed to create account. responseCode=${result.responseCode}, message=${result.message}`,
        );
    }

    return result;
}
