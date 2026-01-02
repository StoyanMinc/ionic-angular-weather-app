// src/app/location.service.ts
import { Injectable } from '@angular/core'
import { Geolocation } from '@capacitor/geolocation'
import axios from 'axios'

@Injectable({ providedIn: 'root' })
export class LocationService {

    private reverseGeocodeUrl = 'https://geocoding-api.open-meteo.com/v1/reverse';

    async getCurrentPosition() {
        const permission = await Geolocation.requestPermissions()

        if (permission.location !== 'granted') {
            throw new Error('Location permission denied')
        }
        return Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
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
            console.error('Location error', err)
        }
    }

    async getCityFromCoords(lat: number, lon: number) {
        const response = await axios.get(this.reverseGeocodeUrl, {
            params: {
                latitude: lat,
                longitude: lon,
                language: 'en',
            },
        })
        return response.data.results?.[0] ?? null
    }
}
