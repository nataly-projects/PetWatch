const PetSpecies = Object.freeze({
    MALE: 'MALE',
    FEMALE: 'FEMALE',
});

const VaccineRecordType = Object.freeze({
    DHPP: 'DHPP',
    RABIES: 'Rabies',
    VACCINATION_AGAINST_ESOPHAGUS_WORMS: 'Vaccination against Esophagus Worms',
    FLEA_AND_TICK: 'Flea and Tick Treatment',
    DEWORMING: 'Deworming',

    FVRCP: 'FVRCP',
    FELV: 'FeLV',
    OTHER: 'Other'
});

const ExpenseCategory = Object.freeze({
    FOOD: 'Food',
    MEDICATION: 'Medication',
    VACCINATION: 'vaccinations',
    VET_VISIT: 'VetVisit',
    INSURANCE: 'Insurance',
    ROUTINE_CARE: 'Routine Care',
    TOYS: 'Toyes',
    RELATED_PRODUCTS: 'Related Products',
    HOME_PROUSUCTS: 'Home Products',
    TRAINING: 'Training',
    OTHER: 'Other'
});

const RoutineCareActivity = Object.freeze({
    FEEDING: 'Feeding',
    TRAINING: 'Training',
    BRUSHING: 'Brushing',
    BATHING: 'Bathing',
    NAIL_TRIMMING: 'Nail trimming',
    EAR_CLEANING: 'Ear cleaning',
    TEETH_BRUSING: 'Teeth brushing',
    WEIGHING: 'Weighing',
    OTHER: 'Other'
});

const ActivityLogType = Object.freeze({
    VACCINE_RECORD_ADDED: 'vaccine record added',
    ROUTINE_CARE_ADDED: 'routine care added',
    EXPENSE_ADDED: 'expense added',
    NOTE_ADDED: 'note added',
    PET_ADDED: 'pet added',
    PET_EDIT: 'pet edit',
    PET_WEIGHT_UPDATE: 'pet weight update',
    PET_DELETE: 'pet delete',
    NOTE_EDIT: 'note edit' ,
    NOTE_DELETE: 'note delete' ,
    PROFILE_EDIT: 'profile edit'
});

module.exports = {
    PetSpecies, 
    VaccineRecordType,
    ExpenseCategory,
    RoutineCareActivity,
    ActivityLogType
};

