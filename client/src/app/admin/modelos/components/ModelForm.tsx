'use client';

import { Dialog, DialogTitle, DialogContent, Grid, Typography } from '@mui/material';
import { Formik, Form, FormikHelpers } from 'formik';
import { Modelo } from '../constants';
import ModalHelpButton from '@/components/ModalHelpButton';

import { FormResetter } from '@/components/forms/FormResetter';
import { FormField } from '@/components/forms/FormField';
import { FormActions } from '@/components/forms/FormActions';

import { modeloFormInitialValues, modeloFormSchema } from '../schema';

interface ModelFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (modelData: Omit<Modelo, 'id'>) => Promise<void>;
  initialData?: Modelo;
  isEditing: boolean;
}

export const ModelForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}: ModelFormProps) => {

  const handleSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
    setSubmitting(true);
    await onSubmit(values);
    setSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{isEditing ? 'Editar Modelo' : 'Adicionar Modelo'}</span>
        <ModalHelpButton
          title={isEditing ? "Edição de Modelo" : "Cadastro de Modelo"}
          content={
            <>
              <Typography paragraph>
                {isEditing
                  ? "Nesta tela você pode editar as informações de um modelo existente."
                  : "Nesta tela você pode cadastrar um novo modelo no sistema."}
              </Typography>
              <Typography paragraph>
                <strong>Campos obrigatórios:</strong>
              </Typography>
              <ul>
                <li><strong>Nome do Modelo:</strong> Nome que identifica o modelo de produto.</li>
              </ul>
              <Typography paragraph>
                <strong>Campos opcionais:</strong>
              </Typography>
              <ul>
                <li><strong>Descrição:</strong> Detalhes adicionais sobre o modelo.</li>
              </ul>
              <Typography paragraph>
                <strong>Observações:</strong>
              </Typography>
              <ul>
                <li>Os modelos são utilizados para categorizar os produtos.</li>
                <li>Um modelo pode ser associado a vários produtos diferentes.</li>
                <li>Modelos inativos ainda podem ser visualizados, mas não podem ser selecionados para novos produtos.</li>
              </ul>
            </>
          }
        />
      </DialogTitle>
      <DialogContent>
        <Formik
          enableReinitialize
          initialValues={modeloFormInitialValues(initialData)}
          validationSchema={modeloFormSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormResetter open={open} />
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormField
                    name="nome"
                    label="Nome do Modelo"
                    fullWidth
                    required
                    formatter="nome"
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormField
                    name="descricao"
                    label="Descrição"
                    fullWidth
                    autoComplete="off"
                  />
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
