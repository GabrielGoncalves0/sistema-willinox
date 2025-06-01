'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  TextField,
  IconButton,
  Typography,
  Box,
  Autocomplete,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { Formik, Form, Field, FieldArray, FormikHelpers } from 'formik';
import { productFormInitialValues, productFormSchema } from '../schema';
import { useModelos } from '../../../../hooks/useModelo';
import { useMateriasPrimas } from '../../../../hooks/useMateriaPrima';
import { useEffect } from 'react';
import { Add, Delete } from '@mui/icons-material';
import { ProdutoModalHelp } from '@/components/help';
import { toast } from 'sonner';

import { FormResetter } from '@/components/forms/FormResetter';
import { FormField } from '@/components/forms/FormField';
import { FormActions } from '@/components/forms/FormActions';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (productData: any) => Promise<boolean>;
  initialData?: any;
  isEditing: boolean;
}

export const ProductForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}: ProductFormProps) => {
  const { modelos = [], fetchModelos } = useModelos();

  useEffect(() => {
    let isMounted = true;

    if (open && isMounted) {
      const timer = setTimeout(() => {
        fetchModelos(isEditing);
      }, 100);

      return () => {
        clearTimeout(timer);
        isMounted = false;
      };
    }
  }, [open, fetchModelos, isEditing]);

  const { materiasPrimas = [], fetchMateriasPrimas } = useMateriasPrimas();

  useEffect(() => {
    let isMounted = true;

    if (open && isMounted) {
      const timer = setTimeout(() => {
        fetchMateriasPrimas(isEditing);
      }, 100);

      return () => {
        clearTimeout(timer);
        isMounted = false;
      };
    }
  }, [open, fetchMateriasPrimas, isEditing]);

  const handleSubmit = async (
    values: any,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    setSubmitting(true);

    const filteredMateriasPrimas = values.materiasPrimas.filter((mp: any) => mp.id && mp.quantidade);

    if (filteredMateriasPrimas.length === 0) {
      setSubmitting(false);
      toast.error('Adicione pelo menos uma matéria-prima.');
      return false;
    }

    const materiaPrimaIds = filteredMateriasPrimas.map((mp: any) => mp.id);
    const hasDuplicateIds = new Set(materiaPrimaIds).size !== materiaPrimaIds.length;

    if (hasDuplicateIds) {
      setSubmitting(false);
      toast.error('Existem matérias-primas duplicadas. Remova as duplicatas antes de salvar.');
      return false;
    }

    const payload = {
      ...values,
      modelo: modelos.find((m) => m.id === values.modelo.id),
      materiasPrimas: filteredMateriasPrimas.map((mp: any) => ({
        id: mp.id,
        quantidade: mp.quantidade,
      })),
    };

    try {
      const success = await onSubmit(payload);
      if (success) {
        onClose();
        return true;
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setSubmitting(false);
    }

    return false;
  };

  const initialValues = {
    ...productFormInitialValues(initialData),
    codigo: initialData?.codigo || '',
    modelo: { id: initialData?.modelo?.id || '' },
    qtdEstoque: initialData?.qtdEstoque ?? 0,
    preco: initialData?.preco ?? 0,
    materiasPrimas: initialData?.materiaPrima?.map((mp: any) => ({
      id: mp.materiaPrima[0]?.id || '',
      nome: mp.materiaPrima[0]?.nome || '',
      quantidade: mp.quantidade || '',
    })) || [{ id: '', quantidade: '' }],
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</span>
        <ProdutoModalHelp isEditing={isEditing} />
      </DialogTitle>
      <DialogContent>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={productFormSchema}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ values }) => (
            <Form id="product-form">
              <FormResetter open={open} />
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Field name="codigo">
                    {({ field, form }: any) => {
                      const raw = field.value || '';
                      const cleaned = raw.replace(/^P-/, '').replace(/\D/g, '');
                      const display = cleaned ? `P-${cleaned.slice(0, 6)}` : '';
                      return (
                        <TextField
                          fullWidth
                          label="Código do Produto"
                          {...field}
                          value={display}
                          onChange={(e) => {
                            const val = e.target.value;
                            const digits = val.toUpperCase().replace(/[^0-9]/g, '');
                            form.setFieldValue('codigo', digits ? `P-${digits}` : '');
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

                <Grid item xs={12} md={6}>
                  <FormField
                    name="nome"
                    label="Nome do Produto"
                    fullWidth
                    required
                    formatter="nome"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormField
                    name="descricao"
                    label="Descrição"
                    fullWidth
                    multiline
                    rows={3}
                  />
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

                <Grid item xs={12}>
                  <Field name="modelo.id">
                    {({ field, form }: any) => (
                      <Autocomplete
                        options={modelos}
                        getOptionLabel={(option) => option.nome || ''}
                        getOptionDisabled={(option) => !(option as any).ativo && !isEditing}
                        value={modelos.find((modelo) => modelo.id === field.value) || null}
                        onChange={(_, newValue) => {
                          form.setFieldValue('modelo.id', newValue ? newValue.id : '');
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Modelo"
                            error={Boolean(form.touched.modelo?.id && form.errors.modelo?.id)}
                            helperText={form.touched.modelo?.id && form.errors.modelo?.id}
                            required
                          />
                        )}
                        renderOption={(props, option) => {
                          const { key, ...otherProps } = props;
                          return (
                            <li key={`modelo-${option.id}`} {...otherProps}>
                              {option.nome}
                              {!(option as any).ativo && (
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                  (Inativo)
                                </Typography>
                              )}
                            </li>
                          );
                        }}
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Matérias-Primas
                  </Typography>
                  <FieldArray name="materiasPrimas">
                    {({ push, remove }) => (
                      <Box>
                        {values.materiasPrimas.map((_: any, index: number) => (
                          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                              <Field name={`materiasPrimas.${index}.id`}>
                                {({ field, form }: any) => (
                                  <Autocomplete
                                    options={materiasPrimas}
                                    getOptionLabel={(option) => option.nome || ''}
                                    getOptionDisabled={(option) => !(option as any).ativo && !isEditing}
                                    value={materiasPrimas.find((mp) => mp.id === field.value) || null}
                                    onChange={(_, newValue) => {
                                      form.setFieldValue(`materiasPrimas.${index}.id`, newValue ? newValue.id : '');
                                      if (newValue) {
                                        form.setFieldValue(`materiasPrimas.${index}.nome`, newValue.nome);
                                      }
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Matéria-Prima"
                                        error={Boolean(
                                          form.touched.materiasPrimas?.[index]?.id &&
                                          form.errors.materiasPrimas?.[index]?.id
                                        )}
                                        helperText={
                                          form.touched.materiasPrimas?.[index]?.id &&
                                          form.errors.materiasPrimas?.[index]?.id
                                        }
                                        required
                                      />
                                    )}
                                    renderOption={(props, option) => {
                                      const { key, ...otherProps } = props;
                                      return (
                                        <li key={`mp-${option.id}-${index}`} {...otherProps}>
                                          {option.nome}
                                          {!(option as any).ativo && (
                                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                              (Inativo)
                                            </Typography>
                                          )}
                                        </li>
                                      );
                                    }}
                                  />
                                )}
                              </Field>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Field name={`materiasPrimas.${index}.quantidade`}>
                                {({ field, form }: any) => (
                                  <NumericFormat
                                    customInput={TextField}
                                    fullWidth
                                    label="Quantidade"
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    decimalScale={2}
                                    allowNegative={false}
                                    value={field.value}
                                    onValueChange={({ floatValue }) => {
                                      form.setFieldValue(`materiasPrimas.${index}.quantidade`, floatValue ?? '');
                                    }}
                                    onBlur={() => form.setFieldTouched(`materiasPrimas.${index}.quantidade`, true)}
                                    helperText={
                                      form.touched.materiasPrimas?.[index]?.quantidade &&
                                      form.errors.materiasPrimas?.[index]?.quantidade
                                    }
                                    error={Boolean(
                                      form.touched.materiasPrimas?.[index]?.quantidade &&
                                      form.errors.materiasPrimas?.[index]?.quantidade
                                    )}
                                    isAllowed={({ floatValue }) => (floatValue ?? 0) <= 9999999}
                                    required
                                  />
                                )}
                              </Field>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <IconButton
                                onClick={() => remove(index)}
                                disabled={values.materiasPrimas.length === 1}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Grid>
                          </Grid>
                        ))}
                        <Button
                          startIcon={<Add />}
                          onClick={() => push({ id: '', quantidade: '' })}
                          variant="outlined"
                          sx={{ mt: 1 }}
                        >
                          Adicionar Matéria-Prima
                        </Button>
                      </Box>
                    )}
                  </FieldArray>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>

      <DialogActions sx={{ mt: 2 }}>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          form="product-form"
        >
          {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
