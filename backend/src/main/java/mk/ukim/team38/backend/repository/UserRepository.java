package mk.ukim.team38.backend.repository;

import mk.ukim.team38.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}