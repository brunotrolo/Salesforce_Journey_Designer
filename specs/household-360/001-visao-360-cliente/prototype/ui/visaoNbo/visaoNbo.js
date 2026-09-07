import { LightningElement, api } from 'lwc';
import { MOTIVOS_RECUSA } from 'data/visao360';

/**
 * Painel NBO top 3 — dono de P6 (apresentação).
 * Entrada: @api ofertas (ordenadas por score), @api erro (motor fora).
 * Saída: `recusar` { ofertaId, motivo }, `contratar` { ofertaId },
 *   `tentar` (retry do motor). O estado da lista é do shell; aqui só o
 *   motivo rápido em edição (view).
 */
export default class VisaoNbo extends LightningElement {
    @api ofertas = [];
    @api erro = null;

    recusaOfertaId = null;
    motivoSelecionado = 'SEM_INTERESSE';
    opcoesMotivo = MOTIVOS_RECUSA;

    get temErro() {
        return Boolean(this.erro);
    }

    get temOfertas() {
        return !this.temErro && (this.ofertas?.length ?? 0) > 0;
    }

    get mostrarVazio() {
        return !this.temErro && (this.ofertas?.length ?? 0) === 0;
    }

    get ofertasApresentacao() {
        return (this.ofertas ?? []).map((o) => ({
            ...o,
            emNegociacao: o.estado === 'negociacao',
            recusando: o.id === this.recusaOfertaId,
            rotuloScore: `Score ${o.score}`
        }));
    }

    get podeConfirmarRecusa() {
        return Boolean(this.recusaOfertaId && this.motivoSelecionado);
    }

    aoIniciarRecusa(event) {
        const id = event.currentTarget?.dataset?.id;
        if (!id) return;
        this.recusaOfertaId = id;
        this.motivoSelecionado = 'SEM_INTERESSE';
    }

    aoCancelarRecusa() {
        this.recusaOfertaId = null;
    }

    aoTrocarMotivo(event) {
        this.motivoSelecionado = event.detail?.value ?? 'SEM_INTERESSE';
    }

    aoConfirmarRecusa() {
        if (!this.podeConfirmarRecusa) return;
        this.dispatchEvent(
            new CustomEvent('recusar', {
                detail: { ofertaId: this.recusaOfertaId, motivo: this.motivoSelecionado }
            })
        );
        this.recusaOfertaId = null;
    }

    aoContratar(event) {
        const id = event.currentTarget?.dataset?.id;
        if (id) this.dispatchEvent(new CustomEvent('contratar', { detail: { ofertaId: id } }));
    }

    aoTentar() {
        this.dispatchEvent(new CustomEvent('tentar'));
    }
}
