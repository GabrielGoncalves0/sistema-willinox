import React from 'react';
import { Typography } from '@mui/material';

export interface HelpSection {
  title: string;
  items: string[];
}

export interface HelpContentProps {
  description: string;
  sections: HelpSection[];
  additionalContent?: React.ReactNode;
}

export const HelpContent: React.FC<HelpContentProps> = ({
  description,
  sections,
  additionalContent
}) => {
  return (
    <>
      <Typography paragraph>
        {description}
      </Typography>

      {sections.map((section, index) => (
        <React.Fragment key={index}>
          <Typography paragraph>
            <strong>{section.title}:</strong>
          </Typography>
          <ul>
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </React.Fragment>
      ))}

      {additionalContent}
    </>
  );
};

export const PedidoHelpContent = {
  create: {
    description: "Nesta tela você pode cadastrar um novo pedido no sistema.",
    sections: [
      {
        title: "Campos obrigatórios",
        items: [
          "<strong>Data:</strong> Data do pedido.",
          "<strong>Cliente:</strong> Cliente que está fazendo o pedido.",
          "<strong>Produtos/Matérias-primas:</strong> Pelo menos um item deve ser adicionado ao pedido."
        ]
      },
      {
        title: "Funcionalidades",
        items: [
          "<strong>Abas:</strong> Use as abas para alternar entre produtos e matérias-primas.",
          "<strong>Entrada:</strong> Marque a opção para aplicar automaticamente 50% do valor total como entrada.",
          "<strong>Preços:</strong> Os preços são preenchidos automaticamente, mas podem ser alterados."
        ]
      }
    ]
  },
  edit: {
    description: "Nesta tela você pode editar as informações de um pedido existente.",
    sections: [
      {
        title: "Campos obrigatórios",
        items: [
          "<strong>Data:</strong> Data do pedido.",
          "<strong>Cliente:</strong> Cliente que está fazendo o pedido.",
          "<strong>Produtos/Matérias-primas:</strong> Pelo menos um item deve ser adicionado ao pedido."
        ]
      },
      {
        title: "Funcionalidades",
        items: [
          "<strong>Abas:</strong> Use as abas para alternar entre produtos e matérias-primas.",
          "<strong>Entrada:</strong> Marque a opção para aplicar automaticamente 50% do valor total como entrada.",
          "<strong>Preços:</strong> Os preços são preenchidos automaticamente, mas podem ser alterados."
        ]
      },
      {
        title: "Status do Pedido",
        items: [
          "<strong>Pendente:</strong> Pedido criado, aguardando processamento.",
          "<strong>Processando:</strong> Pedido em andamento.",
          "<strong>Concluído:</strong> Pedido finalizado.",
          "<strong>Cancelado:</strong> Pedido cancelado."
        ]
      }
    ]
  },
  page: {
    description: "Nesta seção você pode gerenciar todos os pedidos do sistema.",
    sections: [
      {
        title: "Funcionalidades disponíveis",
        items: [
          "<strong>Buscar:</strong> Use o campo de busca para encontrar pedidos específicos.",
          "<strong>Filtros:</strong> Aplique filtros para visualizar pedidos por status ou período.",
          "<strong>Excluir:</strong> Use o ícone de lixeira para remover pedidos (apenas se permitido).",
          "<strong>Visualizar:</strong> Clique em 'Detalhes' para ver informações completas do pedido."
        ]
      },
      {
        title: "Status dos Pedidos",
        items: [
          "<strong>Pendente:</strong> Pedidos criados aguardando processamento.",
          "<strong>Processando:</strong> Pedidos em andamento.",
          "<strong>Concluído:</strong> Pedidos finalizados com sucesso.",
          "<strong>Cancelado:</strong> Pedidos que foram cancelados."
        ]
      }
    ]
  }
};

