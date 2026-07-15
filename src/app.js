/* ==========================================================
   ENGINE DO CONTROLE DE ESTOQUE FARMACÊUTICO - PHARMASTOCK
   ========================================================== */

// DADOS MOCKADOS INICIAIS (BASEADOS NO SCHEMA SQL)
const DEFAULTS_FORNECEDORES = [
    { id: 1, nome_fantasia: "MedSul Distribuidora", razao_social: "MedSul Distribuidora de Medicamentos Ltda", cnpj: "12.345.678/0001-90", telefone: "(11) 3344-5566", email: "contato@medsul.com.br", endereco: "Av. Paulista, 1000 - São Paulo/SP" },
    { id: 2, nome_fantasia: "Eurofarma Insumos", razao_social: "Eurofarma Laboratórios S.A.", cnpj: "61.190.096/0001-92", telefone: "(11) 5643-2000", email: "insumos@eurofarma.com", endereco: "Rodovia Pres. Castelo Branco, Km 35 - Itapevi/SP" },
    { id: 3, nome_fantasia: "BioPharma", razao_social: "BioPharma Química e Farmacêutica Ltda", cnpj: "98.765.432/0001-10", telefone: "(21) 2233-4455", email: "vendas@biopharma.com", endereco: "Rua das Flores, 450 - Rio de Janeiro/RJ" }
];

const DEFAULTS_PRODUTOS = [
    { id: 1, nome: "Dipirona Monoidratada 500mg", principio_ativo: "Dipirona", lote: "DIP2026-A", data_validade: "2027-12-31", estoque_atual: 150, estoque_minimo: 50, preco_unitario: 1.20, id_fornecedor: 1 },
    { id: 2, nome: "Paracetamol 750mg", principio_ativo: "Paracetamol", lote: "PAR2026-B", data_validade: "2026-11-15", estoque_atual: 8, estoque_minimo: 20, preco_unitario: 1.80, id_fornecedor: 1 },
    { id: 3, nome: "Amoxicilina 500mg", principio_ativo: "Amoxicilina", lote: "AMX2026-C", data_validade: "2026-04-10", estoque_atual: 80, estoque_minimo: 15, preco_unitario: 4.50, id_fornecedor: 2 },
    { id: 4, nome: "Cloridrato de Metformina 850mg", principio_ativo: "Metformina", lote: "MET2026-D", data_validade: "2026-09-01", estoque_atual: 200, estoque_minimo: 30, preco_unitario: 0.90, id_fornecedor: 3 },
    { id: 5, nome: "Ibuprofeno 600mg", principio_ativo: "Ibuprofeno", lote: "IBU2026-E", data_validade: "2028-01-20", estoque_atual: 120, estoque_minimo: 25, preco_unitario: 2.10, id_fornecedor: 1 }
];

const DEFAULTS_MOVIMENTACOES = [
    { id: 1, id_produto: 1, tipo: "ENTRADA", quantidade: 200, data_movimentacao: "2026-01-10T09:00:00.000Z", motivo: "Compra inicial de Lote" },
    { id: 2, id_produto: 1, tipo: "SAIDA", quantidade: 50, data_movimentacao: "2026-02-15T14:30:00.000Z", motivo: "Distribuição para filiais" },
    { id: 3, id_produto: 2, tipo: "ENTRADA", quantidade: 10, data_movimentacao: "2026-03-01T10:00:00.000Z", motivo: "Ajuste de estoque físico" },
    { id: 4, id_produto: 2, tipo: "SAIDA", quantidade: 2, data_movimentacao: "2026-03-10T16:15:00.000Z", motivo: "Descarte de lote danificado" },
    { id: 5, id_produto: 3, tipo: "ENTRADA", quantidade: 80, data_movimentacao: "2026-04-01T11:00:00.000Z", motivo: "Importação direta" }
];

// INICIALIZADOR DE BANCO DE DADOS LOCAL
function initLocalStorageDB() {
    if (!localStorage.getItem("p_fornecedores")) localStorage.setItem("p_fornecedores", JSON.stringify(DEFAULTS_FORNECEDORES));
    if (!localStorage.getItem("p_produtos")) localStorage.setItem("p_produtos", JSON.stringify(DEFAULTS_PRODUTOS));
    if (!localStorage.getItem("p_movimentacoes")) localStorage.setItem("p_movimentacoes", JSON.stringify(DEFAULTS_MOVIMENTACOES));
}

