'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { CreateFornecedor, listarFornecedor } from '../constants';
import ModalHelpButton from '@/components/ModalHelpButton';
import { FormatString } from '@/utils/formatString';

import { FormResetter } from '@/components/forms/FormResetter';
import { FormField } from '@/components/forms/FormField';
import { FormActions } from '@/components/forms/FormActions';

import { fornecedorFormSchema, fornecedorFormInitialValues } from '../schema';

interface FornecedorFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (fornecedorData: CreateFornecedor) => Promise<boolean>;
  initialData?: listarFornecedor;
  isEditing: boolean;
}

export const FornecedorForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}: FornecedorFormProps) => {
  const initialValues: CreateFornecedor = fornecedorFormInitialValues(initialData);

  const handleSubmit = async (
    values: CreateFornecedor,
    { setSubmitting }: FormikHelpers<CreateFornecedor>
  ) => {
    setSubmitting(true);
    const success = await onSubmit(values);
    setSubmitting(false);
    if (success) onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{isEditing ? 'Editar Fornecedor' : 'Cadastrar Fornecedor'}</span>
        <ModalHelpButton
          title={isEditing ? "Edição de Fornecedor" : "Cadastro de Fornecedor"}
          content={
            <>
              <Typography paragraph>
                {isEditing
                  ? "Nesta tela você pode editar as informações de um fornecedor existente."
                  : "Nesta tela você pode cadastrar um novo fornecedor no sistema."}
              </Typography>
              <Typography paragraph>
                <strong>Campos obrigatórios:</strong>
              </Typography>
              <ul>
                <li><strong>Nome:</strong> Nome da empresa fornecedora.</li>
                <li><strong>Endereço:</strong> Endereço completo do fornecedor.</li>
                <li><strong>Telefone:</strong> Número de telefone para contato.</li>
                <li><strong>Email:</strong> Endereço de email para comunicação.</li>
                <li><strong>CNPJ:</strong> CNPJ válido da empresa fornecedora.</li>
              </ul>
              <Typography paragraph>
                <strong>Observações:</strong>
              </Typography>
              <ul>
                <li>O CNPJ deve ser um número válido no formato XX.XXX.XXX/XXXX-XX.</li>
                <li>O email deve ser um endereço válido.</li>
                <li>O telefone deve seguir o formato (XX) XXXXX-XXXX.</li>
              </ul>
            </>
          }
        />
      </DialogTitle>
      <DialogContent>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={fornecedorFormSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <FormResetter open={open} />

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormField
                    name="nome"
                    label="Nome"
                    fullWidth
                    required
                    formatter="nome"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormField
                    name="endereco"
                    label="Endereço"
                    fullWidth
                    formatter="endereco"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field name="telefone">
                    {({ field, form }: any) => (
                      <TextField
                        {...field}
                        label="Telefone"
                        fullWidth
                        onChange={(e) => {
                          const formatted = FormatString.formatTelefone(e.target.value);
                          form.setFieldValue(field.name, formatted);
                        }}
                        error={touched.telefone && Boolean(errors.telefone)}
                        helperText={touched.telefone && errors.telefone}
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field name="email">
                    {({ field }: any) => (
                      <TextField
                        {...field}
                        label="Email"
                        type="email"
                        fullWidth
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12}>
                  <Field name="cnpj">
                    {({ field, form }: any) => (
                      <TextField
                        {...field}
                        label="CNPJ"
                        fullWidth
                        onChange={(e) => {
                          const formatted = FormatString.formatCNPJ(e.target.value);
                          form.setFieldValue(field.name, formatted);
                        }}
                        error={touched.cnpj && Boolean(errors.cnpj)}
                        helperText={touched.cnpj && errors.cnpj}
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>

              <FormActions
                onCancel={onClose}
                isEditing={isEditing}
                submitText={isEditing ? 'Salvar Alterações' : 'Cadastrar'}
              />
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
