import { Injectable } from '@angular/core';
import { WEATHER_ICON_MAP, weatherCodeMap } from './constants';
import { WeatherData } from './types';

@Injectable({
    providedIn: 'root',
})
export class UtilityService {

    getWeatherDescription(code: number) {
        return weatherCodeMap[code] || 'Unknown';
    }

    getDayString(date: string) {
        return new Date(date).toLocaleDateString('en-US', { weekday: 'short', })
    }

    getWeatherIcon(code: number, isDay: number) {
        let codesToCheck = [0, 1, 2, 51, 53, 55, 56, 57, 61, 63]
        let codeString = WEATHER_ICON_MAP[code];
        let iconPath = `assets/icon/${codeString}`;
        if (isDay === 0 && codesToCheck.includes(code)) {
            iconPath += '-night.svg';
        } else {
            iconPath += '.svg';
        }
        return iconPath;
    }

    isDayForHour(hourTime: string, sunrise: string, sunset: string): boolean {
        const t = new Date(hourTime).getTime()
        const sr = new Date(sunrise).getTime()
        const ss = new Date(sunset).getTime()
        return t >= sr && t < ss
    }

    parseWeatherData(weatherData: WeatherData) {
        const now = new Date(weatherData.current_weather.time);
        now.setMinutes(0, 0, 0)
        const hourlyTimes = weatherData.hourly.time;
        let index = hourlyTimes.findIndex(
            (t: string) => new Date(t).getTime() === now.getTime()
        );
        if(index === 0) {
            index = 1;
        }
        const chanceOfRain = weatherData.daily.precipitation_probability_max[0];
        const minTemp = weatherData.daily.temperature_2m_min[0];
        const maxTemp = weatherData.daily.temperature_2m_max[0];
        const weatherDescription = this.getWeatherDescription(weatherData.current_weather.weathercode);
        const humidity = weatherData.hourly.relativehumidity_2m[index];
        const hourlyForecast = weatherData.hourly.time.slice(index - 1, index + 24).map((time, index) => ({
            time,
            temperature: weatherData.hourly.temperature_2m[index],
            weatherCode: weatherData.hourly.weathercode[index],
            isDay: this.isDayForHour(
                time,
                weatherData.daily.sunrise[0],
                weatherData.daily.sunset[0]
            )
        }))
        weatherData.current_weather.chanceOfRain = chanceOfRain;
        weatherData.current_weather.minTemp = minTemp;
        weatherData.current_weather.maxTemp = maxTemp;
        weatherData.current_weather.weatherDescription = weatherDescription;
        weatherData.current_weather.humidity = humidity;
        weatherData.hourlyForecast = hourlyForecast;
        return weatherData;
    }



}
