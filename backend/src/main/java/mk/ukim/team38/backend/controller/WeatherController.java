package mk.ukim.team38.backend.controller;

import lombok.RequiredArgsConstructor;
import mk.ukim.team38.backend.service.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/api/weather")
    public Map<String, Object> getWeather(
            @RequestParam Double latitude,
            @RequestParam Double longitude
    ) {
        return weatherService.getWeatherForecast(latitude, longitude);
    }
}