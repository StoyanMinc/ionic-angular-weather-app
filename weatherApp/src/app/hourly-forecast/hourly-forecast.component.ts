import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-hourly-forecast',
  templateUrl: './hourly-forecast.component.html',
  styleUrls: ['./hourly-forecast.component.scss'],
  standalone: true,
})
export class HourlyForecastComponent  implements OnInit {

  constructor(public weatherService: WeatherService, public utilityService: UtilityService) { }

  ngOnInit() {}

}
