function RegisterForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.info("Register UI submitted (no backend connected yet).");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="register-name">Full Name</label>
      <input id="register-name" type="text" name="name" placeholder="Jane Farmer" required />

      <label htmlFor="register-email">Email</label>
      <input
        id="register-email"
        type="email"
        name="email"
        placeholder="you@example.com"
        required
      />

      <label htmlFor="register-password">Password</label>
      <input
        id="register-password"
        type="password"
        name="password"
        placeholder="Create a password"
        minLength={8}
        required
      />

      <button type="submit">Create Account</button>
    </form>
  );
}

export default RegisterForm;
