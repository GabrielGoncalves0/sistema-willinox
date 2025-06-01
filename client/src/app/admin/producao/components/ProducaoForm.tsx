'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  DialogContentText,
  Grid,
  FormHelperText,
} from '@mui/material';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useFuncionario } from '../../../../hooks/useFuncionario';
import { useProducts } from '../../../../hooks/useProduto';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { Formik, Form, Field, useFormikContext, FormikHelpers } from 'formik';
import { ProducaoModalHelp } from '@/components/help';

interface ProducaoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialData: any | null;
  isEditing: boolean;
}

const FormResetter = ({ open }: { open: boolean }) => {
  const { resetForm, initialValues } = useFormikContext<any>();
  useEffect(() => {
    if (open) resetForm({ values: initialValues });
  }, [open]);
  return null;
};

export default function ProducaoForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}: ProducaoFormProps) {
  const { funcionarios } = useFuncionario();
  const { products } = useProducts();

  const productsWithUniqueKeys = products.map((product) => ({
    ...product,
    uniqueKey: `product-${product.id}`
  }));

  const funcionariosWithUniqueKeys = funcionarios.map((funcionario) => ({
    ...funcionario,
    uniqueKey: `funcionario-${funcionario.id}`
  }));

  let formattedDate = '';
  if (initialData?.dataInicio) {
    try {
      formattedDate = initialData.dataInicio;

      if (!formattedDate.includes('T')) {
        formattedDate = `${formattedDate}T12:00:00.000Z`;
      }
    } catch (error) {
      console.error('Erro ao formatar data inicial:', error);
    }
  }

  const fisicaIdExists = initialData ? funcionarios.some(f => f.id === Number(initialData.fisicaId)) : false;
  const produtoIdExists = initialData ? products.some(p => p.id === Number(initialData.produtoId)) : false;

  const initialValues = {
    fisicaId: initialData && fisicaIdExists ? Number(initialData.fisicaId) : '',
    produtoId: initialData && produtoIdExists ? Number(initialData.produtoId) : '',
    quantidade: initialData ? initialData.quantidade || 1 : '',
    data: initialData?.dataInicio || '',
    dataFim: initialData?.dataFim || '',
    status: initialData ? initialData.status : 'pendente',
  };

  const validationSchema = Yup.object({
    fisicaId: Yup.number().required('Funcionário é obrigatório'),
    produtoId: Yup.number().required('Produto é obrigatório'),
    quantidade: Yup.number()
      .min(1, 'Quantidade deve ser maior que 0')
      .required('Quantidade é obrigatória'),
    data: Yup.string().required('Data de início é obrigatória'),
    dataFim: Yup.string().nullable(),
    status: Yup.string().required('Status é obrigatório'),
  });

  const handleSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
    const submitData = {
      id: initialData?.id,
      fisicaId: values.fisicaId,
      produtoId: values.produtoId,
      quantidade: values.quantidade,
      status: values.status,
      dataInicio: values.data,
      ...(isEditing ? { dataFim: values.dataFim || null } : {}),
    };

    try {
      onSubmit(submitData);
      setSubmitting(false);
      onClose();
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{isEditing ? 'Editar Produção' : 'Cadastrar Produção'}</span>
        <ProducaoModalHelp isEditing={isEditing} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isEditing ? 'Altere os dados da produção.' : 'Preencha os dados da nova produção.'}
        </DialogContentText>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnBlur={true}
          validateOnChange={true}
        >
          {({ isSubmitting, errors, touched, setFieldValue, values }) => (
            <Form>
              <FormResetter open={open} />

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth error={touched.fisicaId && Boolean(errors.fisicaId)}>
                    <InputLabel>Funcionário</InputLabel>
                    <Select
                      value={values.fisicaId}
                      onChange={(e) => setFieldValue('fisicaId', Number(e.target.value))}
                      label="Funcionário"
                      name="fisicaId"
                      error={touched.fisicaId && Boolean(errors.fisicaId)}
                    >
                      {funcionariosWithUniqueKeys.map((funcionario) => (
                        <MenuItem key={funcionario.uniqueKey} value={funcionario.id}>
                          {funcionario.pessoa.nome}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.fisicaId && errors.fisicaId && (
                      <FormHelperText error>{String(errors.fisicaId)}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth error={touched.produtoId && Boolean(errors.produtoId)}>
                    <InputLabel>Produto</InputLabel>
                    <Select
                      value={values.produtoId}
                      onChange={(e) => setFieldValue('produtoId', Number(e.target.value))}
                      label="Produto"
                      name="produtoId"
                      error={touched.produtoId && Boolean(errors.produtoId)}
                    >
                      {productsWithUniqueKeys.map((produto) => (
                        <MenuItem key={produto.uniqueKey} value={produto.id}>{produto.nome}</MenuItem>
                      ))}
                    </Select>
                    {touched.produtoId && errors.produtoId && (
                      <FormHelperText error>{String(errors.produtoId)}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Quantidade"
                    name="quantidade"
                    type="number"
                    value={values.quantidade}
                    onChange={(e) => setFieldValue('quantidade', e.target.value)}
                    error={touched.quantidade && Boolean(errors.quantidade)}
                    helperText={touched.quantidade && errors.quantidade ? String(errors.quantidade) : undefined}
                  />
                </Grid>

                <Grid item xs={12} md={isEditing ? 6 : 12}>
                  <Field name="data">
                    {({ field, form }: any) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <DatePicker
                          label="Data Início"
                          value={field.value ? new Date(field.value) : null}
                          onChange={(date) => {
                            if (date) {
                              const adjustedDate = new Date(date);
                              adjustedDate.setDate(adjustedDate.getDate() + 1);

                              const year = adjustedDate.getFullYear();
                              const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
                              const day = String(adjustedDate.getDate()).padStart(2, '0');

                              const formattedDate = `${year}-${month}-${day}`;

                              form.setFieldValue(field.name, formattedDate);
                            } else {
                              form.setFieldValue(field.name, undefined);
                            }
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              readOnly: true,
                              error: touched.data && Boolean(errors.data),
                              helperText: touched.data && errors.data ? String(errors.data) : undefined,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    )}
                  </Field>
                </Grid>

                {isEditing && (
                  <Grid item xs={12} md={6}>
                    <Field name="dataFim">
                      {({ field, form }: any) => (
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                          <DatePicker
                            label="Data Fim"
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => {
                              if (date) {
                                const adjustedDate = new Date(date);
                                adjustedDate.setDate(adjustedDate.getDate() + 1);

                                const year = adjustedDate.getFullYear();
                                const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
                                const day = String(adjustedDate.getDate()).padStart(2, '0');

                                const formattedDate = `${year}-${month}-${day}`;

                                form.setFieldValue(field.name, formattedDate);
                              } else {
                                form.setFieldValue(field.name, undefined);
                              }
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                readOnly: true,
                                error: touched.dataFim && Boolean(errors.dataFim),
                                helperText: touched.dataFim && errors.dataFim ? String(errors.dataFim) : undefined,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      )}
                    </Field>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormControl fullWidth error={touched.status && Boolean(errors.status)}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={values.status}
                      onChange={(e) => setFieldValue('status', e.target.value)}
                      label="Status"
                      name="status"
                      error={touched.status && Boolean(errors.status)}
                    >
                      <MenuItem key="status-pendente" value="pendente">Pendente</MenuItem>
                      <MenuItem key="status-em_andamento" value="em_andamento">Em Andamento</MenuItem>
                      <MenuItem key="status-concluido" value="concluido">Concluído</MenuItem>
                      <MenuItem key="status-cancelado" value="cancelado">Cancelado</MenuItem>
                    </Select>
                    {touched.status && errors.status && (
                      <FormHelperText error>{String(errors.status)}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={() => {
                        Object.keys(values).forEach(field => {
                          setFieldValue(field, values[field as keyof typeof values], true);
                        });
                      }}
                    >
                      {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
                    </Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
