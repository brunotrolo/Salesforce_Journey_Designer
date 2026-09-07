import LightningModal from 'lightning/modal';
import { api } from 'lwc';

/**
 * Modal tela-cheia da árvore completa (Cenário 5).
 * Estende lightning/modal (referência: ui/demoModal do kit).
 * Todo dado recebido via Modal.open() tem @api correspondente (regra C):
 * titulo, raizNome, nos, docAtual, totalVinculos.
 * Retorno via close(): { trocarRaiz: doc } quando um nó vinculado é acionado,
 * ou undefined ao fechar sem troca.
 */
export default class VisaoArcModal extends LightningModal {
    @api titulo = 'Árvore completa';
    @api raizNome = '';
    @api nos = [];
    @api docAtual = null;
    @api totalVinculos = 0;

    noSelecionadoId = null;

    get nosApresentacao() {
        return (this.nos ?? []).map((n) => ({
            ...n,
            icone: n.tipo === 'PJ' ? 'standard:account' : 'standard:contact',
            selecionado: n.id === this.noSelecionadoId,
            vinculado: Boolean(n.doc && n.doc !== this.docAtual),
            classeNo:
                n.id === this.noSelecionadoId
                    ? `c-arvore-no c-arvore-no_selecionado c-arvore-no_nivel-${n.nivel ?? 0}`
                    : `c-arvore-no c-arvore-no_nivel-${n.nivel ?? 0}`
        }));
    }

    get noSelecionado() {
        return (this.nos ?? []).find((n) => n.id === this.noSelecionadoId) ?? null;
    }

    get noSelecionadoVinculado() {
        const no = this.noSelecionado;
        return Boolean(no?.doc && no.doc !== this.docAtual);
    }

    get notaPaginacao() {
        return `Exibindo ${this.nos?.length ?? 0} nó(s) de ${this.totalVinculos} vínculo(s) — completa limitada a 20 nós, com paginação além disso (RN-13).`;
    }

    aoSelecionarNo(event) {
        const id = event.currentTarget?.dataset?.id;
        if (id) this.noSelecionadoId = this.noSelecionadoId === id ? null : id;
    }

    aoTrocarRaiz() {
        const no = this.noSelecionado;
        if (no?.doc) this.close({ trocarRaiz: no.doc });
    }

    aoFechar() {
        this.close(undefined);
    }
}
