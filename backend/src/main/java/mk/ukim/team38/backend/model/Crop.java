package mk.ukim.team38.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Crop name is required.")
    private String name;

    @NotBlank(message = "Crop type is required.")
    private String type;

    private String plantingDate;

    @ManyToOne
    @JsonIgnoreProperties({"password"})
    private User user;
}