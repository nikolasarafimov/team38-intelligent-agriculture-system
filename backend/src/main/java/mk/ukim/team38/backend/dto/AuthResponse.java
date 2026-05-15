package mk.ukim.team38.backend.dto;

public class AuthResponse {

    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String message;

    public AuthResponse(Long id, String fullName, String email, String role, String message) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getMessage() {
        return message;
    }
}