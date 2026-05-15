package mk.ukim.team38.backend.service;

import lombok.RequiredArgsConstructor;
import mk.ukim.team38.backend.model.Crop;
import mk.ukim.team38.backend.model.User;
import mk.ukim.team38.backend.repository.CropRepository;
import mk.ukim.team38.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CropService {

    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public List<Crop> findAll(Long userId, String search) {
        User user = getUserOrNull(userId);

        if (search != null && !search.isBlank()) {
            if (user != null) {
                return cropRepository.findByUserAndNameContainingIgnoreCaseOrUserAndTypeContainingIgnoreCase(
                        user,
                        search,
                        user,
                        search
                );
            }

            return cropRepository.findByNameContainingIgnoreCaseOrTypeContainingIgnoreCase(search, search);
        }

        if (user != null) {
            return cropRepository.findByUser(user);
        }

        return cropRepository.findAll();
    }

    public Optional<Crop> findById(Long id) {
        return cropRepository.findById(id);
    }

    public Crop save(Crop crop) {
        return cropRepository.save(crop);
    }

    public Crop update(Long id, Crop cropDetails) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found with id: " + id));

        crop.setName(cropDetails.getName());
        crop.setType(cropDetails.getType());
        crop.setPlantingDate(cropDetails.getPlantingDate());

        if (cropDetails.getUser() != null) {
            crop.setUser(cropDetails.getUser());
        }

        return cropRepository.save(crop);
    }

    public void deleteById(Long id) {
        cropRepository.deleteById(id);
    }

    private User getUserOrNull(Long userId) {
        if (userId == null) {
            return null;
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }
}