export const CompraHelpContent = {
  create: {
    description: "Nesta tela você pode cadastrar uma nova compra no sistema.",
    sections: [
      {
        title: "Campos obrigatórios",
        items: [
          "<strong>Data da Compra:</strong> Data em que a compra foi realizada.",
          "<strong>Fornecedor:</strong> Fornecedor que está vendendo os materiais.",
          "<strong>Itens:</strong> Pelo menos uma matéria-prima deve ser adicionada à compra."
        ]
      },
      {
        title: "Funcionalidades",
        items: [
          "<strong>Adicionar Itens:</strong> Selecione a matéria-prima, quantidade e preço unitário.",
          "<strong>Valor Total:</strong> Calculado automaticamente com base nos itens adicionados.",
          "<strong>Preços:</strong> Os preços podem ser alterados conforme necessário."
        ]
      }
    ]
  },
  edit: {
    description: "Nesta tela você pode editar as informações de uma compra existente.",
    sections: [
      {
        title: "Campos obrigatórios",
        items: [
          "<strong>Data da Compra:</strong> Data em que a compra foi realizada.",
          "<strong>Fornecedor:</strong> Fornecedor que está vendendo os materiais.",
          "<strong>Itens:</strong> Pelo menos uma matéria-prima deve ser adicionada à compra."
        ]
      },
      {
        title: "Funcionalidades",
        items: [
          "<strong>Adicionar Itens:</strong> Selecione a matéria-prima, quantidade e preço unitário.",
          "<strong>Valor Total:</strong> Calculado automaticamente com base nos itens adicionados.",
          "<strong>Preços:</strong> Os preços podem ser alterados conforme necessário."
        ]
      },
      {
        title: "Status da Compra",
        items: [
          "<strong>Pendente:</strong> Compra criada, aguardando processamento.",
          "<strong>Finalizada:</strong> Compra concluída e estoque atualizado.",
          "<strong>Cancelada:</strong> Compra cancelada."
        ]
      }
    ]
  },
  page: {
    description: "Nesta seção você pode gerenciar todas as compras do sistema.",
    sections: [
      {
        title: "Funcionalidades disponíveis",
        items: [
          "<strong>Criar Compra:</strong> Clique no botão 'Nova Compra' para cadastrar uma nova compra.",
          "<strong>Buscar:</strong> Use o campo de busca para encontrar compras específicas.",
          "<strong>Filtros:</strong> Aplique filtros para visualizar compras por status ou período.",
          "<strong>Editar:</strong> Clique no ícone de edição para modificar uma compra existente.",
          "<strong>Excluir:</strong> Use o ícone de lixeira para remover compras (apenas se permitido).",
          "<strong>Finalizar:</strong> Finalize compras pendentes para atualizar o estoque.",
          "<strong>Cancelar:</strong> Cancele compras que não serão mais processadas."
        ]
      }
    ]
  }
};

export const ProdutoHelpContent = {
  create: {
    description: "Nesta tela você pode cadastrar um novo produto no sistema.",
    sections: [
      {
        title: "Campos obrigatórios",
        items: [
          "<strong>Código:</strong> Identificador único do produto (formato P-XXXXXX).",
          "<strong>Nome:</strong> Nome do produto que será exibido nas listagens.",
          "<strong>Preço:</strong> Valor de venda do produto.",
          "<strong>Quantidade em Estoque:</strong> Quantidade inicial disponível.",
          "<strong>Modelo:</strong> Selecione um modelo cadastrado no sistema.",
          "<strong>Matérias-Primas:</strong> Adicione pelo menos uma matéria-prima utilizada na fabricação."
        ]
      },
      {
        title: "Observações",
        items: [
          "A descrição é opcional, mas recomendada para detalhar o produto.",
          "Você pode adicionar quantas matérias-primas forem necessárias.",
          "Não é possível cadastrar matérias-primas duplicadas.",
          "O estoque será atualizado automaticamente durante a produção e vendas."
        ]
      }
    ]
  },
  edit: {
    description: "Nesta tela você pode editar as informações de um produto existente.",
    sections: [
      {
        title: "Campos obrigatórios",
        items: [
          "<strong>Código:</strong> Identificador único do produto (formato P-XXXXXX).",
          "<strong>Nome:</strong> Nome do produto que será exibido nas listagens.",
          "<strong>Preço:</strong> Valor de venda do produto.",
          "<strong>Quantidade em Estoque:</strong> Quantidade inicial disponível.",
          "<strong>Modelo:</strong> Selecione um modelo cadastrado no sistema.",
          "<strong>Matérias-Primas:</strong> Adicione pelo menos uma matéria-prima utilizada na fabricação."
        ]
      },
      {
        title: "Observações",
        items: [
          "A descrição é opcional, mas recomendada para detalhar o produto.",
          "Você pode adicionar quantas matérias-primas forem necessárias.",
          "Não é possível cadastrar matérias-primas duplicadas.",
          "O estoque será atualizado automaticamente durante a produção e vendas.",
          "Modelos e matérias-primas inativas ficam visíveis apenas durante a edição."
        ]
      }
    ]
  },
  page: {
    description: "Nesta seção você pode gerenciar todos os produtos do sistema.",
    sections: [
      {
        title: "Funcionalidades disponíveis",
        items: [
          "<strong>Criar Produto:</strong> Clique no botão 'Novo Produto' para cadastrar um novo produto.",
          "<strong>Buscar:</strong> Use o campo de busca para encontrar produtos específicos.",
          "<strong>Filtros:</strong> Aplique filtros para visualizar produtos ativos/inativos.",
          "<strong>Editar:</strong> Clique no ícone de edição para modificar um produto existente.",
          "<strong>Ativar/Desativar:</strong> Use o switch para ativar ou desativar produtos.",
          "<strong>Visualizar Estoque:</strong> Veja a quantidade disponível de cada produto."
        ]
      },
      {
        title: "Informações importantes",
        items: [
          "<strong>Código:</strong> Cada produto possui um código único no formato P-XXXXXX.",
          "<strong>Estoque:</strong> Atualizado automaticamente com produções e vendas.",
          "<strong>Fórmula:</strong> Cada produto possui uma fórmula com matérias-primas necessárias.",
          "<strong>Status:</strong> Produtos inativos não aparecem em novos pedidos ou produções."
        ]
      }
    ]
  }
};

