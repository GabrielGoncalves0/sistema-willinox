import { productSchema } from '@/schemas/productSchemas';
import { getProductInitialValues } from '@/utils/initialValues';

export const productFormSchema = productSchema;
export const productFormInitialValues = getProductInitialValues;