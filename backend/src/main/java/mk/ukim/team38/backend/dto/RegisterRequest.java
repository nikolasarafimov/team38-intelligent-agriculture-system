package mk.ukim.team38.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Full name is required.")
    private String fullName;

    @Email(message = "Email must be valid.")
    @NotBlank(message = "Email is required.")
    private String email;

    @Size(min = 6, message = "Password must contain at least 6 characters.")
    @NotBlank(message = "Password is required.")
    private String password;

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}