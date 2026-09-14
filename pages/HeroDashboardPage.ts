

import { type Page } from '@playwright/test'


export class HeroDashboardPage{


    constructor(private page: Page){}

    private change_status = () => this.page.locator('#bulkStatusSelect');
    private apply_status_button = () => this.page.getByRole('button', { name: 'Apply Status'});
    private add_ticket = () => this.page.getByRole('spinbutton', {name: 'Tickets'});
    private add_ticket_button = () => this.page.getByRole('button', {name:'Add Tickets'});
    private deselect_all_button = () => this.page.getByRole('button', {name: 'Deselect All'});
    private search_user = () => this.page.getByRole('textbox', {name: 'Search name, email, or'});
    private filter_status = () => this.page.locator('#filterStatus');
    private filter_describe = () => this.page.locator('#filterDescribe');
    private filter_country = () => this.page.locator('#filterCountry');
    private filter_chains = () => this.page.locator('#filterChains');
    private filter_excites = () => this.page.locator('#filterExcites');
    private filter_hear = () => this.page.locator('#filterHear');
    private filter_volume = () => this.page.locator('#filterVolume');
    private filter_badge = () => this.page.locator('#filterBadge');
    private filter_early_access = () => this.page.locator('#filterEarlyAccess');
    private filter_sort_select = () => this.page.locator('#sortSelect');
    private refresh_filter = () => this.page.getByRole('button', {name: 'Refresh'}).nth(2);
    private select_all = () => this.page.locator('#selectAll');
    private delete_user_button = () => this.page.getByRole('button', {name: 'Delete'});
    readonly user_name = (name: string) => this.page.getByRole('cell',{name});
    readonly ticketsfor = (name: string) => this.page.getByRole('row', {name}).getByRole('cell').nth(8);
    
    private row = (name: string) =>
        this.page.getByRole('row', { name });

    async selectUser(name: string){
        await this.row(name).getByRole('checkbox').check();
    }

    async goto_admin(){
        await this.page.goto('http://localhost:8888/admin.html');
    }

    async filter_name(name: string){
        await this.search_user().fill(name);
    }

    async status_change(status: string){
        await this.change_status().selectOption(status);
        await this.apply_status_button().click();
    }

    async status_filter(status: string){
        await this.filter_status().selectOption(status);
    }

    async describe_filter(describe: string){
        await this.filter_describe().selectOption(describe);
    }

    async country_filter(country: string){
        await this.filter_country().selectOption(country);
    }

    async chain_filter(chain: string){
        await this.filter_chains().selectOption(chain);
    }

    async interest_filter(excite: string){
        await this.filter_excites().selectOption(excite);
    }

    async sources_filter(sources: string){
        await this.filter_hear().selectOption(sources);
    }

    async volume_filter(volume: string){
        await this.filter_volume().selectOption(volume);
    }

    async badge_filter(badge: string){
        await this.filter_badge().selectOption(badge);
    }

    async early_access_filter(early_acces: string){
        await this.filter_early_access().selectOption(early_acces);
    }

    async sort_select_filter(sort_select: string){
        await this.filter_sort_select().selectOption(sort_select);
    }

    async add_ticket_user(tickets: string){
        await this.add_ticket().fill(tickets); 
        await this.add_ticket_button().click();
    }

    async delete_user(){
        this.page.on('dialog', dialog => dialog.accept());
        await this.delete_user_button().click();
    }

    async select_all_user(){
        this.select_all().click();
    }

    async refresh_page(){
        this.refresh_filter().click();
    }

}