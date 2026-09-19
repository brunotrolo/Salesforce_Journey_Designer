import LightningModal from 'lightning/modal';

/**
 * Demo modal component that extends LightningModal.
 * Opened imperatively via DemoModal.open({ label: '...', size: 'medium' }).
 * Use for demonstrating modal header, body, and footer with Lightning Base Components.
 */
export default class DemoModal extends LightningModal {
    handleCancel() {
        this.close();
    }

    handleConfirm() {
        this.close('confirmed');
    }
}
