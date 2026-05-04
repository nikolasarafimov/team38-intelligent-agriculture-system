function LoginForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.info("Login UI submitted (no backend connected yet).");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="login-email">Email</label>
      <input id="login-email" type="email" name="email" placeholder="you@example.com" required />

      <label htmlFor="login-password">Password</label>
      <input
        id="login-password"
        type="password"
        name="password"
        placeholder="Enter your password"
        required
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
