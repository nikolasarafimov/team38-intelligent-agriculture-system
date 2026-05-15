package mk.ukim.team38.backend.service;

import lombok.RequiredArgsConstructor;
import mk.ukim.team38.backend.model.Parcel;
import mk.ukim.team38.backend.model.User;
import mk.ukim.team38.backend.repository.ParcelRepository;
import mk.ukim.team38.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParcelService {

    private final ParcelRepository parcelRepository;
    private final UserRepository userRepository;

    public List<Parcel> findAll(Long userId, String search) {
        User user = getUserOrNull(userId);

        if (search != null && !search.isBlank()) {
            if (user != null) {
                return parcelRepository.findByUserAndLocationContainingIgnoreCaseOrUserAndSoilTypeContainingIgnoreCase(
                        user,
                        search,
                        user,
                        search
                );
            }

            return parcelRepository.findByLocationContainingIgnoreCaseOrSoilTypeContainingIgnoreCase(search, search);
        }

        if (user != null) {
            return parcelRepository.findByUser(user);
        }

        return parcelRepository.findAll();
    }

    public Optional<Parcel> findById(Long id) {
        return parcelRepository.findById(id);
    }

    public Parcel save(Parcel parcel) {
        return parcelRepository.save(parcel);
    }

    public Parcel update(Long id, Parcel parcelDetails) {
        Parcel parcel = parcelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parcel not found with id: " + id));

        parcel.setLocation(parcelDetails.getLocation());
        parcel.setSize(parcelDetails.getSize());
        parcel.setSoilType(parcelDetails.getSoilType());

        if (parcelDetails.getUser() != null) {
            parcel.setUser(parcelDetails.getUser());
        }

        return parcelRepository.save(parcel);
    }

    public void deleteById(Long id) {
        parcelRepository.deleteById(id);
    }

    private User getUserOrNull(Long userId) {
        if (userId == null) {
            return null;
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }
}