initLocalStorageDB();

// GETTERS E SETTERS DO BANCO
const db = {
    getFornecedores: () => JSON.parse(localStorage.getItem("p_fornecedores")),
    getProdutos: () => JSON.parse(localStorage.getItem("p_produtos")),
    getMovimentacoes: () => JSON.parse(localStorage.getItem("p_movimentacoes")),
    
    saveFornecedores: (dados) => localStorage.setItem("p_fornecedores", JSON.stringify(dados)),
    saveProdutos: (dados) => localStorage.setItem("p_produtos", JSON.stringify(dados)),
    saveMovimentacoes: (dados) => localStorage.setItem("p_movimentacoes", JSON.stringify(dados))
};

// ESTADO GLOBAL DA INTERFACE
let currentTab = "dashboard";

// ----------------- NAVEGAÇÃO DE ABAS -----------------
function switchTab(tabId) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
    
    document.getElementById(`tab-${tabId}`).classList.add("active");
    
    // Encontrar botão correto para ativar
    const items = document.querySelectorAll(".menu-item");
    items.forEach(btn => {
        if (btn.getAttribute("onclick").includes(tabId)) {
            btn.classList.add("active");
        }
    });

    // Atualiza cabeçalho
    const titles = {
        "dashboard": "Dashboard Operacional",
        "produtos": "Gestão de Medicamentos & Insumos",
        "fornecedores": "Fornecedores Cadastrados",
        "movimentacoes": "Histórico de Movimentações"
    };
    const subtitles = {
        "dashboard": "Visão geral de conformidade legal e alertas de validade (2026)",
        "produtos": "Consulte estoque atual, validade de lotes e gere novos registros",
        "fornecedores": "Gerencie a carteira de laboratórios e distribuidoras parceiras",
        "movimentacoes": "Controle rígido de entradas e saídas de lotes cadastrados"
    };
    
    document.getElementById("page-title").innerText = titles[tabId];
    document.getElementById("page-subtitle").innerText = subtitles[tabId];
    
    currentTab = tabId;
    renderAll();
}

// ----------------- FORMATADORES -----------------
function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function formatarDataHora(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const min = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
}

// ----------------- RENDERERS -----------------
function renderAll() {
    renderDashboard();
    renderProdutos();
    renderFornecedores();
    renderMovimentacoes();
    populaSelects();
}

