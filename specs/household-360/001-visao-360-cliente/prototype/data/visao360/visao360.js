/**
 * Fixtures + simuladores de fetch para household-360/001 (Visão 360°).
 *
 * - Somente leitura em memória: nada aqui persiste (RN-04 — voláteis nunca
 *   gravados como cadastro).
 * - `fetchDetalheVolatil` simula o core bancário com cache client-side curto
 *   de 180s (Cenário 8) e falha determinística na 1ª consulta do consórcio
 *   do João para exercitar o retry (Cenário 9: falha → "Tentar Novamente" → sucesso).
 * - `fetchOfertas` simula o motor NBO; para o Carlos a 1ª chamada falha
 *   (EL-03/RN-12: só banner + retry, sem exibir último estado).
 */

export const DOC_JOAO = '12345678900';
export const DOC_INDUSTRIA = '12ABC345000190';
export const DOC_MARIA = '11111111111';
export const DOC_CARLOS = '99999999999';
export const DOC_PADRAO = DOC_JOAO;

export const DOCUMENTOS_TESTE = [
    { doc: DOC_JOAO, descricao: 'João da Silva (PF completo + NBO top 3)' },
    { doc: DOC_INDUSTRIA, descricao: 'Indústria Exemplo S.A. (PJ, sem ofertas, abas vazias)' },
    { doc: DOC_MARIA, descricao: 'Maria Oliveira (só conta, sem ofertas)' },
    { doc: DOC_CARLOS, descricao: 'Carlos Souza (motor NBO fora na 1ª carga → retry)' }
];

export const MOTIVOS_RECUSA = [
    { label: 'Sem interesse', value: 'SEM_INTERESSE' },
    { label: 'Achou caro', value: 'ACHOU_CARO' },
    { label: 'Já possui', value: 'JA_POSSUI' }
];

const ATIVOS_JOAO = [
    {
        id: 'cartao-joao-1234',
        familia: 'CARTAO',
        rotulo: 'Cartão Visa Infinite',
        identificador: 'final 1234 • Titular João',
        situacao: 'Ativo',
        icone: 'utility:card_details'
    },
    {
        id: 'cartao-joao-3456',
        familia: 'CARTAO',
        rotulo: 'Cartão Mastercard Black',
        identificador: 'final 3456 • Titular João',
        situacao: 'Bloqueado',
        icone: 'utility:card_details'
    },
    {
        id: 'cartao-joao-9012',
        familia: 'CARTAO',
        rotulo: 'Cartão Visa Gold',
        identificador: 'final 9012 • Adicional Maria',
        situacao: 'Cancelado',
        icone: 'utility:card_details'
    },
    {
        id: 'conta-joao-1',
        familia: 'CONTA',
        rotulo: 'Conta Digital',
        identificador: 'Ag 0001 • C/C 12345-6',
        situacao: 'Ativo',
        icone: 'custom:custom16'
    },
    {
        id: 'consorcio-joao-1',
        familia: 'CONSORCIO',
        rotulo: 'Consórcio Imóvel',
        identificador: 'Grupo 1234 • Cota 045',
        situacao: 'Ativo',
        icone: 'utility:contract_doc'
    },
    {
        id: 'consorcio-joao-2',
        familia: 'CONSORCIO',
        rotulo: 'Consórcio Veículo',
        identificador: 'Grupo 5678 • Cota 012',
        situacao: 'Encerrado',
        icone: 'utility:contract_doc'
    },
    {
        id: 'invest-joao-1',
        familia: 'INVEST',
        rotulo: 'CDB Porto Bank',
        identificador: 'Pós-fixado • 102% do CDI',
        situacao: 'Ativo',
        icone: 'standard:investment_account'
    },
    {
        id: 'invest-joao-2',
        familia: 'INVEST',
        rotulo: 'Fundo de Ações Dividendos',
        identificador: 'Renda variável • +18,3% em 12m',
        situacao: 'Ativo',
        icone: 'standard:investment_account'
    }
];

