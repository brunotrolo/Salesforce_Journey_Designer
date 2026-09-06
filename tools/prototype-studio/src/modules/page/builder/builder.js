import { LightningElement } from 'lwc';
import BuilderSettingsModal from 'ui/builderSettingsModal';

const STORAGE_KEY_PAGE_NAME = 'builder-page-name';
const DEFAULT_PAGE_NAME = 'Untitled Page';

export default class Builder extends LightningElement {
    pageName = DEFAULT_PAGE_NAME;
    showLeftPanel = true;

    get leftRailClass() {
        const base =
            'slds-panel slds-panel_docked slds-panel_docked-left slds-is-open builder-rail builder-rail_left slds-scrollable';
        return this.showLeftPanel ? base : `${base} slds-hide`;
    }

    connectedCallback() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY_PAGE_NAME);
            if (stored) this.pageName = stored;
        } catch {
            /* empty */
        }
    }

    handleBack() {
        this.dispatchEvent(
            new CustomEvent('builderexit', { bubbles: true, composed: true })
        );
    }

    toggleLeftPanel() {
        this.showLeftPanel = !this.showLeftPanel;
    }

    closeLeftPanel() {
        this.showLeftPanel = false;
    }

    handleSave() {}

    handleSaveAs() {}

    async handleSettings() {
        const result = await BuilderSettingsModal.open({
            size: 'small',
            label: 'Page Settings',
            pageName: this.pageName,
        });
        if (result === undefined) return;
        this.pageName = result || DEFAULT_PAGE_NAME;
        try {
            localStorage.setItem(STORAGE_KEY_PAGE_NAME, this.pageName);
        } catch {
            /* empty */
        }
    }
}
