import { Component } from '@angular/core';
import { CurrentWeatherComponent } from '../current-weather/current-weather.component';
import { HourlyForecastComponent } from '../hourly-forecast/hourly-forecast.component';
import { SevenDaysForecastComponent } from '../seven-days-forecast/seven-days-forecast.component';
import { HideMenuComponent } from '../hide-menu/hide-menu.component';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CurrentWeatherComponent,
    HourlyForecastComponent,
    SevenDaysForecastComponent,
    HideMenuComponent
  ]
})
export class HomePage {

  showHideMenu: boolean = false;

  constructor(public weatherService: WeatherService) { }

  toggleHideMenu() {
    this.showHideMenu = !this.showHideMenu;
  }
}
