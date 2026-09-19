import { LightningElement, api } from 'lwc';

export default class Panel extends LightningElement {
    @api title = '';
    @api showClose = false;

    handleClose() {
        this.dispatchEvent(
            new CustomEvent('close', { bubbles: true, composed: true })
        );
    }
}
