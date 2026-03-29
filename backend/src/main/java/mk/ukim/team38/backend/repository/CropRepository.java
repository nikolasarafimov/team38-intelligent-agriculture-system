package mk.ukim.team38.backend.repository;

import mk.ukim.team38.backend.model.Crop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CropRepository extends JpaRepository<Crop, Long> {
}