const PetSpecies = Object.freeze({
    MALE: 'MALE',
    FEMALE: 'FEMALE',
});

const VaccineRecordType = Object.freeze({
    DHPP: 'DHPP',
    Rabies: 'Rabies',
    VaccinationAgainstEsophagusWorms: 'Vaccination against Esophagus Worms',
    FleaAndTick: 'Flea and Tick Treatment',
    Deworming: 'Deworming',

    FVRCP: 'FVRCP',
    FeLV: 'FeLV',
    Other: 'Other'
});

const ExpenseCategory = Object.freeze({
    Food: 'Food',
    Medication: 'Medication',
    Vaccinations: 'vaccinations',
    VetVisit: 'VetVisit',
    Insurance: 'Insurance',
    RoutineCare: 'Routine Care',
    Games: 'Games',
    RelatedProducts: 'Related Products',
    HomeProducts: 'Home Products',
    Training: 'Training',
    Other: 'Other'
});

const RoutineCareActivity = Object.freeze({
    Feeding: 'Feeding',
    Training: 'Training',
    Brushing: 'Brushing',
    Bathing: 'Bathing',
    NailTrimming: 'Nail trimming',
    EarCleaning: 'Ear cleaning',
    TeethBrushing: 'Teeth brushing',
    Weighing: 'Weighing',
    Other: 'Other'
});

const ActivityLogType = Object.freeze({
    VACCINE_RECORD_ADDED: 'vaccine_record_added',
    ROUTINE_CARE_ADDED: 'routine_care_added',
    EXPENSE_ADDED: 'expense_added',
    NOTE_ADDED: 'note_added',
    PET_ADDED: 'pet_added',
    PET_EDIT: 'pet_edit',
    PET_DELETE: 'pet_delete',
    NOTE_EDIT: 'note_edit' ,
    NOTE_DELETE: 'note_delete' ,
    PROFILE_EDIT: 'profile_edit'
});

module.exports = {
    PetSpecies, 
    VaccineRecordType,
    ExpenseCategory,
    RoutineCareActivity,
    ActivityLogType
};

