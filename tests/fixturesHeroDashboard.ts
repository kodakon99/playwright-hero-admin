

import { test as base } from '@playwright/test'
import { HeroDashboardPage } from '../pages/HeroDashboardPage'

type myFixtures = {
    dashboardHero: HeroDashboardPage;
}

export const test = base.extend<myFixtures>({
    dashboardHero: async ({page}, use) => {
        const dashboardPage = new HeroDashboardPage(page);
        await dashboardPage.goto_admin();
        await use(dashboardPage);
    }
})

export { expect } from '@playwright/test'