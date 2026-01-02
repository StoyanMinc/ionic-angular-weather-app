import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WeatherService } from '../weather.service';
import { FormsModule } from '@angular/forms';
import { City } from '../types';

@Component({
    selector: 'app-hide-menu',
    templateUrl: './hide-menu.component.html',
    styleUrls: ['./hide-menu.component.scss'],
    standalone: true,
    imports: [FormsModule],
})
export class HideMenuComponent {

    @Input() showHideMenu: boolean = false;
    @Output() toggleHideMenu = new EventEmitter<void>();

    searchTimeout: any;
    cities: any[] = [];
    searchingCity: string = '';
    noFound: boolean = false;

    constructor(private weatherService: WeatherService) { }

    hideMenu() {
        this.toggleHideMenu.emit();
        this.noFound = false;
        this.cities = [];
        this.searchingCity = '';
    }

    async searchCity(event: any) {
        this.searchingCity = event.target.value as string;
        this.noFound = false;
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(async () => {
            const results = await this.weatherService.searchCities(this.searchingCity);
            this.cities = results;
            if (!results.length) {
                this.noFound = true;
            }
        }, 300);
    }

    async selectCity(city: City) {
        this.weatherService.setCity(city)
        await this.weatherService.getWeather(city.longitude, city.latitude)
        await this.weatherService.saveChosenCity(city)
        this.cities = [];
        this.searchingCity = '';
        this.hideMenu()
    }

}
