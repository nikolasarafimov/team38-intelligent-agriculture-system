package mk.ukim.team38.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Description is required.")
    private String description;

    @NotBlank(message = "Date is required.")
    private String date;

    @NotBlank(message = "Activity type is required.")
    private String type;

    @ManyToOne
    @JsonIgnoreProperties({"password"})
    private User user;

    public Activity() {
    }

    public Activity(String description, String date, String type) {
        this.description = description;
        this.date = date;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public String getDate() {
        return date;
    }

    public String getType() {
        return type;
    }

    public User getUser() {
        return user;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setUser(User user) {
        this.user = user;
    }
}