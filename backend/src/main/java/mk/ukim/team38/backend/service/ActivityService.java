package mk.ukim.team38.backend.service;

import lombok.RequiredArgsConstructor;
import mk.ukim.team38.backend.model.Activity;
import mk.ukim.team38.backend.model.User;
import mk.ukim.team38.backend.repository.ActivityRepository;
import mk.ukim.team38.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public List<Activity> findAll(Long userId, String search) {
        User user = getUserOrNull(userId);

        if (search != null && !search.isBlank()) {
            if (user != null) {
                return activityRepository.findByUserAndDescriptionContainingIgnoreCaseOrUserAndTypeContainingIgnoreCase(
                        user,
                        search,
                        user,
                        search
                );
            }

            return activityRepository.findByDescriptionContainingIgnoreCaseOrTypeContainingIgnoreCase(search, search);
        }

        if (user != null) {
            return activityRepository.findByUser(user);
        }

        return activityRepository.findAll();
    }

    public Optional<Activity> findById(Long id) {
        return activityRepository.findById(id);
    }

    public Activity save(Activity activity) {
        return activityRepository.save(activity);
    }

    public Activity update(Long id, Activity activityDetails) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + id));

        activity.setDescription(activityDetails.getDescription());
        activity.setDate(activityDetails.getDate());
        activity.setType(activityDetails.getType());

        if (activityDetails.getUser() != null) {
            activity.setUser(activityDetails.getUser());
        }

        return activityRepository.save(activity);
    }

    public void deleteById(Long id) {
        activityRepository.deleteById(id);
    }

    private User getUserOrNull(Long userId) {
        if (userId == null) {
            return null;
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }
}