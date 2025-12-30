import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CurrentWeatherComponent } from '../current-weather/current-weather.component';
import { HourlyForecastComponent } from '../hourly-forecast/hourly-forecast.component';
import { SevenDaysForecastComponent } from '../seven-days-forecast/seven-days-forecast.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CurrentWeatherComponent, HourlyForecastComponent, SevenDaysForecastComponent],
})
export class HomePage {
  constructor() { }
}
