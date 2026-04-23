import { APIRequestContext, APIResponse } from '@playwright/test';
import { SignupUser } from '../utils/user-factory';

// AutomationExercise User API helper
// IMPORTANT: all requests use form data, NOT JSON
// Base URL: https://automationexercise.com/api

type ApiMessageResponse = {
    responseCode: number;
    message: string;
};

export class UserApi {
    constructor(private request: APIRequestContext) {}

    // GET /getUserDetailByEmail?email=...
    async getUserDetailByEmail(email: string): Promise<unknown> {
        const response = await this.request.get('/api/getUserDetailByEmail', {
            params: { email },
        });
        return this.readJson<unknown>(response);
    }

    // PUT /updateAccount with form data
    async updateAccount(user: SignupUser): Promise<ApiMessageResponse> {
        const response = await this.request.put('/api/updateAccount', {
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
        return this.readJson<ApiMessageResponse>(response);
    }

    private async readJson<T>(response: APIResponse): Promise<T> {
        return (await response.json()) as T;
    }
}
