import { LightningElement, api } from 'lwc';

/** Histórico de atendimentos — dono de P7. Lista simples, somente leitura. */
export default class VisaoHistorico extends LightningElement {
    @api casos = [];

    get temCasos() {
        return (this.casos?.length ?? 0) > 0;
    }
}
