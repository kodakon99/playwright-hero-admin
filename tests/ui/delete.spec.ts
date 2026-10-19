import { test, expect } from '../fixturesHeroDashboard'

// Deletes are permanent, so these run in the `chromium-destructive` project,
// after every test that asserts the seeded user count (205).

test('@auth delete 1 user', async ({ dashboardHero, page}) => {
    await dashboardHero.badge_filter('Explorer');
    await dashboardHero.early_access_filter('Beta');
    await dashboardHero.selectUser('Test User 145');
    await dashboardHero.delete_user();
    await expect(dashboardHero.user_name('Test User 145')).not.toBeVisible();
})

test('@auth delete multiple user', async ({ dashboardHero, page }) => {
    await dashboardHero.status_filter('Rejected');
    await dashboardHero.interest_filter('AI Insights');
    for ( const n of ['142','182']){
        await dashboardHero.selectUser(`Test user ${n}`);
    }
    await dashboardHero.delete_user();
    for ( const n of ['142','182']){
        await expect(dashboardHero.user_name(`Test User ${n}`)).not.toBeVisible();
    }
})