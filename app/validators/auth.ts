import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3).maxLength(255),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().minLength(6).maxLength(255),
    password_confirmation: vine.string().sameAs('password'),
  })
)


export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string()
  })
)