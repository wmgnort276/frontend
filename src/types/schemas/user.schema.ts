import { z } from 'zod';

const UserSchema = z.object({
  name: z
    .string({
      required_error: 'invalid_type_received_undefined'
    })
    .min(1, 'invalid_type_received_undefined')
    .nonempty('invalid_type_received_undefined'),
  email: z
    .string({
      required_error: 'invalid_type_received_undefined'
    })
    .nonempty('invalid_type_received_undefined')
    .email({
      message: 'invalid_string.email'
    }),
  faqCode: z
    .string({
      required_error: 'invalid_type_received_undefined'
    })
    .nonempty('invalid_type_received_undefined')
    .email({
      message: 'invalid_string.email'
    }),
  companyCode: z
    .string({
      required_error: 'invalid_type_received_undefined'
    })
    .nonempty('invalid_type_received_undefined')
    .email({
      message: 'invalid_string.email'
    }),
  username: z
    .string({
      required_error: 'invalid_type_received_undefined'
    })
    .nonempty('invalid_type_received_undefined')
    .email({
      message: 'invalid_string.email'
    }),
  type: z
    .string({
      required_error: 'invalid_type_received_undefined'
    })
    .nonempty('invalid_type_received_undefined')
    .email({
      message: 'invalid_string.email'
    }),
  password: z
    .string({
      required_error: 'invalid_type_received_undefined'
    })
    .nonempty('invalid_type_received_undefined'),
  oldPassword: z
    .string({
      required_error: 'invalid_type_received_undefined'
    })
    .nonempty('invalid_type_received_undefined'),
  newPassword: z
    .string({
      required_error: 'invalid_type_received_undefined'
    })
    .nonempty('invalid_type_received_undefined'),
  confirmPassword: z
    .string({
      required_error: 'invalid_type_received_undefined'
    })
    .nonempty('invalid_type_received_undefined')
});

export const ResetPasswordSchema = UserSchema.pick({ email: true });
export const LoginSchema = UserSchema.pick({ username: true, password: true, type: true });
export const LoginFaqSchema = UserSchema.pick({ faqCode: true, password: true });
export const ChangePasswordSchema = UserSchema.pick({ oldPassword: true, newPassword: true, confirmPassword: true });
export type TUser = z.infer<typeof UserSchema>;
export type TLogin = z.infer<typeof LoginSchema>;
export type TLoginFaq = z.infer<typeof LoginFaqSchema>;
export type TChangePassword = z.infer<typeof ChangePasswordSchema>;
export default UserSchema;
