import { LightningElement, api } from 'lwc';

export default class BuilderHeader extends LightningElement {
    @api appName = 'Builder';
    @api documentTitle = 'Untitled';
    @api showToolbar = false;

    handleBack(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }

    handleSettings(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('settings', { bubbles: true, composed: true }));
    }

    handleSave() {
        this.dispatchEvent(new CustomEvent('save', { bubbles: true, composed: true }));
    }

    handleSaveAs() {
        this.dispatchEvent(new CustomEvent('saveas', { bubbles: true, composed: true }));
    }
}
