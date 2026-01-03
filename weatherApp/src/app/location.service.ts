// src/app/location.service.ts
import { Injectable } from '@angular/core'
import { Geolocation } from '@capacitor/geolocation'
import axios from 'axios'
import { CityFromLocation } from './types';

@Injectable({ providedIn: 'root' })
export class LocationService {

    // private reverseGeocodeUrl = 'https://geocoding-api.open-meteo.com/v1/reverse';
    private reverseGeocodeUrl = 'https://nominatim.openstreetmap.org/reverse';

    async getCurrentPosition() {
        const permission = await Geolocation.requestPermissions()

        if (permission.location !== 'granted') {
            throw new Error('Location permission denied')
        }
        return Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000, 
        })
    }

    async loadWeatherFromDeviceLocation() {
        try {
            const position = await this.getCurrentPosition()

            const lat = position.coords.latitude
            const lon = position.coords.longitude

            const city = await this.getCityFromCoords(lat, lon)

            if (!city) return
            return city
        } catch (err) {
            console.error('Location error', err);
            return null;
        }
    }

    async getCityFromCoords(lat: number, lon: number) {
        console.log({ lat, lon });
        const response = await axios.get(this.reverseGeocodeUrl, {
            params: {
                lat: lat,
                lon: lon,
                // language: 'en',
                format: 'json',
                zoom: 10,
                addressdetails: 1
            },
        })
        console.log({ response });
        const cityName = this.getCityFromNominatim(response.data.address);

        const city: CityFromLocation = {
            name: cityName ?? 'Unknown',
            country: response.data.address.country,
            country_code: response.data.address.country_code.toUpperCase(),
            latitude: Number(response.data.lat),
            longitude: Number(response.data.lon),
        };
        console.log('test1', { city });
        return city || null;
    }

    getCityFromNominatim(address: any): string | null {
        return (
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.state_district ||
            address.county ||
            null
        );
    }
}
