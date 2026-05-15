package mk.ukim.team38.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.ukim.team38.backend.dto.RecommendationRequest;
import mk.ukim.team38.backend.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping
    public Map<String, Object> getRecommendation(@Valid @RequestBody RecommendationRequest request) {
        return recommendationService.getRecommendation(request);
    }
}