function renderDashboard() {
    const produtos = db.getProdutos();
    const fornecedores = db.getFornecedores();
    const movimentacoes = db.getMovimentacoes();
    
    // 1. Atualizar contadores
    document.getElementById("stat-total-produtos").innerText = produtos.length;
    document.getElementById("stat-fornecedores").innerText = fornecedores.length;
    
    // Contagem de estoque crítico
    const criticos = produtos.filter(p => p.estoque_atual < p.estoque_minimo).length;
    document.getElementById("stat-estoque-critico").innerText = criticos;
    
    // Contagem de vencidos ou próximos (vencimento em menos de 90 dias com base no ano atual de 2026)
    // Usando como ponto no tempo: 2026-07-14 (Data de Execução)
    const hoje = new Date("2026-07-14");
    let vencidosOuProximos = 0;
    
    produtos.forEach(p => {
        const dValidade = new Date(p.data_validade);
        const diffTempo = dValidade - hoje;
        const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));
        if (diffDias <= 90) {
            vencidosOuProximos++;
        }
    });
    
    document.getElementById("stat-vencidos").innerText = vencidosOuProximos;

    // 2. Tabela de Alertas de Validade no Dashboard
    const validadeTable = document.getElementById("table-alertas-validade");
    // Filtrar produtos ordenando pelo vencimento mais próximo
    const produtosOrdenadosValidade = [...produtos].sort((a,b) => new Date(a.data_validade) - new Date(b.data_validade));
    
    validadeTable.innerHTML = produtosOrdenadosValidade.slice(0, 5).map(p => {
        const dValidade = new Date(p.data_validade);
        const diffTempo = dValidade - hoje;
        const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));
        
        let statusBadge = "";
        if (diffDias < 0) {
            statusBadge = `<span class="badge badge-red">VENCIDO (${Math.abs(diffDias)}d)</span>`;
        } else if (diffDias <= 90) {
            statusBadge = `<span class="badge badge-yellow">ALERTA CRÍTICO (${diffDias}d)</span>`;
        } else {
            statusBadge = `<span class="badge badge-green">Regular</span>`;
        }

        return `
            <tr>
                <td><strong>${p.nome}</strong></td>
                <td><code>${p.lote}</code></td>
                <td>${formatarData(p.data_validade)}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join("");

    // 3. Tabela de Últimas Movimentações no Dashboard
    const ultimasMovTable = document.getElementById("table-ultimas-movimentacoes");
    const ultimasMovs = [...movimentacoes].sort((a,b) => new Date(b.data_movimentacao) - new Date(a.data_movimentacao)).slice(0, 5);
    
    ultimasMovTable.innerHTML = ultimasMovs.map(m => {
        const prod = produtos.find(p => p.id === m.id_produto) || { nome: "Inexistente" };
        const badgeClass = m.tipo === "ENTRADA" ? "badge-green" : "badge-red";
        return `
            <tr>
                <td>${formatarDataHora(m.data_movimentacao)}</td>
                <td><strong>${prod.nome}</strong></td>
                <td><span class="badge ${badgeClass}">${m.tipo}</span></td>
                <td>${m.quantidade} un</td>
            </tr>
        `;
    }).join("");
}

function renderProdutos(filtro = "") {
    const listContainer = document.getElementById("table-produtos-body");
    const produtos = db.getProdutos();
    const fornecedores = db.getFornecedores();
    const hoje = new Date("2026-07-14");
    
    let produtosFiltrados = produtos;
    if (filtro.trim() !== "") {
        const fLower = filtro.toLowerCase();
        produtosFiltrados = produtos.filter(p => p.nome.toLowerCase().includes(fLower) || p.principio_ativo.toLowerCase().includes(fLower));
    }
    
    listContainer.innerHTML = produtosFiltrados.map(p => {
        const fornecedor = fornecedores.find(f => f.id === p.id_fornecedor) || { nome_fantasia: "Desconhecido" };
        
        // Verificação para alertas visuais na linha
        let alertClass = "";
        let alertIcon = "";
        
        const dValidade = new Date(p.data_validade);
        const diffTempo = dValidade - hoje;
        const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));
        
        if (diffDias < 0) {
            alertClass = 'style="background-color: var(--red-light);"';
            alertIcon = '<i class="fa-solid fa-hourglass-end text-red" title="Produto Vencido RDC Anvisa"></i> ';
        } else if (p.estoque_actual < p.estoque_minimo || p.estoque_atual < p.estoque_minimo) {
            alertClass = 'style="background-color: var(--yellow-light);"';
            alertIcon = '<i class="fa-solid fa-triangle-exclamation text-yellow" title="Abaixo do estoque de segurança"></i> ';
        }

        return `
            <tr ${alertClass}>
                <td>${p.id}</td>
                <td>${alertIcon}<strong>${p.nome}</strong></td>
                <td>${p.principio_ativo}</td>
                <td><code>${p.lote}</code></td>
                <td>${formatarData(p.data_validade)}</td>
                <td>
                    <strong>${p.estoque_atual}</strong> 
                    <span style="font-size: 0.8rem; color: var(--text-muted)">(Mín: ${p.estoque_minimo})</span>
                </td>
                <td>${formatarMoeda(p.preco_unitario)}</td>
                <td>${fornecedor.nome_fantasia}</td>
                <td>
                    <button class="btn-icon btn-delete" onclick="deletarProduto(${p.id})" title="Deletar">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function renderFornecedores(filtro = "") {
    const listContainer = document.getElementById("table-fornecedores-body");
    const fornecedores = db.getFornecedores();
    
    let fornecedoresFiltrados = fornecedores;
    if (filtro.trim() !== "") {
        const fLower = filtro.toLowerCase();
        fornecedoresFiltrados = fornecedores.filter(f => f.nome_fantasia.toLowerCase().includes(fLower) || f.cnpj.includes(fLower));
    }
    
    listContainer.innerHTML = fornecedoresFiltrados.map(f => {
        return `
            <tr>
                <td>${f.id}</td>
                <td><strong>${f.nome_fantasia}</strong></td>
                <td>${f.razao_social}</td>
                <td><code>${f.cnpj}</code></td>
                <td>${f.telefone || "Não cadastrado"}</td>
                <td>${f.email || "Não cadastrado"}</td>
                <td>
                    <button class="btn-icon btn-delete" onclick="deletarFornecedor(${f.id})" title="Deletar">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function renderMovimentacoes(filtro = "") {
    const listContainer = document.getElementById("table-movimentacoes-body");
    const movimentacoes = db.getMovimentacoes();
    const produtos = db.getProdutos();
    
    // Filtragem por medicamento
    let movsFiltradas = movimentacoes;
    if (filtro.trim() !== "") {
        const fLower = filtro.toLowerCase();
        movsFiltradas = movimentacoes.filter(m => {
            const p = produtos.find(prod => prod.id === m.id_produto);
            return p && p.nome.toLowerCase().includes(fLower);
        });
    }

    // Ordenar por data mais recente
    movsFiltradas.sort((a,b) => new Date(b.data_movimentacao) - new Date(a.data_movimentacao));

    listContainer.innerHTML = movsFiltradas.map(m => {
        const prod = produtos.find(p => p.id === m.id_produto) || { nome: "Removido", lote: "-" };
        const badgeClass = m.tipo === "ENTRADA" ? "badge-green" : "badge-red";
        return `
            <tr>
                <td>${m.id}</td>
                <td>${formatarDataHora(m.data_movimentacao)}</td>
                <td><strong>${prod.nome}</strong></td>
                <td><code>${prod.lote}</code></td>
                <td><span class="badge ${badgeClass}">${m.tipo}</span></td>
                <td><strong>${m.quantidade} un</strong></td>
                <td>${m.motivo}</td>
            </tr>
        `;
    }).join("");
}

// popula os selects dinâmicos em cadastros
function populaSelects() {
    const fornecedores = db.getFornecedores();
    const produtos = db.getProdutos();
    
    // Select de fornecedor no form de produto
    const pFornecedorSelect = document.getElementById("p-fornecedor");
    pFornecedorSelect.innerHTML = `<option value="">Selecione...</option>` + fornecedores.map(f => {
        return `<option value="${f.id}">${f.nome_fantasia}</option>`;
    }).join("");

    // Select de produto no form de movimentação
    const mProdutoSelect = document.getElementById("m-produto");
    mProdutoSelect.innerHTML = `<option value="">Selecione...</option>` + produtos.map(p => {
        return `<option value="${p.id}">${p.nome} (Lote: ${p.lote})</option>`;
    }).join("");
}


// ----------------- FILTROS DIGITAIS (REAL TIME) -----------------
function filtrarProdutos() {
    const val = document.getElementById("search-produtos").value;
    renderProdutos(val);
}

function filtrarFornecedores() {
    const val = document.getElementById("search-fornecedores").value;
    renderFornecedores(val);
}

function filtrarMovimentacoes() {
    const val = document.getElementById("search-movimentacoes").value;
    renderMovimentacoes(val);
}


// ----------------- CADASTROS (GRAVAÇÕES) -----------------
function salvarProduto(event) {
    event.preventDefault();
    const produtos = db.getProdutos();
    
    const novo = {
        id: produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1,
        nome: document.getElementById("p-nome").value.trim(),
        principio_ativo: document.getElementById("p-principio").value.trim(),
        lote: document.getElementById("p-lote").value.trim(),
        data_validade: document.getElementById("p-validade").value,
        estoque_atual: Number(document.getElementById("p-estoque").value),
        estoque_minimo: Number(document.getElementById("p-minimo").value),
        preco_unitario: Number(document.getElementById("p-preco").value),
        id_fornecedor: Number(document.getElementById("p-fornecedor").value)
    };
    
    // Registra entrada inicial se tiver estoque_atual > 0
    if (novo.estoque_atual > 0) {
        const movimentacoes = db.getMovimentacoes();
        movimentacoes.push({
            id: movimentacoes.length > 0 ? Math.max(...movimentacoes.map(m => m.id)) + 1 : 1,
            id_produto: novo.id,
            tipo: "ENTRADA",
            quantidade: novo.estoque_atual,
            data_movimentacao: new Date().toISOString(),
            motivo: "Ajuste / Estoque de cadastro inicial"
        });
        db.saveMovimentacoes(movimentacoes);
    }

    produtos.push(novo);
    db.saveProdutos(produtos);
    
    fecharModal("modal-produto");
    document.getElementById("form-produto").reset();
    renderAll();
}

function salvarFornecedor(event) {
    event.preventDefault();
    const fornecedores = db.getFornecedores();
    
    const novo = {
        id: fornecedores.length > 0 ? Math.max(...fornecedores.map(f => f.id)) + 1 : 1,
        nome_fantasia: document.getElementById("f-nome").value.trim(),
        razao_social: document.getElementById("f-razao").value.trim(),
        cnpj: document.getElementById("f-cnpj").value.trim(),
        telefone: document.getElementById("f-tel").value.trim(),
        email: document.getElementById("f-email").value.trim(),
        endereco: document.getElementById("f-endereco").value.trim()
    };
    
    fornecedores.push(novo);
    db.saveFornecedores(fornecedores);
    
    fecharModal("modal-fornecedor");
    document.getElementById("form-fornecedor").reset();
    renderAll();
}

function salvarMovimentacao(event) {
    event.preventDefault();
    
    const produtos = db.getProdutos();
    const movimentacoes = db.getMovimentacoes();
    
    const idProduto = Number(document.getElementById("m-produto").value);
    const tipo = document.getElementById("m-tipo").value;
    const qtd = Number(document.getElementById("m-qtd").value);
    const motivo = document.getElementById("m-motivo").value.trim();
    
    // Validar e alterar estoque atual
    const pIndex = produtos.findIndex(p => p.id === idProduto);
    if (pIndex === -1) return;
    
    if (tipo === "SAIDA" && produtos[pIndex].estoque_atual < qtd) {
        alert("Operação bloqueada! Saldo em estoque insuficiente para esta saída.");
        return;
    }
    
    // Atualizar estoque no cadastro do produto
    if (tipo === "ENTRADA") {
        produtos[pIndex].estoque_atual += qtd;
    } else {
        produtos[pIndex].estoque_atual -= qtd;
    }
    
    const novaMov = {
        id: movimentacoes.length > 0 ? Math.max(...movimentacoes.map(m => m.id)) + 1 : 1,
        id_produto: idProduto,
        tipo: tipo,
        quantidade: qtd,
        data_movimentacao: new Date().toISOString(),
        motivo: motivo
    };
    
    movimentacoes.push(novaMov);
    
    db.saveProdutos(produtos);
    db.saveMovimentacoes(movimentacoes);
    
    fecharModal("modal-movimentacao");
    document.getElementById("form-movimentacao").reset();
    renderAll();
}

// ----------------- REMOÇÕES DE REGISTROS -----------------
function deletarProduto(id) {
    if (confirm("Atenção! Excluir este produto também apagará todas as suas movimentações de estoque. Confirmar?")) {
        let produtos = db.getProdutos();
        let movimentacoes = db.getMovimentacoes();
        
        produtos = produtos.filter(p => p.id !== id);
        movimentacoes = movimentacoes.filter(m => m.id_produto !== id);
        
        db.saveProdutos(produtos);
        db.saveMovimentacoes(movimentacoes);
        renderAll();
    }
}

function deletarFornecedor(id) {
    const produtos = db.getProdutos();
    const associado = produtos.some(p => p.id_fornecedor === id);
    
    if (associado) {
        alert("Operação Bloqueada! Este fornecedor possui medicamentos vinculados ativos no estoque.");
        return;
    }
    
    if (confirm("Tem certeza que deseja descredenciar este fornecedor do sistema?")) {
        let fornecedores = db.getFornecedores();
        fornecedores = fornecedores.filter(f => f.id !== id);
        db.saveFornecedores(fornecedores);
        renderAll();
    }
}


// ----------------- EVENTOS DE MODAL -----------------
function abrirModal(id) {
    document.getElementById(id).classList.add("active");
}

function fecharModal(id) {
    document.getElementById(id).classList.remove("active");
}

// INICIALIZADOR DA APLICAÇÃO
document.addEventListener("DOMContentLoaded", () => {
    renderAll();
});
