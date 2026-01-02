import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WeatherService } from '../weather.service';
import { City, CurrentWeather, WeatherData } from '../types';
import { Observable } from 'rxjs';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  standalone: true,
})
export class CurrentWeatherComponent {

  @Output() toggleHideMenu = new EventEmitter<void>();

  city = this.weatherService.city
  weatherData = this.weatherService.weather
  currentDate: string = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  constructor(private weatherService: WeatherService, public utilityService: UtilityService) {  }

}
