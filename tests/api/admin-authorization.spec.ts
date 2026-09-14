

import { request } from '@playwright/test';
import {test, expect } from '../fixturesHeroLogin';


const API = 'http://127.0.0.1:54321';
const ANON = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

async function tokenFor(request, email:string){
    const res = await request.post(`${API}/auth/v1/token?grant_type=password`, {
        headers: { apikey: ANON },
        data: { email, password: 'testpassword123'},
    });
    expect(res.ok()).toBeTruthy();
    return (await res.json()).access_token;
}

test('returns 200 and the full user list for an admin', async ({request}) => {
    const token = await tokenFor(request, 'admin@example.invalid');

    const res = await request.get(`${API}/functions/v1/admin-users`, {
        headers: { apikey: ANON, Authorization: `Bearer ${token}`},
    })

    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.users.length).toBe(205);
})

test('returns 401 when no credentials are provided', async ({request}) => {
    const res = await request.get(`${API}/functions/v1/admin-users`);
    expect(res.status()).toBe(401);
})

test('returns 403 for an authenticated non-admin user', async ({request}) => {
    const token = await tokenFor(request, 'auth.user.001@example.invalid');

    const res = await request.get(`${API}/functions/v1/admin-users`, {
        headers: { apikey: ANON, Authorization: `Bearer ${token}` },
    })

    expect(res.status()).toBe(403);
    expect(res.ok()).toBeFalsy();
})

