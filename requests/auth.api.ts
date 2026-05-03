import { APIRequestContext, APIResponse } from '@playwright/test';
import { SignupUser } from '../utils/user-factory';

export type AuthApiMessageResponse = {
    responseCode: number;
    message: string;
};

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

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
        const status = response.status();
        const contentType = response.headers()['content-type'] ?? '';
        const body = await response.text();

        const trimmedBody = body.trim();

        try {
            // Some upstream responses return JSON payloads with a text/html header.
            // Parse by body content first and only fail if payload is not valid JSON.
            if (trimmedBody.startsWith('{') || trimmedBody.startsWith('[')) {
                return JSON.parse(trimmedBody) as T;
            }

            const snippet = trimmedBody
                .slice(0, 160)
                .replace(/\s+/g, ' ')
                .trim();
            throw new Error(
                `Expected JSON response but received content-type="${contentType}" (status=${status}). body="${snippet}"`,
            );
        } catch {
            const snippet = trimmedBody
                .slice(0, 160)
                .replace(/\s+/g, ' ')
                .trim();
            throw new Error(
                `Invalid JSON response (status=${status}). body="${snippet}"`,
            );
        }
    }
}

/** Convenience helper for test setup with strict response assertion. */
export async function createAccountViaApi(
    request: APIRequestContext,
    user: SignupUser,
): Promise<AuthApiMessageResponse> {
    const api = new AuthApi(request);

    let lastError: unknown;
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const result = await api.createAccount(user);

            if (result.responseCode === 201) {
                return result;
            }

            // If a prior attempt succeeded but response parsing/retry happened,
            // account may already exist and is still valid for login setup.
            if (
                result.responseCode === 400 &&
                /already\s*exist|already\s*exists|exists/i.test(result.message)
            ) {
                return {
                    responseCode: 201,
                    message: 'Account already exists (accepted for setup)',
                };
            }

            throw new Error(
                `Failed to create account. responseCode=${result.responseCode}, message=${result.message}`,
            );
        } catch (error) {
            lastError = error;
            if (attempt < maxAttempts) {
                await wait(500 * attempt);
                continue;
            }
        }
    }

    throw new Error(
        `Failed to create account after ${maxAttempts} attempts: ${String(lastError)}`,
    );
}
