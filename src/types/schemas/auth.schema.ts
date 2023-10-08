import { array, z } from 'zod';

const AuthSchema = z.object({
  token: z.string(),
  status: z.boolean(),
  message: z.string()
});

export const MeSchemaResponse = z.object({
  user: z.object({
    UserName: z.string(),
    UserType: z.string(),
    UserId: z.string(),
    lookup_items: z.object({
      CompanyId: z.object({
        CompanyCode: z.string(),
        CompanyName: z.string()
      })
    }),
    i_id: z.string(),
    companyFunctions: z.object({
      functionCode: z.string(),
      flag: z.string(),
    }).array(),
    functions: z.object({
      functionCode: z.string(),
      flag: z.string(),
    }).array(),
    CompanyCode: z.string(),
    Email: z.string(),
    FirstName: z.string(),
    LastName: z.string(),
    LastNameKanji: z.string(),
    NameKanji: z.string(),
    LoginUserId: z.string(),
    IsAuthority: z.string(),
    CompanyGroupCode: z.string(),
  }),
});
export type TAuth = z.infer<typeof AuthSchema>;
export type TCurrentUser = z.infer<typeof MeSchemaResponse>;
export default AuthSchema;
