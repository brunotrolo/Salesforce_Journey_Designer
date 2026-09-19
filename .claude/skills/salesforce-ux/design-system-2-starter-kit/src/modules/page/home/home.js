import { LightningElement } from 'lwc';
import Toast from 'lightning/toast';
import DemoModal from 'ui/demoModal';

export default class Home extends LightningElement {
    inputValue = '';
    checkboxGroupValues = [];
    selectedRadioValue = 'option1';
    selectedComboboxValue = 'option1';
    sliderValue = 50;
    textAreaValue = '';
    dateValue = '';
    toggleValue = false;

    get comboboxOptions() {
        return [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
        ];
    }

    get radioOptions() {
        return [
            { label: 'Radio Option 1', value: 'option1' },
            { label: 'Radio Option 2', value: 'option2' },
            { label: 'Radio Option 3', value: 'option3' },
        ];
    }

    get checkboxOptions() {
        return [
            { label: 'Checkbox Option 1', value: 'checkbox1' },
            { label: 'Checkbox Option 2', value: 'checkbox2' },
            { label: 'Checkbox Option 3', value: 'checkbox3' },
        ];
    }

    handleInputChange(event) {
        this.inputValue = event.detail.value;
    }

    handleCheckboxChange(event) {
        this.checkboxGroupValues = event.detail.value;
    }

    handleRadioChange(event) {
        this.selectedRadioValue = event.detail.value;
    }

    handleComboboxChange(event) {
        this.selectedComboboxValue = event.detail.value;
    }

    handleSliderChange(event) {
        this.sliderValue = event.detail.value;
    }

    handleTextAreaChange(event) {
        this.textAreaValue = event.detail.value;
    }

    handleDateChange(event) {
        this.dateValue = event.detail.value;
    }

    handleToggleChange(event) {
        this.toggleValue = event.detail.checked;
    }

    handleButtonClick() {
        Toast.show({ label: 'Button clicked', message: 'Base button was clicked.', variant: 'info', mode: 'dismissible' });
    }

    handleSuccessButton() {
        Toast.show({ label: 'Success', message: 'Success button was clicked.', variant: 'success', mode: 'dismissible' });
    }

    handleNeutralButton() {
        Toast.show({ label: 'Neutral', message: 'Neutral button was clicked.', variant: 'info', mode: 'dismissible' });
    }

    handleBrandButton() {
        Toast.show({ label: 'Brand', message: 'Brand button was clicked.', variant: 'info', mode: 'dismissible' });
    }

    handleDestructiveButton() {
        Toast.show({ label: 'Destructive', message: 'Destructive button was clicked.', variant: 'error', mode: 'dismissible' });
    }

    handleOpenModal() {
        DemoModal.open({
            size: 'medium',
            label: 'Demo Modal',
        });
    }
}
