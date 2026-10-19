

import { HeroDashboardPage } from '../../pages/HeroDashboardPage';
import { test, expect } from '../fixturesHeroDashboard'


test('@auth change waitlist status from pending to approved', async ({ dashboardHero, page }) => {
    await dashboardHero.filter_name('Test User 003');
    await dashboardHero.selectUser('Test User 003');
    await dashboardHero.status_change('Approved');
    await expect(page.getByRole('row', { name: 'Test User 003' }).getByText('Approved')).toBeVisible();
    await expect(page.getByText('Approved 43')).toBeVisible();
    await expect(page.getByText('Pending Review 141')).toBeVisible();
})

test('@auth change waitlist status from approved to pending', async ({ dashboardHero, page}) => {
    await dashboardHero.filter_name('Test User 003');
    await dashboardHero.selectUser('Test User 003');
    await dashboardHero.status_change('Pending Review');
    await expect(page.getByRole('row', { name: 'Test User 003' }).getByText('Pending Review')).toBeVisible();
    await expect(page.getByText('Approved 42')).toBeVisible();
    await expect(page.getByText('Pending Review 142')).toBeVisible();
})

test('@auth change multiple user waitlist status from pending to approved', async ({ dashboardHero, page}) => {
    await dashboardHero.status_filter('Pending Review');
    for (const n of ['003','004','005']){
        await dashboardHero.filter_name(`Test User ${n}`);
        await dashboardHero.selectUser(`Test User ${n}`);
    }
    await dashboardHero.status_change('Approved');
    await expect(page.getByText('Approved 45')).toBeVisible();
    await expect(page.getByText('Pending Review 139')).toBeVisible();
})

test('@auth change multiple user waitlist status from approved to pending', async ({ dashboardHero, page}) => {
    await dashboardHero.status_filter('Approved');
    for (const n of ['003','004','005']){
        await dashboardHero.filter_name(`Test User ${n}`);
        await expect(dashboardHero.user_name(`Test User ${n}`)).toBeVisible();
        await dashboardHero.selectUser(`Test User ${n}`);
    }
    await dashboardHero.status_change('Pending Review');
    await expect(page.getByText('Approved 42')).toBeVisible();
    await expect(page.getByText('Pending Review 142')).toBeVisible();
})

test('@auth change user waitlist status to rejected', async ({ dashboardHero, page }) => {
    await dashboardHero.status_filter('Approved');
    await dashboardHero.filter_name('Test User 030');
    await expect(dashboardHero.user_name('Test User 030')).toBeVisible();
    await dashboardHero.selectUser('Test User 030');
    await dashboardHero.status_change('Rejected');
    await expect(page.getByText('Rejected 22')).toBeVisible();
})

test('@auth change multiple user waitlist status to rejected', async ({ dashboardHero, page}) => {
    await dashboardHero.status_filter('Pending Review');
    await dashboardHero.describe_filter('Casual Trader');
    await dashboardHero.chain_filter('Hyperliquid');
    await dashboardHero.badge_filter('Navigator');
    for ( const n of ['076','196']){
        await dashboardHero.selectUser(`Test User ${n}`);
    }
    await dashboardHero.status_change('Rejected');
    await expect(page.getByText('Rejected 24')).toBeVisible();
})

test('@auth add ticket to 1 user', async ({dashboardHero, page}) => {
    await dashboardHero.country_filter('CA');
    await dashboardHero.chain_filter('Solana');

    const cell = dashboardHero.ticketsfor('Test User 126');
    await expect(cell).toBeVisible();
    const before = Number(await cell.textContent());

    await dashboardHero.selectUser('Test User 126');
    await dashboardHero.add_ticket_user('10');
    await expect(cell).toHaveText(String(before+10));
})

test('@auth add ticket to multiple user', async ({ dashboardHero, page}) => {
    await dashboardHero.sources_filter('Discord');
    await dashboardHero.volume_filter('$1k-10k');

    const names = ['021','093','165','057'].map(n => `Test User ${n}`);
    const before = new Map<string, number>();
    
    for ( const name of names ){
        const cell = dashboardHero.ticketsfor(name);
        await expect(cell).toBeVisible();
        const text = (await cell.textContent()) ?? '';
        before.set(name, Number(text.replace(/,/g, '')));
    }

    await dashboardHero.select_all_user();
    await dashboardHero.add_ticket_user('15');

    for ( const name of names ){
        const cell = dashboardHero.ticketsfor(name);
        await expect.poll(async () => {
            const t = (await cell.textContent()) ?? '';
            return Number(t.replace(/,/g, ''));
        }).toBe(before.get(name)! + 15);
    }
})
