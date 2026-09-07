import { LightningElement, api } from 'lwc';

/** Faixa de destaques + perfil — dono de P1/P2. Somente leitura, sem eventos. */
export default class VisaoHeader extends LightningElement {
    @api cliente = null;

    get temAlerta() {
        return Boolean(this.cliente?.alerta);
    }

    get iconeTipoPessoa() {
        if (this.cliente?.tipoPessoa === 'Pessoa Jurídica') return 'standard:account';
        return 'standard:contact';
    }
}
