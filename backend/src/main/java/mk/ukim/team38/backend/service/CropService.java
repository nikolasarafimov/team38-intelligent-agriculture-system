package mk.ukim.team38.backend.service;

import lombok.RequiredArgsConstructor;
import mk.ukim.team38.backend.model.Crop;
import mk.ukim.team38.backend.repository.CropRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CropService {

    private final CropRepository cropRepository;

    public List<Crop> findAll() {
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

        return cropRepository.save(crop);
    }

    public void deleteById(Long id) {
        cropRepository.deleteById(id);
    }
}