const DETALHES_VOLATEIS = {
    'cartao-joao-1234': {
        tipo: 'CARTAO',
        limiteTotal: 'R$ 28.000',
        limiteDisponivel: 'R$ 19.450',
        faturaAtual: 'R$ 3.210,45',
        vencimento: '10/09/2026',
        melhorDiaCompra: 'dia 02'
    },
    'cartao-joao-3456': {
        tipo: 'CARTAO',
        limiteTotal: 'R$ 42.000',
        limiteDisponivel: 'R$ 0,00 (bloqueado)',
        faturaAtual: 'R$ 1.080,20',
        vencimento: '10/09/2026',
        melhorDiaCompra: 'dia 02',
        aviso: 'Bloqueio preventivo — oriente o cliente a contatar a central.'
    },
    'cartao-joao-9012': {
        tipo: 'CARTAO',
        limiteTotal: '—',
        limiteDisponivel: '—',
        faturaAtual: '—',
        vencimento: '—',
        melhorDiaCompra: '—',
        aviso: 'Cartão cancelado — dados cadastrais em leitura reduzida.'
    },
    'conta-joao-1': {
        tipo: 'CONTA',
        saldo: 'R$ 12.480,90',
        agenciaConta: 'Ag 0001 • C/C 12345-6',
        chavesPix: ['j***@email.com (e-mail)', '(11) *****-1234 (celular)', '***.***.***-00 (CPF)']
    },
    'consorcio-joao-1': {
        tipo: 'CONSORCIO',
        grupoCota: 'Grupo 1234 • Cota 045 (Imóvel)',
        saldoDevedor: 'R$ 212.400,00',
        parcela: 'R$ 1.420/mês',
        proximaAssembleia: '18/09/2026 às 19h',
        contemplacao: 'Não contemplada'
    },
    'consorcio-joao-2': {
        tipo: 'CONSORCIO',
        grupoCota: 'Grupo 5678 • Cota 012 (Veículo)',
        saldoDevedor: 'Quitado',
        parcela: '—',
        proximaAssembleia: '—',
        contemplacao: 'Contemplada em 03/2024',
        aviso: 'Cota encerrada — dados cadastrais em leitura reduzida.'
    },
    'invest-joao-1': {
        tipo: 'INVEST',
        produto: 'CDB Porto Bank • Pós-fixado 102% do CDI',
        valorAplicado: 'R$ 18.000,00',
        rentabilidade: '+11,2% a.a.',
        vencimento: 'Vence em 12/2027'
    },
    'invest-joao-2': {
        tipo: 'INVEST',
        produto: 'Fundo de Ações Dividendos',
        valorAplicado: 'R$ 5.200,00',
        rentabilidade: '+18,3% em 12 meses',
        vencimento: 'Resgate D+2'
    },
    'conta-industria-1': {
        tipo: 'CONTA',
        saldo: 'R$ 340.900,00',
        agenciaConta: 'Ag 0007 • C/C 98765-4',
        chavesPix: ['c***@industriaexemplo.com.br (e-mail)', '**.***.***/0001-90 (CNPJ)']
    },
    'invest-industria-1': {
        tipo: 'INVEST',
        produto: 'CDB Empresarial • 104% do CDI',
        valorAplicado: 'R$ 120.000,00',
        rentabilidade: '+11,8% a.a.',
        vencimento: 'Vence em 06/2027'
    },
    'conta-maria-1': {
        tipo: 'CONTA',
        saldo: 'R$ 2.140,00',
        agenciaConta: 'Ag 0001 • C/C 54321-0',
        chavesPix: ['(11) *****-8899 (celular)']
    },
    'conta-carlos-1': {
        tipo: 'CONTA',
        saldo: 'R$ 8.020,35',
        agenciaConta: 'Ag 0003 • C/C 77777-7',
        chavesPix: ['c***@email.com (e-mail)']
    }
};

const OFERTAS_JOAO = [
    {
        id: 'nbo-black',
        produto: 'Cartão Black',
        condicao: 'Isenção de anuidade no 1º ano',
        score: 92,
        validade: '30/09/2026',
        chaveSafra: '12345678900_BLACK_2026-09'
    },
    {
        id: 'nbo-consorcio',
        produto: 'Consórcio Imóvel — lance embutido',
        condicao: 'Contemplação acelerada com lance de 20%',
        score: 81,
        validade: '30/09/2026',
        chaveSafra: '12345678900_CONSORCIO_2026-09'
    },
    {
        id: 'nbo-cdb',
        produto: 'CDB 102% do CDI',
        condicao: 'Aplicação mínima de R$ 1.000',
        score: 74,
        validade: '15/10/2026',
        chaveSafra: '12345678900_CDB_2026-09'
    }
];

const OFERTAS_CARLOS = [
    {
        id: 'nbo-carlos-1',
        produto: 'Cartão Platinum',
        condicao: 'Anuidade grátis por 6 meses',
        score: 68,
        validade: '30/09/2026',
        chaveSafra: '99999999999_PLATINUM_2026-09'
    },
    {
        id: 'nbo-carlos-2',
        produto: 'Consórcio Veículo',
        condicao: 'Primeira assembleia sem taxa',
        score: 61,
        validade: '30/09/2026',
        chaveSafra: '99999999999_CONSORCIO_2026-09'
    }
];

