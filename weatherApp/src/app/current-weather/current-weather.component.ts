import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonContent],
})
export class CurrentWeatherComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
