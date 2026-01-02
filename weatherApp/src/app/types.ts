export interface City {
    admin1: string;
    admin1_id: number;
    admin2: string;
    admin2_id: number;
    country: string;
    country_code: string;
    country_id: number;
    elevation: number;
    feature_code: string;
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    population: number;
    postcodes: string[];
    timezone: string;
}

export interface WeatherData {
    current_weather: {
        interval: 900,
        is_day: number,
        temperature: number,
        time: string,
        weathercode: number,
        winddirection: number,
        windspeed: number,
        chanceOfRain: number,
        minTemp: number,
        maxTemp: number,
        weatherDescription: string,
        humidity: number,
    };
    current_weather_units: {
        interval: string,
        is_day: string,
        temperature: string,
        time: string,
        weathercode: string,
        winddirection: string,
        windspeed: string
    };
    daily: {
        precipitation_probability_max: number[],
        precipitation_sum: number[],
        temperature_2m_max: number[],
        temperature_2m_min: number[],
        time: string[],
        weathercode: number[],
        sunrise: string[],
        sunset: string[]
    };
    daily_units: {
        precipitation_probability_max: string,
        precipitation_sum: string,
        temperature_2m_max: string,
        temperature_2m_min: string,
        time: string,
        weathercode: string,
    };
    elevation: number;
    generationtime_ms: number;
    hourly: {
        precipitation_probability: number[],
        relativehumidity_2m: number[],
        temperature_2m: number[],
        time: string[],
        weathercode: number[]
    };
    hourly_units: {
        precipitation_probability: string,
        precipitation: string,
        temperature_2m: string,
        time: string
    };
    latitude: number;
    longitude: number;
    timezone: string;
    timezone_abbreviation: string;
    utc_offset_seconds: number;
    hourlyForecast: HourlyForecast[];
}

export interface CurrentWeather {
    interval: 900;
    is_day: number;
    temperature: number;
    time: string;
    weathercode: number;
    winddirection: number;
    windspeed: number;
    chanceOfRain: number;
    minTemp: number;
    maxTemp: number;
    weatherDescription: string;
    humidity: number;
}

export interface HourlyForecast {
    time: string;
    temperature: number;
    weatherCode: number;
    isDay: boolean;
}