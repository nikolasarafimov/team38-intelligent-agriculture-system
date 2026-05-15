package mk.ukim.team38.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> getWeatherForecast(Double latitude, Double longitude) {
        if (latitude == null || longitude == null) {
            throw new IllegalArgumentException("Latitude and longitude are required.");
        }

        String url = "https://api.open-meteo.com/v1/forecast"
                + "?latitude=" + latitude
                + "&longitude=" + longitude
                + "&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m"
                + "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum"
                + "&timezone=auto";

        return restTemplate.getForObject(url, Map.class);
    }
}