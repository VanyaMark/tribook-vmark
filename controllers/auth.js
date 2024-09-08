const USERNAME = "admin";
const PASSWORD = "admin";

const getLoginForm = (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <input type="text" name="username" placeholder="Usuario" required />
            <input type="password" name="password" placeholder="Contraseña" required />
            <button type="submit">Iniciar sesión</button>
        </form>
    `);
}

const postLoginForm = (req, res) => {
    const { username, password } = req.body;

    // TODO.: Crear un modelo de Users. Crear un Schema que guarde los usuarios de tipo administrador en tu base de datos de MongoDB (username, password).

    // TODO+: Crear una pagina para registrar nuevos usuarios administradores

    // Si el usuario y contraseña coinciden con el de nuestra "base de datos", entonces nos guardaremos la información de que el cliente esta autentificado.
    if (username === USERNAME && password === PASSWORD) {
        req.session.isAuthenticated = true;
        res.locals.isAdmin = true;

        res.redirect('/');
    } else {
        res.send('Usuario o contraseña incorrectos');
    }
}

const logout = (req, res) => {
    console.log('Logout');

    req.session.destroy(err => {
        if (err) {
            return res.send('Error al cerrar sesión');
        }
        res.redirect('/');
    });
}

module.exports = {
    getLoginForm,
    postLoginForm,
    logout
}