'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { CreateCliente, listarCliente, mapClienteToCreate } from '../constants';
import ModalHelpButton from '@/components/ModalHelpButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { FormatString } from '@/utils/formatString';
import { ptBR } from 'date-fns/locale';

import { FormResetter } from '@/components/forms/FormResetter';
import { FormField } from '@/components/forms/FormField';
import { FormActions } from '@/components/forms/FormActions';

import { clientSchemaFisico, clientSchemaJuridico, clienteFormInitialValues } from '../schema';



interface ClientFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (clientData: CreateCliente) => Promise<boolean>;
  initialData?: listarCliente;
  isEditing: boolean;
}

export const ClienteForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}: ClientFormProps) => {
  const [tab, setTab] = useState<'fisica' | 'juridica'>('fisica');

  useEffect(() => {
    if (initialData?.tipo === 'juridica') {
      setTab('juridica');
    } else {
      setTab('fisica');
    }
  }, [initialData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'fisica' | 'juridica') => {
    setTab(newValue);
  };

  const initialValues: CreateCliente = clienteFormInitialValues(initialData, tab);

  const handleSubmit = async (
    values: CreateCliente,
    { setSubmitting }: FormikHelpers<CreateCliente>
  ) => {
    setSubmitting(true);
    const success = await onSubmit(values);
    setSubmitting(false);
    if (success) onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{isEditing ? 'Editar Cliente' : 'Cadastrar Cliente'}</span>
        <ModalHelpButton
          title={isEditing ? "Edição de Cliente" : "Cadastro de Cliente"}
          content={
            <>
              <Typography paragraph>
                {isEditing
                  ? "Nesta tela você pode editar as informações de um cliente existente."
                  : "Nesta tela você pode cadastrar um novo cliente no sistema."}
              </Typography>
              <Typography paragraph>
                <strong>Selecione o tipo de cliente:</strong>
              </Typography>
              <ul>
                <li><strong>Pessoa Física:</strong> Para clientes individuais com CPF.</li>
                <li><strong>Pessoa Jurídica:</strong> Para empresas com CNPJ.</li>
              </ul>
              <Typography paragraph>
                <strong>Campos obrigatórios para Pessoa Física:</strong>
              </Typography>
              <ul>
                <li><strong>Nome:</strong> Nome completo do cliente.</li>
                <li><strong>Telefone:</strong> Número de telefone para contato.</li>
                <li><strong>Email:</strong> Endereço de email para comunicação.</li>
                <li><strong>CPF:</strong> CPF válido do cliente.</li>
                <li><strong>Data de Nascimento:</strong> Data de nascimento do cliente.</li>
              </ul>
              <Typography paragraph>
                <strong>Campos obrigatórios para Pessoa Jurídica:</strong>
              </Typography>
              <ul>
                <li><strong>Nome:</strong> Nome da empresa.</li>
                <li><strong>Telefone:</strong> Número de telefone para contato.</li>
                <li><strong>Email:</strong> Endereço de email para comunicação.</li>
                <li><strong>CNPJ:</strong> CNPJ válido da empresa.</li>
              </ul>
              <Typography paragraph>
                <strong>Observações:</strong>
              </Typography>
              <ul>
                <li>O endereço é opcional, mas recomendado para entregas.</li>
                <li>O CPF e CNPJ devem ser números válidos nos formatos corretos.</li>
                <li>Após o cadastro, o cliente poderá fazer pedidos no sistema.</li>
              </ul>
            </>
          }
        />
      </DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Pessoa Física" value="fisica" disabled={isEditing && tab === 'juridica'} />
          <Tab label="Pessoa Jurídica" value="juridica" disabled={isEditing && tab === 'fisica'} />
        </Tabs>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={tab === 'fisica' ? clientSchemaFisico : clientSchemaJuridico}
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
                        value={field.value || ''}
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
                        value={field.value || ''}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    )}
                  </Field>
                </Grid>

                {tab === 'fisica' && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Field name="cpf">
                        {({ field, form }: any) => (
                          <TextField
                            {...field}
                            label="CPF"
                            fullWidth
                            value={field.value || ''}
                            onChange={(e) => {
                              const formatted = FormatString.formatCPF(e.target.value);
                              form.setFieldValue(field.name, formatted);
                            }}
                            error={touched.cpf && Boolean(errors.cpf)}
                            helperText={touched.cpf && errors.cpf}
                          />
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="dataNascimento">
                        {({ field, form }: any) => (
                          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                            <DatePicker
                              label="Data de Nascimento"
                              value={field.value ? new Date(field.value) : null}
                              onChange={(date) => {
                                if (date) {
                                  const adjustedDate = new Date(date);
                                  adjustedDate.setHours(12, 0, 0, 0);
                                  form.setFieldValue(field.name, adjustedDate.toISOString());
                                } else {
                                  form.setFieldValue(field.name, undefined);
                                }
                              }}
                              maxDate={new Date()}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  readOnly: true,
                                  error: touched.dataNascimento && Boolean(errors.dataNascimento),
                                  helperText: touched.dataNascimento && errors.dataNascimento,
                                },
                              }}
                            />
                          </LocalizationProvider>
                        )}
                      </Field>
                    </Grid>
                  </>
                )}

                {tab === 'juridica' && (
                  <Grid item xs={12} md={6}>
                    <Field name="cnpj">
                      {({ field, form }: any) => (
                        <TextField
                          {...field}
                          label="CNPJ"
                          fullWidth
                          value={field.value || ''}
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
                )}
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