package mk.ukim.team38.backend.controller;

import lombok.RequiredArgsConstructor;
import mk.ukim.team38.backend.model.Activity;
import mk.ukim.team38.backend.model.Crop;
import mk.ukim.team38.backend.model.Parcel;
import mk.ukim.team38.backend.model.User;
import mk.ukim.team38.backend.repository.ActivityRepository;
import mk.ukim.team38.backend.repository.CropRepository;
import mk.ukim.team38.backend.repository.ParcelRepository;
import mk.ukim.team38.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final CropRepository cropRepository;
    private final ParcelRepository parcelRepository;
    private final ActivityRepository activityRepository;

    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/crops")
    public List<Crop> getCrops() {
        return cropRepository.findAll();
    }

    @GetMapping("/parcels")
    public List<Parcel> getParcels() {
        return parcelRepository.findAll();
    }

    @GetMapping("/activities")
    public List<Activity> getActivities() {
        return activityRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    @DeleteMapping("/crops/{id}")
    public void deleteCrop(@PathVariable Long id) {
        cropRepository.deleteById(id);
    }

    @DeleteMapping("/parcels/{id}")
    public void deleteParcel(@PathVariable Long id) {
        parcelRepository.deleteById(id);
    }

    @DeleteMapping("/activities/{id}")
    public void deleteActivity(@PathVariable Long id) {
        activityRepository.deleteById(id);
    }
}