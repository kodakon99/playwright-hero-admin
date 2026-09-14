

import { type Page } from '@playwright/test'

export class HeroLoginPage{

    constructor(private page:Page){}

    private email = () => this.page.getByRole('textbox', {name: 'Enter Admin Email'});
    private send_magic_link = () => this.page.getByRole('button', {name: 'Send Magic Link'});
    private magic_link_email = () => this.page.getByRole('link', {name: 'Admin to:'});
    private magic_link_url = () => this.page.locator('#preview-html').contentFrame().getByRole('link', { name: 'Log In' })

    async goto_admin(){
        await this.page.goto('http://localhost:8888/admin.html');
    }

    async goto_magic_link(){
        await this.page.goto('http://127.0.0.1:54324');
    }

    async login_process(email: string){
        await this.email().fill(email);
        await this.send_magic_link().click();
    }

    async magic_link_process(){
        await this.magic_link_email().click();
        const href = await this.magic_link_url().getAttribute('href');
        if (!href) throw new Error('magic link not found');
        await this.page.goto(href);
    }

}