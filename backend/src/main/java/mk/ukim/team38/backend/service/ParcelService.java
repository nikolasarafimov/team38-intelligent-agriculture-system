package mk.ukim.team38.backend.service;

import lombok.RequiredArgsConstructor;
import mk.ukim.team38.backend.model.Parcel;
import mk.ukim.team38.backend.repository.ParcelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParcelService {

    private final ParcelRepository parcelRepository;

    public List<Parcel> findAll() {
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

        return parcelRepository.save(parcel);
    }

    public void deleteById(Long id) {
        parcelRepository.deleteById(id);
    }
}
