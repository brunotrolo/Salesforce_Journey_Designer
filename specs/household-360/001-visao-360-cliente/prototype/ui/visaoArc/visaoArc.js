import { LightningElement, api } from 'lwc';
import VisaoArcModal from 'ui/visaoArcModal';

/**
 * Árvore de relacionamentos — dono de P3.
 * Entrada: @api nos (resumida 1º nível), @api arvore (multinível p/ o modal),
 *   @api totalVinculos, @api docAtual, @api raizNome.
 * Saída: evento `trocarraiz` { doc } — clique em nó PJ/PF vinculado troca a
 *   raiz da 360° sem voltar à busca (RN-11/EL-05). O modal é aberto aqui e
 *   devolve a troca via close() — repassada no mesmo evento.
 */
export default class VisaoArc extends LightningElement {
    @api nos = [];
    @api arvore = [];
    @api totalVinculos = 0;
    @api docAtual = null;
    @api raizNome = '';

    noSelecionadoId = null;

    get temNos() {
        return (this.nos?.length ?? 0) > 0;
    }

    get nosApresentacao() {
        return (this.nos ?? []).map((n) => ({
            ...n,
            icone: n.tipo === 'PJ' ? 'standard:account' : 'standard:contact',
            selecionado: n.id === this.noSelecionadoId,
            classeNo: n.id === this.noSelecionadoId ? 'c-arc-no c-arc-no_selecionado' : 'c-arc-no',
            dica: n.doc && n.doc !== this.docAtual ? 'Abrir Visão 360° desta empresa/pessoa' : n.papel
        }));
    }

    get noSelecionado() {
        return (this.nos ?? []).find((n) => n.id === this.noSelecionadoId) ?? null;
    }

    get notaLimite() {
        return `Resumida limitada a 5 nós de 1º nível — ${this.totalVinculos} vínculo(s) no total (RN-13).`;
    }

    aoClicarNo(event) {
        const id = event.currentTarget?.dataset?.id;
        const no = (this.nos ?? []).find((n) => n.id === id);
        if (!no) return;
        // RN-11 — nó com documento vinculado troca a raiz na hora.
        if (no.doc && no.doc !== this.docAtual) {
            this.dispatchEvent(new CustomEvent('trocarraiz', { detail: { doc: no.doc } }));
            return;
        }
        this.noSelecionadoId = this.noSelecionadoId === id ? null : id;
    }

    async aoVerArvoreCompleta() {
        const resultado = await VisaoArcModal.open({
            size: 'full',
            titulo: `Árvore completa — ${this.raizNome}`,
            raizNome: this.raizNome,
            nos: this.arvore,
            docAtual: this.docAtual,
            totalVinculos: this.totalVinculos
        });
        if (resultado?.trocarRaiz && resultado.trocarRaiz !== this.docAtual) {
            this.dispatchEvent(new CustomEvent('trocarraiz', { detail: { doc: resultado.trocarRaiz } }));
        }
    }
}