export const ProducaoHelpContent = {
  create: {
    description: "Nesta tela você pode cadastrar uma nova produção no sistema.",
    sections: [
      {
        title: "Campos obrigatórios",
        items: [
          "<strong>Funcionário:</strong> Funcionário responsável pela produção.",
          "<strong>Produto:</strong> Produto que será produzido.",
          "<strong>Quantidade:</strong> Quantidade a ser produzida (mínimo 1).",
          "<strong>Data Início:</strong> Data de início da produção."
        ]
      },
      {
        title: "Status da Produção",
        items: [
          "<strong>Pendente:</strong> Produção criada, aguardando início.",
          "<strong>Em Andamento:</strong> Produção em execução.",
          "<strong>Concluído:</strong> Produção finalizada com sucesso.",
          "<strong>Cancelado:</strong> Produção cancelada."
        ]
      }
    ]
  },
  edit: {
    description: "Nesta tela você pode editar as informações de uma produção existente.",
    sections: [
      {
        title: "Campos obrigatórios",
        items: [
          "<strong>Funcionário:</strong> Funcionário responsável pela produção.",
          "<strong>Produto:</strong> Produto que será produzido.",
          "<strong>Quantidade:</strong> Quantidade a ser produzida (mínimo 1).",
          "<strong>Data Início:</strong> Data de início da produção."
        ]
      },
      {
        title: "Status da Produção",
        items: [
          "<strong>Pendente:</strong> Produção criada, aguardando início.",
          "<strong>Em Andamento:</strong> Produção em execução.",
          "<strong>Concluído:</strong> Produção finalizada com sucesso.",
          "<strong>Cancelado:</strong> Produção cancelada."
        ]
      },
      {
        title: "Observações para Edição",
        items: [
          "A data de fim só é preenchida quando o status é 'Concluído'.",
          "Alterar o status para 'Concluído' atualizará automaticamente o estoque.",
          "Produções canceladas não afetam o estoque."
        ]
      }
    ]
  },
  page: {
    description: "Nesta seção você pode gerenciar todas as produções do sistema.",
    sections: [
      {
        title: "Funcionalidades disponíveis",
        items: [
          "<strong>Criar Produção:</strong> Clique no botão 'Nova Produção' para cadastrar uma nova produção.",
          "<strong>Buscar:</strong> Use o campo de busca para encontrar produções específicas.",
          "<strong>Filtros:</strong> Aplique filtros para visualizar produções por status ou período.",
          "<strong>Editar:</strong> Clique no ícone de edição para modificar uma produção existente.",
          "<strong>Finalizar:</strong> Finalize produções em andamento para atualizar o estoque.",
          "<strong>Cancelar:</strong> Cancele produções que não serão mais processadas."
        ]
      },
      {
        title: "Controle de Estoque",
        items: [
          "<strong>Matérias-Primas:</strong> O estoque de matérias-primas é reduzido ao iniciar a produção.",
          "<strong>Produtos:</strong> O estoque de produtos é aumentado ao finalizar a produção.",
          "<strong>Fórmulas:</strong> O sistema verifica automaticamente se há matérias-primas suficientes."
        ]
      }
    ]
  }
};