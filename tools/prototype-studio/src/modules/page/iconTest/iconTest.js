import { LightningElement } from 'lwc';

const STANDARD_ICONS = [
    'account', 'contact', 'lead', 'opportunity', 'case', 'task', 'event',
    'campaign', 'dashboard', 'report', 'user', 'knowledge', 'product',
    'file', 'people', 'announcement', 'approval', 'bot', 'forecasts',
    'goals', 'hierarchy', 'orders', 'settings', 'survey',
].map(name => ({ name: `standard:${name}`, label: name }));

const UTILITY_ICONS = [
    'add', 'attach', 'check', 'close', 'copy', 'delete', 'download',
    'edit', 'email', 'error', 'favorite', 'filter', 'home', 'info',
    'link', 'lock', 'new_window', 'notification', 'refresh', 'search',
    'settings', 'share', 'success', 'warning', 'arrow_left', 'arrow_right',
    'bookmark', 'call', 'chart', 'clock', 'database', 'desktop',
    'expand', 'feed', 'help', 'image', 'key', 'list', 'logout',
    'palette', 'play', 'preview', 'print', 'redo', 'undo', 'upload',
    'user', 'video', 'world',
].map(name => ({ name: `utility:${name}`, label: name }));

const DOCTYPE_ICONS = [
    'csv', 'excel', 'image', 'pdf', 'ppt', 'txt', 'word', 'xml', 'zip',
    'attachment', 'html', 'mp4', 'gdoc', 'gsheet', 'rtf', 'video', 'unknown',
].map(name => ({ name: `doctype:${name}`, label: name }));

export default class IconTest extends LightningElement {
    renderTime = null;
    _renderStart = null;

    connectedCallback() {
        this._renderStart = performance.now();
    }

    renderedCallback() {
        if (this.renderTime === null) {
            this.renderTime = (performance.now() - this._renderStart).toFixed(1);
        }
    }

    get standardIcons() { return STANDARD_ICONS; }
    get utilityIcons()  { return UTILITY_ICONS; }
    get doctypeIcons()  { return DOCTYPE_ICONS; }

    get standardCount() { return STANDARD_ICONS.length; }
    get utilityCount()  { return UTILITY_ICONS.length; }
    get doctypeCount()  { return DOCTYPE_ICONS.length; }
    get totalCount()    { return STANDARD_ICONS.length + UTILITY_ICONS.length + DOCTYPE_ICONS.length; }

    get renderTimeLabel() {
        return this.renderTime !== null ? `${this.renderTime} ms` : '—';
    }

    get headerMeta() {
        return `${this.totalCount} icons · render time: ${this.renderTimeLabel}`;
    }

    handleBrowseIcons() {
        window.open('https://v1.lightningdesignsystem.com/icons/', '_blank');
    }
}
