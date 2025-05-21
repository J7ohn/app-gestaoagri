import * as yup from 'yup';

export const culturaSchema = yup.object().shape({
  nome: yup.string().required('Nome da cultura é obrigatório'),
  variedade: yup.string().required('Variedade é obrigatória'),
  data_plantio: yup.date().required('Data de plantio é obrigatória'),
  area: yup
    .number()
    .positive('Área deve ser maior que zero')
    .required('Área é obrigatória'),
  data_colheita: yup
    .date()
    .min(
      yup.ref('data_plantio'),
      'Data de colheita deve ser posterior à data de plantio'
    )
    .required('Data de colheita é obrigatória'),
});

export const insumoSchema = yup.object().shape({
  nome: yup.string().required('Nome do insumo é obrigatório'),
  tipo: yup
    .string()
    .oneOf(['fertilizante', 'semente', 'defensivo'], 'Tipo inválido')
    .required('Tipo é obrigatório'),
  quantidade_estoque: yup
    .number()
    .min(0, 'Quantidade não pode ser negativa')
    .required('Quantidade é obrigatória'),
});

export const aplicacaoSchema = yup.object().shape({
  id_insumo: yup.number().required('Insumo é obrigatório'),
  id_cultura: yup.number().required('Cultura é obrigatória'),
  quantidade: yup
    .number()
    .positive('Quantidade deve ser maior que zero')
    .required('Quantidade é obrigatória'),
  data: yup.date().required('Data é obrigatória'),
});