const CASOS_JOAO = [
    { id: 'caso-1', data: '28/08/2026', motivo: 'Dúvida sobre fatura do cartão', situacao: 'Encerrado' },
    { id: 'caso-2', data: '12/08/2026', motivo: 'Atualização cadastral', situacao: 'Encerrado' },
    { id: 'caso-3', data: '30/07/2026', motivo: 'Simulação de consórcio', situacao: 'Em andamento' }
];

const CASOS_PADRAO = [
    { id: 'caso-a', data: '20/08/2026', motivo: 'Atualização de endereço', situacao: 'Encerrado' },
    { id: 'caso-b', data: '05/08/2026', motivo: 'Extrato para imposto de renda', situacao: 'Encerrado' },
    { id: 'caso-c', data: '22/07/2026', motivo: 'Contestação de tarifa', situacao: 'Em andamento' }
];

const ARC_RESUMO_JOAO = [
    { id: 'no-joao', nome: 'João da Silva', papel: 'Titular', tipo: 'PF', doc: DOC_JOAO },
    { id: 'no-maria', nome: 'Maria da Silva', papel: 'Cônjuge', tipo: 'PF', doc: null },
    { id: 'no-pedro', nome: 'Pedro da Silva', papel: 'Dependente', tipo: 'PF', doc: null },
    { id: 'no-ana', nome: 'Ana da Silva', papel: 'Dependente', tipo: 'PF', doc: null },
    { id: 'no-industria', nome: 'Indústria Exemplo S.A.', papel: 'Empresa vinculada', tipo: 'PJ', doc: DOC_INDUSTRIA }
];

const ARC_COMPLETA_JOAO = [
    { id: 'no-joao', nome: 'João da Silva', papel: 'Titular', tipo: 'PF', doc: DOC_JOAO, nivel: 0 },
    { id: 'no-maria', nome: 'Maria da Silva', papel: 'Cônjuge', tipo: 'PF', doc: null, nivel: 1 },
    { id: 'no-pedro', nome: 'Pedro da Silva', papel: 'Dependente', tipo: 'PF', doc: null, nivel: 1 },
    { id: 'no-ana', nome: 'Ana da Silva', papel: 'Dependente', tipo: 'PF', doc: null, nivel: 1 },
    { id: 'no-industria', nome: 'Indústria Exemplo S.A.', papel: 'Empresa vinculada (sócio-administrador)', tipo: 'PJ', doc: DOC_INDUSTRIA, nivel: 1 },
    { id: 'no-coligada', nome: 'Logística Exemplo Ltda.', papel: 'Coligada da Indústria Exemplo', tipo: 'PJ', doc: null, nivel: 2 },
    { id: 'no-socio1', nome: 'Paulo Mendes', papel: 'Sócio da Indústria Exemplo (30%)', tipo: 'PF', doc: null, nivel: 2 },
    { id: 'no-contadora', nome: 'Contábil Alfa', papel: 'Representante contábil', tipo: 'PJ', doc: null, nivel: 2 },
    { id: 'no-mae', nome: 'Rosa da Silva', papel: 'Mãe (2º nível)', tipo: 'PF', doc: null, nivel: 2 }
];

const ARC_RESUMO_INDUSTRIA = [
    { id: 'no-industria', nome: 'Indústria Exemplo S.A.', papel: 'Titular (raiz)', tipo: 'PJ', doc: DOC_INDUSTRIA },
    { id: 'no-joao', nome: 'João da Silva', papel: 'Sócio-administrador', tipo: 'PF', doc: DOC_JOAO },
    { id: 'no-socio1', nome: 'Paulo Mendes', papel: 'Sócio (30%)', tipo: 'PF', doc: null },
    { id: 'no-socia2', nome: 'Fernanda Lima', papel: 'Sócia (20%)', tipo: 'PF', doc: null },
    { id: 'no-contadora', nome: 'Contábil Alfa', papel: 'Representante contábil', tipo: 'PJ', doc: null }
];

const ARC_COMPLETA_INDUSTRIA = [
    { id: 'no-industria', nome: 'Indústria Exemplo S.A.', papel: 'Titular (raiz)', tipo: 'PJ', doc: DOC_INDUSTRIA, nivel: 0 },
    { id: 'no-joao', nome: 'João da Silva', papel: 'Sócio-administrador (50%)', tipo: 'PF', doc: DOC_JOAO, nivel: 1 },
    { id: 'no-socio1', nome: 'Paulo Mendes', papel: 'Sócio (30%)', tipo: 'PF', doc: null, nivel: 1 },
    { id: 'no-socia2', nome: 'Fernanda Lima', papel: 'Sócia (20%)', tipo: 'PF', doc: null, nivel: 1 },
    { id: 'no-contadora', nome: 'Contábil Alfa', papel: 'Representante contábil', tipo: 'PJ', doc: null, nivel: 1 },
    { id: 'no-coligada', nome: 'Logística Exemplo Ltda.', papel: 'Coligada', tipo: 'PJ', doc: null, nivel: 2 },
    { id: 'no-maria', nome: 'Maria da Silva', papel: 'Cônjuge do sócio-administrador', tipo: 'PF', doc: null, nivel: 2 }
];

const ARC_RESUMO_SIMPLES = (raizNome, raizPapel, raizTipo, raizDoc) => [
    { id: 'no-raiz', nome: raizNome, papel: raizPapel, tipo: raizTipo, doc: raizDoc }
];

const ARC_COMPLETA_SIMPLES = (raizNome, raizPapel, raizTipo, raizDoc) => [
    { id: 'no-raiz', nome: raizNome, papel: raizPapel, tipo: raizTipo, doc: raizDoc, nivel: 0 }
];

const CLIENTES = {
    [DOC_JOAO]: {
        doc: DOC_JOAO,
        nome: 'João da Silva',
        tipoPessoa: 'Pessoa Física',
        documentoFormatado: '123.456.789-00',
        documentoMascarado: '***.***.***-00',
        segmento: 'Exclusivo',
        saldoConsolidado: 'R$ 127.400,00',
        alerta: 'Perfil em revisão — validação cadastral pendente (placeholder KYC)',
        perfil: {
            contato: 'joao.silva@email.com • (11) 99999-1234',
            endereco: 'Rua das Flores, 123 — Jardins, São Paulo/SP',
            rendaScore: 'Renda R$ 18.500 • Score 872 (baixo risco)',
            agenciaConta: 'Ag 0001 • C/C 12345-6 • Cliente há 8 anos'
        },
        arcResumo: ARC_RESUMO_JOAO,
        arcCompleta: ARC_COMPLETA_JOAO,
        arcTotalVinculos: 24,
        ativos: ATIVOS_JOAO,
        casos: CASOS_JOAO
    },
    [DOC_INDUSTRIA]: {
        doc: DOC_INDUSTRIA,
        nome: 'Indústria Exemplo S.A.',
        tipoPessoa: 'Pessoa Jurídica',
        documentoFormatado: '12.ABC.345/0001-90',
        documentoMascarado: '**.***.***/0001-90',
        segmento: 'Empresarial',
        saldoConsolidado: 'R$ 460.900,00',
        alerta: null,
        perfil: {
            contato: 'financeiro@industriaexemplo.com.br • (11) 3333-4444',
            endereco: 'Av. Industrial, 1500 — Barueri/SP',
            rendaScore: 'Faturamento R$ 2,4 mi/ano • Score 810',
            agenciaConta: 'Ag 0007 • C/C 98765-4 • Cliente há 5 anos'
        },
        arcResumo: ARC_RESUMO_INDUSTRIA,
        arcCompleta: ARC_COMPLETA_INDUSTRIA,
        arcTotalVinculos: 11,
        ativos: [
            {
                id: 'conta-industria-1',
                familia: 'CONTA',
                rotulo: 'Conta Empresarial',
                identificador: 'Ag 0007 • C/C 98765-4',
                situacao: 'Ativo',
                icone: 'custom:custom16'
            },
            {
                id: 'invest-industria-1',
                familia: 'INVEST',
                rotulo: 'CDB Empresarial',
                identificador: '104% do CDI',
                situacao: 'Ativo',
                icone: 'standard:investment_account'
            }
        ],
        casos: CASOS_PADRAO
    },
    [DOC_MARIA]: {
        doc: DOC_MARIA,
        nome: 'Maria Oliveira',
        tipoPessoa: 'Pessoa Física',
        documentoFormatado: '111.111.111-11',
        documentoMascarado: '***.***.***-11',
        segmento: 'Varejo',
        saldoConsolidado: 'R$ 2.140,00',
        alerta: null,
        perfil: {
            contato: 'maria.oliveira@email.com • (11) 97777-8899',
            endereco: 'Rua Azul, 45 — Centro, São Paulo/SP',
            rendaScore: 'Renda R$ 4.200 • Score 640',
            agenciaConta: 'Ag 0001 • C/C 54321-0 • Cliente há 2 anos'
        },
        arcResumo: ARC_RESUMO_SIMPLES('Maria Oliveira', 'Titular', 'PF', DOC_MARIA),
        arcCompleta: ARC_COMPLETA_SIMPLES('Maria Oliveira', 'Titular', 'PF', DOC_MARIA),
        arcTotalVinculos: 1,
        ativos: [
            {
                id: 'conta-maria-1',
                familia: 'CONTA',
                rotulo: 'Conta Digital',
                identificador: 'Ag 0001 • C/C 54321-0',
                situacao: 'Ativo',
                icone: 'custom:custom16'
            }
        ],
        casos: CASOS_PADRAO.slice(0, 2)
    },
    [DOC_CARLOS]: {
        doc: DOC_CARLOS,
        nome: 'Carlos Souza',
        tipoPessoa: 'Pessoa Física',
        documentoFormatado: '999.999.999-99',
        documentoMascarado: '***.***.***-99',
        segmento: 'Varejo',
        saldoConsolidado: 'R$ 8.020,35',
        alerta: null,
        perfil: {
            contato: 'carlos.souza@email.com • (11) 96666-7777',
            endereco: 'Rua Verde, 78 — Moema, São Paulo/SP',
            rendaScore: 'Renda R$ 7.900 • Score 705',
            agenciaConta: 'Ag 0003 • C/C 77777-7 • Cliente há 3 anos'
        },
        arcResumo: ARC_RESUMO_SIMPLES('Carlos Souza', 'Titular', 'PF', DOC_CARLOS),
        arcCompleta: ARC_COMPLETA_SIMPLES('Carlos Souza', 'Titular', 'PF', DOC_CARLOS),
        arcTotalVinculos: 1,
        ativos: [
            {
                id: 'conta-carlos-1',
                familia: 'CONTA',
                rotulo: 'Conta Digital',
                identificador: 'Ag 0003 • C/C 77777-7',
                situacao: 'Ativo',
                icone: 'custom:custom16'
            }
        ],
        casos: CASOS_PADRAO.slice(0, 2)
    }
};

