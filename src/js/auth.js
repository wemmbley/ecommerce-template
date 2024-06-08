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
                neo().sessionRemove('token');
                neo().sessionPush('token', json.token);
            })
            .catch(error => {
                console.error('Error logging in:', error);
            });
    }

    static logout()
    {
        neo().sessionRemove('token');
    }

    static check()
    {
        return !empty(neo().sessionGet('token'));
    }

    static requestCheck()
    {
        const token = neo().sessionGet('token');

        if (token) {
            return neo()
                .ajax(env.AUTH_IS_LOGGED_ROUTE, 'POST', {}, {
                    'Authorization': 'Bearer ' + token
                })
                .then((response) => response.status === 200)
                .catch(error => {
                    this.logout();
                });
        }

        return Promise.resolve(false);
    }
}