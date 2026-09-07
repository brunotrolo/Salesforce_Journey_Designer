import { LightningElement, api } from 'lwc';

const ABAS = [
    { valor: 'TODOS', rotulo: 'Todos' },
    { valor: 'CARTAO', rotulo: 'Cartões' },
    { valor: 'CONTA', rotulo: 'Conta' },
    { valor: 'CONSORCIO', rotulo: 'Consórcio' },
    { valor: 'INVEST', rotulo: 'Investimentos' }
];

/**
 * Inventário de ativos — dono de P4.
 * Entrada: @api ativos (todas as famílias), @api selecionadoId (dono: shell,
 *   por isso a seleção sobrevive à troca de aba — Cenário 6).
 * Saída: evento `selecionar` { id }. Estado interno só da aba ativa (view).
 */
export default class VisaoAtivos extends LightningElement {
    @api ativos = [];
    @api selecionadoId = null;

    abaAtiva = 'TODOS';

    get abas() {
        const todos = this.ativos ?? [];
        return ABAS.map((aba) => {
            const itensBrutos =
                aba.valor === 'TODOS' ? todos : todos.filter((a) => a.familia === aba.valor);
            return {
                valor: aba.valor,
                rotulo: `${aba.rotulo} (${itensBrutos.length})`,
                temItens: itensBrutos.length > 0,
                itens: itensBrutos.map((a) => ({
                    ...a,
                    selecionado: a.id === this.selecionadoId,
                    classeCartao: this._classeCartao(a)
                }))
            };
        });
    }

    _classeCartao(ativo) {
        const base = 'c-ativo';
        const situacao =
            ativo.situacao === 'Ativo'
                ? 'c-ativo--ativo'
                : ativo.situacao === 'Bloqueado'
                  ? 'c-ativo--bloqueado'
                  : 'c-ativo--inativo';
        const sel = ativo.id === this.selecionadoId ? ' c-ativo_selecionado' : '';
        return `${base} ${situacao}${sel}`;
    }

    aoAtivarAba(event) {
        const valor = event.target?.value;
        if (valor) this.abaAtiva = valor;
    }

    aoSelecionar(event) {
        const id = event.currentTarget?.dataset?.id;
        if (id) this.dispatchEvent(new CustomEvent('selecionar', { detail: { id } }));
    }
}
