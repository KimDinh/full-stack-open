const LoginForm = ({
  handleSubmit,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange
}) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            username:
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div>
          <label>
            password:
            <input
              type="text"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm