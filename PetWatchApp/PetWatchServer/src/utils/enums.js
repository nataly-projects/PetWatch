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

module.exports = {
    PetSpecies, 
    VaccineRecordType,
    ExpenseCategory,
    RoutineCareActivity
};

