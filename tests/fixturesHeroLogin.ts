
import { test as base } from '@playwright/test'
import { HeroLoginPage } from '../pages/HeroLoginPage'


type myFixtures = {
    emptyEmail: HeroLoginPage;
}

export const test = base.extend<myFixtures>({
    emptyEmail: async ({page}, use) => {
        const loginPage = new HeroLoginPage(page);
        await loginPage.goto_admin();
        await use(loginPage);
    }
})

export { expect } from '@playwright/test'