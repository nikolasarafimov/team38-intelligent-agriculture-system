package mk.ukim.team38.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Parcel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Location is required.")
    private String location;

    @Positive(message = "Size must be greater than zero.")
    private Double size;

    @NotBlank(message = "Soil type is required.")
    private String soilType;

    @ManyToOne
    @JsonIgnoreProperties({"password"})
    private User user;
}