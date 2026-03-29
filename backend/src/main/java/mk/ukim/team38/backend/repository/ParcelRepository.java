package mk.ukim.team38.backend.repository;

import mk.ukim.team38.backend.model.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParcelRepository extends JpaRepository<Parcel, Long> {
}