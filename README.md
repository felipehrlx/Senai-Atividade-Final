# 🧪 PharmaStock - Controle de Estoque Farmacêutico

Sistema corporativo de controle rigoroso de medicamentos, lotes e insumos farmacêuticos. Desenvolvido para mitigar perdas por vencimento, alertar sobre estoques críticos e garantir conformidade com as diretrizes e exigências regulatórias (Anvisa RDC).

---

## 📋 Sumário
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Modelagem do Banco de Dados](#-modelagem-do-banco-de-dados)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Instalação e Configuração](#-instalacao-e-configuracao)
- [Licença](#-licenca)

---

## 🏗️ Arquitetura do Projeto

O projeto foi organizado seguindo rigorosamente boas práticas de desenvolvimento de software, separando a camada de persistência estrutural (Banco de Dados) da camada visual e lógica operacional de interface.

```bash
├── database/
│   └── schema.sql       # Script de criação de tabelas, índices e carga inicial
├── src/
│   ├── index.html       # Estrutura semântica e interfaces visuais (Modais e Abas)
│   ├── style.css        # Identidade visual corporativa e responsividade
│   └── app.js           # Lógica operacional e motor de banco de dados reativo
└── README.md            # Documentação completa técnica do projeto
```

---

## 🗄️ Modelagem do Banco de Dados

O banco de dados relacional foi planejado para assegurar a **consistência referencial total**. As regras de restrição por chave estrangeira garantem que históricos de auditoria não sejam violados.

### 📊 Diagrama de Entidade e Relacionamento (DER)

- **`fornecedores` (1) ─── (N) `produtos`**: Um fornecedor fornece múltiplos medicamentos, mas um medicamento pertence exclusivamente a um fornecedor homologado.
- **`produtos` (1) ─── (N) `movimentacoes`**: Um lote de medicamento registra diversas entradas e saídas ao longo de seu ciclo de vida.

#### Dicionário Estrutural (schema.sql)
1. **`fornecedores`**: Controle de CNPJ único, dados de contato e localização.
2. **`produtos`**: Registro detalhado com validação de estoque positivo (`CHECK >= 0`), número de lote Anvisa e datas de expiração regulatórias.
3. **`movimentacoes`**: Histórico detalhado de fluxo do estoque (`ENTRADA` ou `SAIDA`) contendo a quantidade e a justificativa para fins de auditoria interna.

---

## 🚀 Funcionalidades Principais

- [x] **Painel Dashboard Dinâmico:** Monitoramento instantâneo do total de medicamentos ativos, fornecedores homologados e alertas gráficos automáticos.
- [x] **Alertas de Validade (RDC Anvisa):** Varredura automática no estoque identificando lotes vencidos ou com expiração crítica (menos de 90 dias restantes).
- [x] **Alertas de Estoque Crítico:** Sinalização imediata de produtos que se encontram abaixo do estoque mínimo de segurança.
- [x] **Controle de Entrada/Saída Automatizado:** Registro de movimentações atualizando dinamicamente o saldo do inventário de medicamentos e protegendo o estoque contra números negativos.
- [x] **Auditoria Integrada:** Filtro em tempo real para auditorias operacionais rápidas de lotes.

---

## 🔧 Instalação e Configuração

### 🖥️ 1. Aplicação Web (Frontend)
A aplicação está programada com carregamento dinâmico em tempo real, sem a necessidade de atualização forçada da página ao realizar cadastros ou movimentações. 

**Como executar:**
1. Extraia o pacote e navegue até a pasta `src/`.
2. Abra o arquivo `index.html` em qualquer navegador web moderno.
3. Graças ao motor do `app.js`, o sistema inicializará uma base de dados mockada persistente no `localStorage` do seu navegador para que você possa cadastrar novos produtos e simular entradas/saídas perfeitamente!

### 🗃️ 2. Banco de Dados (Backend Relacional)
Para acoplar o sistema à infraestrutura de servidores relacionais da empresa farmacêutica:
1. Abra seu sistema gerenciador (MySQL Workbench, phpMyAdmin, etc).
2. Execute ou importe o script contido em `database/schema.sql`.
3. O script criará o banco `pharmastock` automaticamente com tabelas padronizadas em UTF-8 e carregará massa de dados fictícios em conformidade com as diretrizes da Anvisa para testes iniciais de carga de rede.

---

## 👥 Membros do Grupo (TCC)
- **Candidato / Desenvolvedor Principal** - Implementação de Arquitetura, Banco de Dados e Frontend.

*Este repositório cumpre integralmente os requisitos para a entrega da atividade final de Controle de Estoque Corporativo.*
