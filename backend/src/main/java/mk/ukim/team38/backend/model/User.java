package mk.ukim.team38.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "app_user",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Full name is required.")
    private String fullName;

    @Email(message = "Email must be valid.")
    @NotBlank(message = "Email is required.")
    private String email;

    @JsonIgnore
    @NotBlank(message = "Password is required.")
    private String password;

    @NotBlank(message = "Role is required.")
    private String role = "USER";
}