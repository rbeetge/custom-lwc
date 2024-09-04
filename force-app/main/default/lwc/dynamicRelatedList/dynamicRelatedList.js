import { LightningElement, wire, track } from 'lwc';
import getContacts from '@salesforce/apex/DynamicRelatedListController.getContacts';
import updateContact from '@salesforce/apex/DynamicRelatedListController.updateContact';
import getMedicalInfo from '@salesforce/apex/DynamicRelatedListController.getMedicalInfo';
import { refreshApex } from '@salesforce/apex';

export default class DynamicRelatedList extends LightningElement {
    @track contacts;
    @track draftValues = [];
    wiredContactsResult;

    columns = [
        { label: 'First Name', fieldName: 'FirstName', editable: true },
        { label: 'Last Name', fieldName: 'LastName', editable: true },
        { label: 'Email', fieldName: 'Email', editable: true, type: 'email' },
        { label: 'Phone', fieldName: 'Phone', editable: true, type: 'phone' },
        { label: 'Medical Info', fieldName: 'Medical_Info__c', editable: true, type: 'link' },
    ];

    @wire(getContacts)
    wiredContacts(result) {
        this.wiredContactsResult = result;
        if (result.data) {
            this.contacts = result.data;
        } else if (result.error) {
            console.error(result.error);
        }
    }

    handleSave(event) {
        const updatedFields = event.detail.draftValues;

        const promises = updatedFields.map(record => updateContact({ contact: record }));

        Promise.all(promises)
            .then(() => {
                this.draftValues = [];
                return refreshApex(this.wiredContactsResult);
            })
            .catch(error => {
                console.error('Error updating records', error);
            });
    }

    handleAddContact() {
        const newContact = { FirstName: '', LastName: '', Email: '', Phone: '', Medical_Info__c: '', isNew: true };
        this.contacts = [newContact, ...this.contacts];
    }

    handleRefresh() {
        refreshApex(this.wiredContactsResult);
    }
}