package mk.ukim.team38.backend.repository;

import mk.ukim.team38.backend.model.Activity;
import mk.ukim.team38.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUser(User user);
}
