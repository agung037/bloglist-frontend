const LoginForm = ({
    handleLogin,     
    handleUsernameChange,
    handlePasswordChange, 
    username, 
    password
    }) => {

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>

                <div>
                    password
                    <input 
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )

}


export default LoginForm