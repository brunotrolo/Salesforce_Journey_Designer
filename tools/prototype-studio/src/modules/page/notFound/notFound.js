import { LightningElement } from 'lwc';
import { navigate } from '../../../router';

export default class NotFound extends LightningElement {
    handleGoHome() {
        navigate('/');
    }
}
