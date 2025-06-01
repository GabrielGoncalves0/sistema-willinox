'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { MateriaPrima } from '../constants';
import ModalHelpButton from '@/components/ModalHelpButton';

import { FormResetter } from '@/components/forms/FormResetter';
import { FormField } from '@/components/forms/FormField';
import { FormActions } from '@/components/forms/FormActions';

import { materiaPrimaFormInitialValues, materiaPrimaFormSchema } from '../schema';

const unitOptions = [
  { value: 'kg', label: 'Quilogramas (kg)' },
  { value: 'g', label: 'Gramas (g)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'm', label: 'Metros (m)' },
  { value: 'cm', label: 'Centímetros (cm)' },
  { value: 'unit', label: 'Unidades' },
];

interface MateriaPrimaFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (materialData: Partial<MateriaPrima>) => Promise<boolean>;
  initialData?: Partial<MateriaPrima>;
  isEditing: boolean;
}

export const MateriaPrimaForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}: MateriaPrimaFormProps) => {

  const handleSubmit = async (
    values: any,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    setSubmitting(true);
    const success = await onSubmit({
      ...values,
      preco: Number(values.preco),
    });
    setSubmitting(false);
    if (success) onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{isEditing ? 'Editar Matéria-Prima' : 'Adicionar Nova Matéria-Prima'}</span>
        <ModalHelpButton
          title={isEditing ? "Edição de Matéria-Prima" : "Cadastro de Matéria-Prima"}
          content={
            <>
              <Typography paragraph>
                {isEditing
                  ? "Nesta tela você pode editar as informações de uma matéria-prima existente."
                  : "Nesta tela você pode cadastrar uma nova matéria-prima no sistema."}
              </Typography>
              <Typography paragraph>
                <strong>Campos obrigatórios:</strong>
              </Typography>
              <ul>
                <li><strong>Código:</strong> Identificador único da matéria-prima (formato MP-XXXXXX).</li>
                <li><strong>Nome:</strong> Nome da matéria-prima que será exibido nas listagens.</li>
                <li><strong>Quantidade em Estoque:</strong> Quantidade inicial disponível.</li>
                <li><strong>Unidade de Medida:</strong> Como a matéria-prima é medida (kg, g, l, ml, m, cm ou unidades).</li>
                <li><strong>Preço:</strong> Valor de custo da matéria-prima.</li>
              </ul>
              <Typography paragraph>
                <strong>Observações:</strong>
              </Typography>
              <ul>
                <li>A descrição é opcional, mas recomendada para detalhar a matéria-prima.</li>
                <li>O estoque será atualizado automaticamente durante a produção e compras.</li>
                <li>Matérias-primas são utilizadas na fabricação de produtos.</li>
                <li>Ao editar uma matéria-prima, você poderá ver os produtos que a utilizam.</li>
              </ul>
            </>
          }
        />
      </DialogTitle>
      <DialogContent>
        <Formik
          enableReinitialize
          initialValues={materiaPrimaFormInitialValues(initialData)}
          validationSchema={materiaPrimaFormSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, values }) => (
            <Form>
              <FormResetter open={open} />
              <Grid container spacing={2} sx={{ mt: 1 }}>

                {/* Código da MP */}
                <Grid item xs={12} md={6}>
                  <Field name="codigo">
                    {({ field, form }: any) => {
                      const raw = field.value || '';
                      const cleaned = raw.replace(/^MP-/, '').replace(/\D/g, '');
                      const display = cleaned ? `MP-${cleaned.slice(0, 6)}` : '';
                      return (
                        <TextField
                          fullWidth
                          label="Código da Matéria-Prima"
                          {...field}
                          value={display}
                          onChange={(e) => {
                            const val = e.target.value;
                            const digits = val.toUpperCase().replace(/[^0-9]/g, '');
                            form.setFieldValue('codigo', digits ? `MP-${digits}` : '');
                          }}
                          onBlur={() => form.setFieldTouched('codigo', true)}
                          helperText={form.touched.codigo && form.errors.codigo}
                          error={Boolean(form.touched.codigo && form.errors.codigo)}
                          required
                        />
                      );
                    }}
                  </Field>
                </Grid>

                {/* Nome */}
                <Grid item xs={12} md={6}>
                  <FormField
                    name="nome"
                    label="Nome"
                    fullWidth
                    required
                    formatter="nome"
                  />
                </Grid>

                {/* Descrição */}
                <Grid item xs={12}>
                  <FormField
                    name="descricao"
                    label="Descrição"
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>

                {/* Quantidade */}
                <Grid item xs={12} md={6}>
                  <Field name="qtdEstoque">
                    {({ field, form }: any) => (
                      <NumericFormat
                        customInput={TextField}
                        fullWidth
                        label="Quantidade em Estoque"
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={0}
                        allowNegative={false}
                        value={field.value}
                        onValueChange={({ floatValue }) => {
                          form.setFieldValue('qtdEstoque', floatValue ?? '');
                        }}
                        onBlur={() => form.setFieldTouched('qtdEstoque', true)}
                        helperText={form.touched.qtdEstoque && form.errors.qtdEstoque}
                        error={Boolean(form.touched.qtdEstoque && form.errors.qtdEstoque)}
                        isAllowed={({ floatValue }) => (floatValue ?? 0) <= 9999999}
                        required
                      />
                    )}
                  </Field>
                </Grid>

                {/* Unidade de Medida */}
                <Grid item xs={12} md={6}>
                  <Field name="unidadeMedida">
                    {({ field }: any) => (
                      <TextField
                        select
                        fullWidth
                        label="Unidade de Medida"
                        {...field}
                        required
                        error={Boolean(touched.unidadeMedida && errors.unidadeMedida)}
                        helperText={touched.unidadeMedida && errors.unidadeMedida}
                      >
                        {unitOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field name="preco">
                    {({ field, form }: any) => (
                      <NumericFormat
                        customInput={TextField}
                        fullWidth
                        label="Preço"
                        value={field.value}
                        prefix="R$ "
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        isAllowed={({ floatValue = 0 }) =>
                          floatValue <= 9999999.99
                        }
                        onValueChange={(vals) => {
                          form.setFieldValue('preco', vals.floatValue ?? '');
                        }}
                        onBlur={() => form.setFieldTouched('preco', true)}
                        helperText={
                          form.touched.preco && form.errors.preco
                        }
                        error={Boolean(form.touched.preco && form.errors.preco)}
                        required
                      />
                    )}
                  </Field>
                </Grid>



              </Grid>

              <FormActions
                onCancel={onClose}
                isEditing={isEditing}
              />
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};