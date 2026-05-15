package mk.ukim.team38.backend.service;

import mk.ukim.team38.backend.dto.RecommendationRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class RecommendationService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ml.service.url:http://localhost:8000}")
    private String mlServiceUrl;

    public Map<String, Object> getRecommendation(RecommendationRequest request) {
        Map<String, Object> mlPayload = new LinkedHashMap<>();
        mlPayload.put("cropType", request.getCropType());
        mlPayload.put("soilType", request.getSoilType());
        mlPayload.put("temperature", request.getTemperature());
        mlPayload.put("humidity", request.getHumidity());
        mlPayload.put("rainfall", request.getRainfall());

        try {
            Map<String, Object> mlResponse = restTemplate.postForObject(
                    mlServiceUrl + "/predict",
                    mlPayload,
                    Map.class
            );

            if (mlResponse != null) {
                return mlResponse;
            }
        } catch (Exception exception) {
            return fallbackRecommendation(request, exception.getMessage());
        }

        return fallbackRecommendation(request, "ML service returned an empty response.");
    }

    private Map<String, Object> fallbackRecommendation(RecommendationRequest request, String reason) {
        Map<String, Object> response = new LinkedHashMap<>();

        String recommendation;

        if (request.getRainfall() != null && request.getRainfall() > 20) {
            recommendation = "Irrigation is not recommended because rainfall is high.";
        } else if (request.getTemperature() != null && request.getTemperature() > 30) {
            recommendation = "Irrigation is recommended because temperature is high.";
        } else if (request.getHumidity() != null && request.getHumidity() < 40) {
            recommendation = "Moderate irrigation is recommended because humidity is low.";
        } else {
            recommendation = "Normal monitoring is recommended. No urgent irrigation action is required.";
        }

        response.put("recommendation", recommendation);
        response.put("source", "Backend fallback recommendation");
        response.put("mlServiceAvailable", false);
        response.put("reason", reason);

        return response;
    }
}