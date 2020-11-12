'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

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

        if (user) {
            const passwordVerified = await Hash.verify(password, user.password)

            if (passwordVerified) {
                await auth.remember(!!remember).login(user)

                return response.route('home')
            }
        }

        session.flash({
            notification: {
                type: 'danger',
                message: `We couldn't verify your credentials. Make sure you've confirmed your email address!`
            }
        })

        return response.redirect('back')
    }
}

module.exports = LoginController
