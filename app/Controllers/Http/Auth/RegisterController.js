'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')
const randomString = require('random-string')
const Mail = use('Mail')

class RegisterController {
  showRegisterForm ({ view }) {
    return view.render('auth.register')
  }

  async register ({ request, session, response }) {
    const validation = await validateAll(request.all(), {
      username: 'required|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashExcept(['password']);
      return response.redirect('back')
    }

    const user = await User.create({
      username: request.input('username'),
      email: request.input('email'),
      password: request.input('password'),
      confirmation_token: randomString({ length: 40 })
    })

    await Mail.send('auth.emails.confirm_email', user.toJSON(), message => {
      message
        .to(user.email)
        .from('lick@frog.com')
        .subject('Please confirm your email address.')
    })

    session.flash({
      notification: {
        type: 'success',
        message: 'Registration successful! An email has been sent to your email address, please confirm your email address.'
      }
    })

    return response.redirect('back')
  }

  async confirmEmail ({ params, session, response }) {
    const user = await User.findBy('confirmation_token', params.token)

    user.confirmation_token = null
    user.is_active = true

    await user.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Your email address has been confirmed!'
      }
    })

    return response.redirect('/login')
  }
}

module.exports = RegisterController
