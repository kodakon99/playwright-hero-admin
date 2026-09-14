
import { test as setup, expect } from '@playwright/test'

const API = 'http://127.0.0.1:54321';
const ANON = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

setup('authenticate as admin', async ({page, request}) => {
    const res = await request.post(`${API}/auth/v1/token?grant_type=password`, {
        headers: { apikey: ANON },
        data: { email: 'admin@example.invalid', password: 'testpassword123'},
    });
    expect(res.ok()).toBeTruthy();
    const session = await res.json();

    await page.goto('http://localhost:8888/admin.html');
    await page.evaluate(session => {
        localStorage.setItem('hero-admin-auth', JSON.stringify(session));
    }, session);

    await page.context().storageState({ path: 'playwright/.auth/admin.json'});

})