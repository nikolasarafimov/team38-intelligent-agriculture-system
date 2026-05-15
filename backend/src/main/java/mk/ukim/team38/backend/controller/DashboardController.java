package mk.ukim.team38.backend.controller;

import lombok.RequiredArgsConstructor;
import mk.ukim.team38.backend.dto.DashboardStatsResponse;
import mk.ukim.team38.backend.repository.ActivityRepository;
import mk.ukim.team38.backend.repository.CropRepository;
import mk.ukim.team38.backend.repository.ParcelRepository;
import mk.ukim.team38.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final CropRepository cropRepository;
    private final ParcelRepository parcelRepository;
    private final ActivityRepository activityRepository;

    @GetMapping("/api/dashboard/stats")
    public DashboardStatsResponse getDashboardStats() {
        return new DashboardStatsResponse(
                userRepository.count(),
                cropRepository.count(),
                parcelRepository.count(),
                activityRepository.count()
        );
    }
}