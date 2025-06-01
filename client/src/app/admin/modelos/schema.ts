import { modeloSchema } from '@/schemas/productSchemas';
import { getModeloInitialValues } from '@/utils/initialValues';

export const modeloFormSchema = modeloSchema;
export const modeloFormInitialValues = getModeloInitialValues;

export interface ModeloInitialValues {
  nome: string;
  descricao?: string;
}
