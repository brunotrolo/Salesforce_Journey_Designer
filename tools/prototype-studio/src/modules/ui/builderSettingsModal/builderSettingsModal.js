import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class BuilderSettingsModal extends LightningModal {
    @api pageName = '';

    _value = '';

    connectedCallback() {
        this._value = this.pageName;
    }

    get inputValue() {
        return this._value;
    }

    handleNameChange(event) {
        this._value = event.detail.value;
    }

    handleCancel() {
        this.close();
    }

    handleSave() {
        this.close((this._value || '').trim());
    }
}
