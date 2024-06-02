class Auth
{
    static login(email, password)
    {
        neo()
            .ajax(env.AUTH_ROUTE, 'POST', {
                email: email,
                password: password,
            })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)

                localStorage.setItem('token', json.token);
            })
            .catch(error => {
                console.error('Error logging in:', error);
            });
    }

    static check()
    {
        const token = localStorage.getItem('token');

        if (token) {
            return neo()
                .ajax(env.AUTH_IS_LOGGED_ROUTE, 'POST', {}, {
                    'Authorization': 'Bearer ' + token
                })
                .then((response) => response.status === 200)
                .catch(error => {
                    localStorage.removeItem('token');
                });
        }

        return Promise.resolve(false);
    }
}