import { z } from 'zod';

const BusinessSchema = z.object({
  businessCode: z.string(),
  businessName: z.string()
});

export const BusinessesSchema = z.array(BusinessSchema);

export type TBusiness = z.infer<typeof BusinessesSchema>;
export default BusinessSchema;
