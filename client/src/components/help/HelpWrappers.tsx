import React from 'react';
import ModalHelpButton from '../ModalHelpButton';
import HelpCollapse from '../HelpCollapse';
import { 
  HelpContent, 
  PedidoHelpContent, 
  CompraHelpContent, 
  ProdutoHelpContent, 
  ProducaoHelpContent 
} from './HelpContent';

interface HelpProps {
  isEditing?: boolean;
}

export const PedidoModalHelp: React.FC<HelpProps> = ({ isEditing = false }) => {
  const content = isEditing ? PedidoHelpContent.edit : PedidoHelpContent.create;
  
  return (
    <ModalHelpButton
      title={isEditing ? "Edição de Pedido" : "Cadastro de Pedido"}
      content={
        <HelpContent
          description={content.description}
          sections={content.sections}
        />
      }
    />
  );
};

export const CompraModalHelp: React.FC<HelpProps> = ({ isEditing = false }) => {
  const content = isEditing ? CompraHelpContent.edit : CompraHelpContent.create;
  
  return (
    <ModalHelpButton
      title={isEditing ? "Edição de Compra" : "Cadastro de Compra"}
      content={
        <HelpContent
          description={content.description}
          sections={content.sections}
        />
      }
    />
  );
};

export const ProdutoModalHelp: React.FC<HelpProps> = ({ isEditing = false }) => {
  const content = isEditing ? ProdutoHelpContent.edit : ProdutoHelpContent.create;
  
  return (
    <ModalHelpButton
      title={isEditing ? "Edição de Produto" : "Cadastro de Produto"}
      content={
        <HelpContent
          description={content.description}
          sections={content.sections}
        />
      }
    />
  );
};

export const ProducaoModalHelp: React.FC<HelpProps> = ({ isEditing = false }) => {
  const content = isEditing ? ProducaoHelpContent.edit : ProducaoHelpContent.create;
  
  return (
    <ModalHelpButton
      title={isEditing ? "Edição de Produção" : "Cadastro de Produção"}
      content={
        <HelpContent
          description={content.description}
          sections={content.sections}
        />
      }
    />
  );
};

export const PedidoPageHelp: React.FC = () => {
  return (
    <HelpCollapse
      title="Ajuda - Gerenciamento de Pedidos"
      content={
        <HelpContent
          description={PedidoHelpContent.page.description}
          sections={PedidoHelpContent.page.sections}
        />
      }
    />
  );
};

export const CompraPageHelp: React.FC = () => {
  return (
    <HelpCollapse
      title="Ajuda - Gerenciamento de Compras"
      content={
        <HelpContent
          description={CompraHelpContent.page.description}
          sections={CompraHelpContent.page.sections}
        />
      }
    />
  );
};

export const ProdutoPageHelp: React.FC = () => {
  return (
    <HelpCollapse
      title="Ajuda - Gerenciamento de Produtos"
      content={
        <HelpContent
          description={ProdutoHelpContent.page.description}
          sections={ProdutoHelpContent.page.sections}
        />
      }
    />
  );
};

export const ProducaoPageHelp: React.FC = () => {
  return (
    <HelpCollapse
      title="Ajuda - Gerenciamento de Produção"
      content={
        <HelpContent
          description={ProducaoHelpContent.page.description}
          sections={ProducaoHelpContent.page.sections}
        />
      }
    />
  );
};

export interface GenericHelpProps {
  title: string;
  description: string;
  sections: Array<{
    title: string;
    items: string[];
  }>;
  isModal?: boolean;
  isEditing?: boolean;
}

export const GenericHelp: React.FC<GenericHelpProps> = ({
  title,
  description,
  sections,
  isModal = false,
  isEditing = false
}) => {
  const content = (
    <HelpContent
      description={description}
      sections={sections}
    />
  );

  if (isModal) {
    return (
      <ModalHelpButton
        title={title}
        content={content}
      />
    );
  }

  return (
    <HelpCollapse
      title={title}
      content={content}
    />
  );
};
