import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, saveCurrentUser } from "../../../api";

function RegisterForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const [status, setStatus] = useState({
        message: "",
        type: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            return "Full name is required.";
        }

        if (!formData.email.trim()) {
            return "Email is required.";
        }

        if (!formData.email.includes("@")) {
            return "Please enter a valid email address.";
        }

        if (formData.password.length < 6) {
            return "Password must contain at least 6 characters.";
        }

        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setStatus({
                message: validationError,
                type: "error",
            });
            return;
        }

        setLoading(true);
        setStatus({
            message: "Creating account...",
            type: "info",
        });

        try {
            const user = await apiRequest("/api/users/register", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            saveCurrentUser(user);

            setStatus({
                message: "Account created successfully. Redirecting to dashboard...",
                type: "success",
            });

            setTimeout(() => {
                navigate("/dashboard");
            }, 700);
        } catch (error) {
            setStatus({
                message: error.message || "Registration failed.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="register-name">Full Name</label>
            <input
                id="register-name"
                type="text"
                name="fullName"
                placeholder="Jane Farmer"
                value={formData.fullName}
                onChange={handleChange}
                required
            />

            <label htmlFor="register-email">Email</label>
            <input
                id="register-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <label htmlFor="register-password">Password</label>
            <input
                id="register-password"
                type="password"
                name="password"
                placeholder="Create a password"
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                required
            />

            {status.message && (
                <div className={`auth-message ${status.type}`}>
                    {status.message}
                </div>
            )}

            <button type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
            </button>
        </form>
    );
}

export default RegisterForm;