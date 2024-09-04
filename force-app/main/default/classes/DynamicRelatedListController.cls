public with sharing class DynamicRelatedListController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [SELECT Id, FirstName, LastName, Email, Phone, Medical_Info__c FROM Contact LIMIT 100];
    }

    @AuraEnabled
    public static Medical_Info__c getMedicalInfo(Id medicalInfoId) {
        return [SELECT Id, Name, Allergies__c, Medication__c, Contact_Name__c FROM Medical_Info__c WHERE Id = :medicalInfoId];
    }

    @AuraEnabled
    public static void updateContact(Contact contact) {
        Contact newContact = new Contact(
            FirstName = contact.FirstName,
            LastName = contact.LastName,
            Email = contact.Email,
            Phone = contact.Phone
        );

        upsert newContact;
    }
}