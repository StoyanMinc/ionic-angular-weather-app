import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences'
import axios from 'axios';
import { UtilityService } from './utility.service';
import { City, CityFromLocation, WeatherData } from './types';

@Injectable({
    providedIn: 'root',
})
export class WeatherService {
    private searchCitiesUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    private getWeatherUrl = 'https://api.open-meteo.com/v1/forecast';

    city = signal<City | CityFromLocation | null>(null)
    weather = signal<WeatherData | null>(null)

    constructor(private utilityService: UtilityService) { }

    setCity(city: City | CityFromLocation) {
        this.city.set(city)
    }

    async saveChosenCity(city: City | CityFromLocation) {
        await Preferences.set({
            key: 'choosen_city',
            value: JSON.stringify(city),
        })
    }

    async loadChosenCity() {
        const { value } = await Preferences.get({ key: 'choosen_city' })

        if (value) {
            const city = JSON.parse(value) as City | CityFromLocation
            await this.getWeather(city.longitude, city.latitude);
            this.setCity(city)
        }
    }

    async searchCities(city: string) {
        try {
            const response = await axios.get(this.searchCitiesUrl, {
                params: {
                    name: city,
                    language: 'en',
                    format: 'json'
                }
            });
            return response.data.results as City[] || [];

        } catch (err) {
            console.error('Error fetching cities', err);
            return [];
        }
    }

    async getWeather(longitude: number, latitude: number) {
        try {
            const response = await axios.get(this.getWeatherUrl, {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    current_weather: true,
                    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,precipitation_probability_max,sunrise,sunset',
                    hourly: 'temperature_2m,precipitation_probability,relativehumidity_2m,weathercode',
                    timezone: 'auto'
                }
            });
            const weatherData = this.utilityService.parseWeatherData(response.data);
            return this.weather.set(weatherData)
        } catch (err) {
            console.error('Error fetching weather', err);
            return null;
        }
    }
}
