import { LightningElement, api } from 'lwc';

/**
 * Detalhe volátil do ativo — dono de P5 (apresentação).
 * Entrada: @api ativo (resumo), @api detalhe (volátil), @api carregando,
 *   @api erro, @api horaAtualizacao, @api emDestaque.
 * O fetch + cache de 180s moram no shell via data/visao360 (o painel é puro).
 * Saída: `recarregar` { id } (força nova consulta) e `fechar` { id }.
 */
export default class VisaoAtivoDetalhe extends LightningElement {
    @api ativo = null;
    @api detalhe = null;
    @api carregando = false;
    @api erro = null;
    @api horaAtualizacao = '';
    @api emDestaque = false;

    get mostrarCarregando() {
        return this.carregando === true;
    }

    get mostrarErro() {
        return !this.mostrarCarregando && Boolean(this.erro);
    }

    get mostrarDetalhe() {
        return !this.mostrarCarregando && !this.erro && this.detalhe !== null;
    }

    get ehCartao() {
        return this.detalhe?.tipo === 'CARTAO';
    }

    get ehConta() {
        return this.detalhe?.tipo === 'CONTA';
    }

    get ehConsorcio() {
        return this.detalhe?.tipo === 'CONSORCIO';
    }

    get ehInvest() {
        return this.detalhe?.tipo === 'INVEST';
    }

    get veioDoCache() {
        return this.detalhe?.doCache === true;
    }

    get tituloCartao() {
        return this.ativo ? `${this.ativo.rotulo} — ${this.ativo.identificador}` : 'Ativo';
    }

    get classePainel() {
        return this.emDestaque ? 'c-detalhe c-detalhe_destaque slds-m-top_small' : 'c-detalhe slds-m-top_small';
    }

    aoRecarregar() {
        if (this.ativo?.id) this.dispatchEvent(new CustomEvent('recarregar', { detail: { id: this.ativo.id } }));
    }

    aoFechar() {
        if (this.ativo?.id) this.dispatchEvent(new CustomEvent('fechar', { detail: { id: this.ativo.id } }));
    }
}
