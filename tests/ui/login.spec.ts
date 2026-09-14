
import { request } from '@playwright/test';
import {test, expect } from '../fixturesHeroLogin'


//testing UI

test('login 200', async ({emptyEmail, page}) => {
   await emptyEmail.login_process('admin@example.invalid');
   await expect(page.getByText('Check your email')).toBeVisible();
   await emptyEmail.goto_magic_link();
   await emptyEmail.magic_link_process();
   await expect(page.getByText('205', { exact: true })).toBeVisible();
})

test('empty email login to admin', async ({emptyEmail, page}) => {
    await emptyEmail.login_process('');
    await expect(page.getByText('Please enter')).toBeVisible();
})

test('ordinary user try to get magic link', async ({emptyEmail, page}) => {
    await emptyEmail.login_process('abc@email.com');
    await expect(page.getByText('Signups not allowed')).toBeVisible();
})

test('@auth admin dashboard loads with a saved session', async ({emptyEmail, page}) => {
    await expect (page.getByText('205', {exact: true})).toBeVisible();
})