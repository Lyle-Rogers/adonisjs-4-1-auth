'use strict'

const User = use('App/Models/User')

class LoginController {
    showLoginForm ({ view }) {
        return view.render('auth.login')
    }

    async login ({ request, auth, session, response }) {
        const { email, password, remember } = request.all() 

        const user = await User.query()
            .where('email', email)
            .where('is_active', true)
            .first()
    }
}

module.exports = LoginController
