package mk.ukim.team38.backend.repository;

import mk.ukim.team38.backend.model.Crop;
import mk.ukim.team38.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CropRepository extends JpaRepository<Crop, Long> {
    List<Crop> findByUser(User user);
}