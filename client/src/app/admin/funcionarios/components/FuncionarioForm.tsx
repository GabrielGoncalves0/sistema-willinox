'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { CreateFuncionario, listarFuncionario } from '../constants';
import { FormatString } from '@/utils/formatString';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { ptBR } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ModalHelpButton from '@/components/ModalHelpButton';

import { FormResetter } from '@/components/forms/FormResetter';
import { FormField } from '@/components/forms/FormField';
import { FormActions } from '@/components/forms/FormActions';

import { funcionarioFormSchema, funcionarioFormInitialValues } from '../schema';

interface FuncionarioFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (clientData: CreateFuncionario) => Promise<boolean>;
  initialData?: listarFuncionario;
  isEditing: boolean;
}

export const FuncionarioForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}: FuncionarioFormProps) => {
  const [showAccess, setShowAccess] = useState(false);

  useEffect(() => {
    if (initialData && (initialData.login || initialData.senha)) {
      setShowAccess(true);
    }
  }, [initialData]);

  const initialValues: CreateFuncionario = funcionarioFormInitialValues(initialData);

  const handleSubmit = async (
    values: CreateFuncionario,
    { setSubmitting }: FormikHelpers<CreateFuncionario>
  ) => {
    setSubmitting(true);
    const success = await onSubmit(values);
    setSubmitting(false);
    if (success) onClose();
  };

  const handleRemoveAccess = (setFieldValue: any) => {
    setShowAccess(false);
    setFieldValue('login', '');
    setFieldValue('senha', '');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{isEditing ? 'Editar Funcionario' : 'Cadastrar Funcionario'}</span>
        <ModalHelpButton
          title={isEditing ? "Edição de Funcionário" : "Cadastro de Funcionário"}
          content={
            <>
              <Typography paragraph>
                {isEditing
                  ? "Nesta tela você pode editar as informações de um funcionário existente."
                  : "Nesta tela você pode cadastrar um novo funcionário no sistema."}
              </Typography>
              <Typography paragraph>
                <strong>Campos obrigatórios:</strong>
              </Typography>
              <ul>
                <li><strong>Nome:</strong> Nome completo do funcionário.</li>
                <li><strong>Telefone:</strong> Número de telefone para contato.</li>
                <li><strong>Email:</strong> Endereço de email para comunicação.</li>
                <li><strong>CPF:</strong> CPF válido do funcionário.</li>
                <li><strong>Data de Nascimento:</strong> Data de nascimento do funcionário.</li>
              </ul>
              <Typography paragraph>
                <strong>Acesso ao Sistema:</strong>
              </Typography>
              <ul>
                <li>Clique em "Adicionar Acesso" para criar credenciais de login para o funcionário.</li>
                <li>Se o funcionário não precisar de acesso ao sistema, deixe esta opção desativada.</li>
                <li>Ao adicionar acesso, tanto o login quanto a senha são obrigatórios.</li>
                <li>Para remover o acesso, clique em "Remover Acesso".</li>
              </ul>
              <Typography paragraph>
                <strong>Observações:</strong>
              </Typography>
              <ul>
                <li>O endereço é opcional, mas recomendado para o cadastro completo.</li>
                <li>O CPF deve ser um número válido no formato XXX.XXX.XXX-XX.</li>
                <li>O telefone deve seguir o formato (XX) XXXXX-XXXX.</li>
                <li>Funcionários com acesso ao sistema poderão fazer login e utilizar as funcionalidades de acordo com suas permissões.</li>
              </ul>
            </>
          }
        />
      </DialogTitle>
      <DialogContent>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={funcionarioFormSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, setFieldValue }) => {
            useEffect(() => {
              if (!showAccess) {
                setFieldValue('login', '');
                setFieldValue('senha', '');
              }
            }, [showAccess, setFieldValue]);

            return (
              <Form>
                <FormResetter open={open} />

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {/* Campos padrão */}
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

                  <Grid item xs={12} md={6}>
                    <Field name="cpf">
                      {({ field, form }: any) => (
                        <TextField
                          {...field}
                          label="CPF"
                          fullWidth
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

                  {/* Botão para exibir acesso */}
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setShowAccess((prev) => !prev);
                        if (!showAccess) {
                          setFieldValue('login', '');
                          setFieldValue('senha', '');
                        }
                      }}
                      fullWidth
                    >
                      {showAccess ? 'Remover Acesso' : 'Adicionar Acesso'}
                    </Button>
                  </Grid>

                  {/* Campos opcionais de acesso */}
                  {showAccess && (
                    <>
                      <Grid item xs={12} md={6}>
                        <Field name="login">
                          {({ field }: any) => (
                            <TextField
                              {...field}
                              label="Login"
                              fullWidth
                              error={touched.login && Boolean(errors.login)}
                              helperText={touched.login && errors.login}
                            />
                          )}
                        </Field>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Field name="senha">
                          {({ field }: any) => (
                            <TextField
                              {...field}
                              label="Senha"
                              type="password"
                              fullWidth
                              error={touched.senha && Boolean(errors.senha)}
                              helperText={touched.senha && errors.senha}
                            />
                          )}
                        </Field>
                      </Grid>
                    </>
                  )}
                </Grid>

                <FormActions
                  onCancel={onClose}
                  isEditing={isEditing}
                  submitText={isEditing ? 'Salvar Alterações' : 'Cadastrar'}
                />
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
