import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from './weather.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    standalone: true,
    imports: [IonApp, IonRouterOutlet, HttpClientModule],
})
export class AppComponent {
    constructor(private weatherService: WeatherService) {
        this.weatherService.loadChosenCity();
    }
}