/** Retorna o bloco cadastral/inventário da raiz (sem NBO — motor é consultado à parte). */
export function getVisao(docNormalizado) {
    return CLIENTES[docNormalizado] ?? null;
}

export function normalizarDocumento(valor) {
    return (valor ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// --- Simulação do motor NBO (fetch + retry; RN-12: erro nunca exibe último estado) ---

const _nboTentativas = {};

export function fetchOfertas(docNormalizado) {
    const tentativas = (_nboTentativas[docNormalizado] ?? 0) + 1;
    _nboTentativas[docNormalizado] = tentativas;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (docNormalizado === DOC_CARLOS && tentativas === 1) {
                reject({ codigo: 'NBO_FORA', mensagem: 'Motor de propensão indisponível no momento.' });
                return;
            }
            if (docNormalizado === DOC_JOAO) {
                resolve(OFFERTAS_JOAO.map((o) => ({ ...o, estado: 'elegivel' })));
                return;
            }
            if (docNormalizado === DOC_CARLOS) {
                resolve(OFERTAS_CARLOS.map((o) => ({ ...o, estado: 'elegivel' })));
                return;
            }
            resolve([]);
        }, 900);
    });
}

// --- Simulação do core bancário (voláteis sob demanda + cache 180s + falha 1x) ---

const CACHE_TTL_MS = 180 * 1000;
const _detalheCache = new Map();
const _detalheTentativas = {};

export function fetchDetalheVolatil(ativoId, { forcar = false } = {}) {
    const agora = Date.now();
    const emCache = _detalheCache.get(ativoId);
    if (!forcar && emCache && agora - emCache.ts < CACHE_TTL_MS) {
        return Promise.resolve({ ...emCache.dados, doCache: true });
    }
    const tentativas = (_detalheTentativas[ativoId] ?? 0) + 1;
    _detalheTentativas[ativoId] = tentativas;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Mock de falha parcial: 1ª consulta do consórcio do João falha (Cenário 9).
            if (ativoId === 'consorcio-joao-1' && tentativas === 1) {
                reject({ codigo: 'CORE_TIMEOUT', mensagem: 'Core bancário demorou a responder (timeout simulado).' });
                return;
            }
            const base = DETALHES_VOLATEIS[ativoId];
            if (!base) {
                reject({ codigo: 'DESCONHECIDO', mensagem: 'Ativo sem detalhe volátil no mock.' });
                return;
            }
            const dados = { ...base, atualizadoEm: new Date(), doCache: false };
            _detalheCache.set(ativoId, { dados, ts: Date.now() });
            resolve({ ...dados });
        }, 800);
    });
}

export function formatarHora(data) {
    if (!data) return '';
    const d = data instanceof Date ? data : new Date(data);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
