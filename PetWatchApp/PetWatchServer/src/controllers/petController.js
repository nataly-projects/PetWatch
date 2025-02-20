const multer = require('multer');
const { Pet } =  require('../models/petModel');
const { User } = require('../models/userModel');
const { VaccinationRecord } = require('../models/vaccinationRecordModel');
const { RoutineCareRecord } = require('../models/routineCareRecordModel');
const { Allergy } = require('../models/allergyModel');
const { Medication } = require('../models/medicationModel');
const { VetVisit } = require('../models/vetVisitModel');
const { Note } = require('../models/noteModel');
const { Expense } = require('../models/expenseModel');
const { ActivityLog } = require('../models/activityLogModel');
const { MealPlanner } = require('../models/mealPlannerModel');
const { EmergencyContact } = require('../models/emergencyContactModel');
const { MedicalCondition } = require( '../models/MedicalConditionsModel');
const  {ActivityLogType, ActivityType, VaccineRecordType, RoutineCareActivity, ExpenseCategory } = require('../utils/enums');
const { all } = require('../routes/userRoutes');

// Set up storage configuration for single image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Set up multer instance for single image upload
const singleImageUpload = multer({ storage }).single('image');

// Set up multer instance for array of images upload
const multipleImagesUpload = multer({ storage }).array('additionalImages');



async function getPetsByUserId(req, res) {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate({
            path: 'pets',
                populate: [
                    { path: 'notes' },
                    { path: 'allergies' },
                    { path: 'medications' },
                    { path: 'vetVisits' },
                    { path: 'mealPlanner' },
                    { path: 'emergencyContacts' },
                    { path: 'medicalConditions' }
                ]
          });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
            }
        res.status(200).json(user.pets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }  
}


async function getPetById(req, res) {
    try {
        const { petId } = req.params;

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found.' });
        }
        res.status(200).json({pet});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

async function getPetData(req, res) {
    try {
        const { petId } = req.params;

        const pet = await Pet.findById(petId).populate('vaccinationRecords').populate('routineCareRecords');
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found.' });
        }
        res.status(200).json({pet});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

async function getPetVaccinationRecord (req, res) {
    try {
        const { petId } = req.params;
        const pet = await Pet.findById(petId).populate('vaccinationRecords');
        if (!pet) {
        return res.status(404).json({ error: 'Pet not found' });
        }
        res.status(200).json(pet.vaccinationRecords);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getPetRoutineCare (req, res) {

    try {
        const { petId } = req.params;

        const pet = await Pet.findById(petId).populate('routineCareRecords');
        if (!pet) {
        return res.status(404).json({ error: 'Pet not found' });
        }
        res.status(200).json(pet.routineCareRecords);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getPetNote (req, res) {

    try {
        const { petId } = req.params;

        const pet = await Pet.findById(petId).populate('notes');
        if (!pet) {
        return res.status(404).json({ error: 'Pet not found' });
        }
        res.status(200).json(pet.notes);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

  async function getPetExpense (req, res) {
    try {
        const { petId } = req.params;

        const pet = await Pet.findById(petId).populate('expenses');
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        res.status(200).json(pet.expenses);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function getPetActivityLog (req, res) {
    try {
        const { petId } = req.params;

        const activityLogs = await ActivityLog.find({ petId }).sort({ created_at: -1 })
        .populate('petId', 'name').exec();
        res.status(200).json(activityLogs);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function getPetWeightTracker (req, res) {
    try {
        const { petId } = req.params;

        const weightLogs = await ActivityLog.find({ petId, actionType: ActivityLogType.PET_WEIGHT_UPDATE });
        console.log('weightLogs: ', weightLogs);
        res.status(200).json(weightLogs);
      
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function getPetUpcomingEvents (req, res) {
    try {
        const { petId } = req.params;

        const petWithUpcomingEvents = await Pet.findById(petId).populate({
            path: 'vaccinationRecords',
            match: { nextDate: { $gte: new Date() }},
            populate: {path: 'pet',select: 'name'} 
        }).populate({
            path: 'routineCareRecords',
            match: { nextDate: { $gte: new Date() }},
            populate: {path: 'pet',select: 'name'} 
        }).populate({
            path: 'vetVisits',
            match: { date: { $gte: new Date() }},
            populate: {path: 'pet',select: 'name'} 
        });

        console.log('petWithUpcomingEvents: ', petWithUpcomingEvents);
        const upcomingEvents = [];

        petWithUpcomingEvents.vaccinationRecords.forEach(vaccineRecord => {
            upcomingEvents.push({
                ...vaccineRecord.toObject(),
                actionType: 'Vaccine Record',
                details: `Vaccine Type: ${vaccineRecord.vaccineType}`,
                petId: vaccineRecord.pet
            });
        });
      
        petWithUpcomingEvents.routineCareRecords.forEach(routineCareRecord => {
            upcomingEvents.push({
                ...routineCareRecord.toObject(),
                actionType: 'Routine Care',
                details: `Routine Care Type: ${routineCareRecord.activity}`,
                petId: routineCareRecord.pet
            });
        });

        petWithUpcomingEvents.vetVisits.forEach(visit => {
            upcomingEvents.push({
                ...visit.toObject(),
                nextDate: visit.date,
                actionType: 'Vet Visit',
                details: `The Reason: ${visit.reason}`,
                petId: visit.pet

            });
        });
        
        // Sort the combined events by nextDate
        upcomingEvents.sort((a, b) => a.nextDate - b.nextDate);
        res.status(200).json(upcomingEvents);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function getPetExpensesArrays(req, res) {
    try {
        const { petId } = req.params;

      const petWithExpenses = await Pet.findById(petId).populate('expenses');
      const allExpenses = petWithExpenses.expenses;

      const monthlyExpensesData = {};
      const categoryExpensesData = {};
  
      petWithExpenses.expenses.forEach(expense => {
        const month = new Date(expense.date).getMonth() + 1; // Get month index (0-11)
        const category = expense.category;
  
        // Update monthly expenses data
        monthlyExpensesData[month] = (monthlyExpensesData[month] || 0) + expense.amount;
  
        // Update category expenses data
        categoryExpensesData[category] = (categoryExpensesData[category] || 0) + expense.amount;
      });
  
      // Convert monthly expenses data to array of objects
      const monthlyExpensesChartData = Object.entries(monthlyExpensesData).map(([monthIndex, amount]) => ({
        month: monthIndex, // Month index
        amount: amount // Total expenses for the month
      }));
  
      // Convert category expenses data to array of objects
      const categoryExpensesChartData = Object.entries(categoryExpensesData).map(([category, amount]) => ({
        category: category,
        amount: amount
      }));
  
      res.status(200).json({ allExpenses, monthlyExpensesChartData, categoryExpensesChartData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function getPetAllergies (req, res) {
    try {
        const { petId } = req.params;

        const pet = await Pet.findById(petId).populate('allergies');
        if (!pet) {
        return res.status(404).json({ error: 'Pet not found' });
        }
        res.status(200).json(pet.allergies);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getPetMedications (req, res) {
    try {
        const { petId } = req.params;

        const pet = await Pet.findById(petId).populate('medications');
        if (!pet) {
        return res.status(404).json({ error: 'Pet not found' });
        }
        res.status(200).json(pet.medications);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getPetVetVisits (req, res) {
    try {
        const { petId } = req.params;

        const pet = await Pet.findById(petId).populate('vetVisitis');
        if (!pet) {
        return res.status(404).json({ error: 'Pet not found' });
        }
        res.status(200).json(pet.vetVisitis);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getPetMealPlanner (req, res) {
    try {
        const { petId } = req.params;

        const pet = await Pet.findById(petId).populate('mealPlanner');
        if (!pet) {
        return res.status(404).json({ error: 'Pet not found' });
        }
        res.status(200).json(pet.mealPlanner);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getPetEmergencyContacts (req, res) {
    try {
        const { petId } = req.params;

        const pet = await Pet.findById(petId).populate('emergencyContacts');
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        res.status(200).json(pet.emergencyContacts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getPetMedicalConditions (req, res) {
    try {
        const { petId } = req.params;

        const pet = await Pet.findById(petId).populate('medicalConditions');
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        res.status(200).json(pet.medicalConditions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function addPet (req, res) {
    try {
        console.log('add pet');
        const { userId } = req.params;
        const {newPet} = req.body;
        const imagePath = req.file.path;
        
        const petData = JSON.parse(newPet);
        let medicationIds, allergyIds, vaccinationIds, noteIds, rouineCareIds, expenseIds, vetVisitIds = [];

        const newPetData = new Pet({
            name: petData.name,
            age: petData.age,
            birthday: petData.birthday,
            breed: petData.breed,
            chipNumber: petData.chip,
            description: petData.description,
            owner: petData.owner,
            species: petData.species,
            weight: petData.weight,
            image: imagePath,
        });
        console.log('new pet: ', newPetData);
        await newPetData.save();
        const pet = newPetData._id.toString();

        if (petData.expenses.length > 0) {
            expenseIds = await Promise.all(petData.expenses.map(async (expense) => {
                const newExpense = new Expense({ ...expense, pet });
                console.log('newExpense: ', newExpense);
                await newExpense.save();

                const activityLog = new ActivityLog({
                    userId: userId, 
                    petId: pet,
                    type: ActivityType.EXPENSE,
                    actionType: ActivityLogType.EXPENSE_ADDED,
                    details: expense.note ? `expense type: ${ExpenseCategory[expense.category]}.\n your note: ${expense.note}` :  `expense type: ${ExpenseCategory[expense.category]}`
                });
                await activityLog.save();

                return newExpense._id;
            }));
        }

        if (petData.medications.length > 0) {
            medicationIds = await Promise.all(petData.medications.map(async (medication) => {
                const newMedication = new Medication({ ...medication, pet });
                await newMedication.save();

                const activityLog = new ActivityLog({
                    userId: userId, 
                    petId: pet,
                    type: ActivityType.MEDICATION,
                    actionType: ActivityLogType.MEDICATION_ADDED,
                    details: medication.note ? `Medication name: ${medication.name}.\n The dosage: ${medication.dosage}\n start date:${new Date(medication.startDate).toLocaleDateString()} - end date:${new Date(medication.endDate).toLocaleDateString()}\n your note: ${medication.note}` :
                      `Medication name: ${medication.name}.\n The dosage: ${medication.dosage}\n start date:${new Date(medication.startDate).toLocaleDateString()} - end date:${new Date(medication.endDate).toLocaleDateString()}`
                });
                await activityLog.save();
                return newMedication._id;
            }));
        }

        if (petData.allergies.length > 0) {
            allergyIds = await Promise.all(petData.allergies.map(async (allergy) => {
                const newAllergy = new Allergy({ ...allergy, pet });
                await newAllergy.save();

                const activityLog = new ActivityLog({
                    userId: userId, 
                    petId: pet,
                    type: ActivityType.ALLERGY,
                    actionType: ActivityLogType.ALLERGY_ADDED,
                    details: allergy.note ? `Allergy name: ${allergy.name}.\n The treatment: ${allergy.treatment}\n your note: ${allergy.note}` :  `Allergy name: ${allergy.name}\n The treatment: ${allergy.treatment}`
                });
                await activityLog.save();
                return newAllergy._id;
            }));
        }

        if (petData.routineCareRecord.length > 0) {
            rouineCareIds = await Promise.all(petData.routineCareRecord.map(async (routineCare) => {
                const newRoutineCare = new RoutineCareRecord({ ...routineCare, pet });
                await newRoutineCare.save();
                const activityLog = new ActivityLog({
                    userId: userId, 
                    petId: pet,
                    type: ActivityType.ROUTINE_CARE,
                    actionType: ActivityLogType.ROUTINE_CARE_ADDED,
                    details: routineCare.note ? `routine care type: ${RoutineCareActivity[routineCare.activity]}.\n your note: ${routineCare.note}` :  `routine care type: ${RoutineCareActivity[routineCare.activity]}`
                });
                await activityLog.save();
                return newRoutineCare._id;
            }));
        }

        if (petData.vaccinationRecord.length > 0) {
            vaccinationIds = await Promise.all(petData.vaccinationRecord.map(async (vaccine) => {
                const newVaccine = new VaccinationRecord({ ...vaccine, pet });
                await newVaccine.save();

                const activityLog = new ActivityLog({
                    userId: userId, 
                    petId: pet,
                    type: ActivityType.VACCINE_RECORD,
                    actionType: ActivityLogType.VACCINE_RECORD_ADDED,
                    details: vaccine.note ? `vaccine type: ${VaccineRecordType[vaccine.vaccineType]}.\n your note: ${note}` :  `vaccine type: ${VaccineRecordType[vaccine.vaccineType]}`
                });
                await activityLog.save();
                return newVaccine._id;
            }));
        }

        if (petData.vetVisits.length > 0) {
            vetVisitIds = await Promise.all(petData.vetVisits.map(async (visit) => {
                const newVisit = new VetVisit({ ...visit, pet });
                await newVisit.save();

                const activityLog = new ActivityLog({
                    userId: userId, 
                    petId: pet,
                    type: ActivityType.VET_VISIT,
                    actionType: ActivityLogType.VET_VISIT_ADDED,
                    details: visit.note ? `Visit Reason: ${visit.reason}\n${visit.examination ? `Examination: ${visit.examination}` : ''}\nyour note: ${visit.note}` :
                     `Visit Reason: ${visit.reason}}\n${visit.examination ? `Examination: ${visit.examination}` : ''}`
                });
                await activityLog.save();
                return newVisit._id;
            }));
        }

        if (petData.notes.length > 0) {
            noteIds = await Promise.all(petData.notes.map(async (note) => {
                const newNote = new Note({ ...note, pet });
                await newNote.save();

                const activityLog = new ActivityLog({
                    userId: userId, 
                    petId: pet,
                    type: ActivityType.NOTE,
                    actionType: ActivityLogType.NOTE_ADDED,
                    details: note.content
                });
                await activityLog.save();
                return newNote._id;
            }));
        }

        
        if (petData.medicalConditions.length > 0) {
            contidionIds = await Promise.all(petData.medicalConditions.map(async (condition) => {
                const newCondition = new MedicalCondition({ ...condition, pet });
                await newCondition.save();

                const activityLog = new ActivityLog({
                    userId: userId, 
                    petId: pet,
                    type: ActivityType.MEDICAL_CONDITION,
                    actionType: ActivityLogType.MEDICAL_CONDITION_ADDED,
                    details: `Medical condition details:\n Name:${condition.name}, Description:${condition.description}` 

                });
                await activityLog.save();
                return newCondition._id;
            }));
        }

        // Update the pet document with the IDs of related data items
        newPetData.medications = medicationIds;
        newPetData.allergies = allergyIds;
        newPetData.vaccinationRecords = vaccinationIds;
        newPetData.routineCareRecords = rouineCareIds,
        newPetData.expenses = expenseIds;
        newPetData.notes = noteIds;
        newPetData.vetVisits = vetVisitIds;
        newPetData.medicalConditions = contidionIds;
        await newPetData.save();

        // Find the user by ID and update the pets field
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { pets: newPetData._id } }, // Add the pet's ID to the pets array
            { new: true }
        );

        const weightActivityLog = new ActivityLog({
            userId: userId, 
            petId: pet,
            type: ActivityType.WEIGHT,
            actionType: ActivityLogType.PET_WEIGHT_UPDATE,
            details: `update weight to ${newPetData.weight} `
        });
        await weightActivityLog.save();

          // Log the activity
          const activityLog = new ActivityLog({
            userId: userId, 
            petId: pet,
            actionType: ActivityLogType.PET_ADDED
        });
        await activityLog.save();

        res.status(201).json({ message: 'Pet added successfully', pet: newPet });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while adding pet, try again later' });
    }
}

async function uploadAdditionalImageToNewPet(req, res) {
    try {
        const {petId} = req.params;
        console.log('pet id: ', petId);
        console.log('uploadAdditionalImageToNewPet: ', req.files);

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        // Extract paths of additional images from req.files and add them to pet.additionalImages
        const additionalImagePaths = req.files.map(file => file.path);
        pet.additionalImages = pet.additionalImages.concat(additionalImagePaths);
        await pet.save();
        res.status(201).json({additionalImages: pet.additionalImages, message: 'Pet Additional images added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while adding pet, try again later' });
    }
}

async function addPetVaccineRecord (req, res) {
    try {
        console.log('addPetVaccineRecord');
        const { petId } = req.params;
        const { vaccineType, note, date, nextDate } = req.body;

        // Create a new VaccinationRecord document
        const vaccinationRecord = new VaccinationRecord({
            vaccineType: VaccineRecordType[vaccineType],
            note,
            date,
            nextDate,
            pet: petId
        });

        await vaccinationRecord.save();


        // Find the pet by ID and update its vaccinationRecords array
        const pet = await Pet.findByIdAndUpdate(
            petId,
            { $push: { vaccinationRecords: vaccinationRecord._id } },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        // Log the activity
        const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            type: ActivityType.VACCINE_RECORD,
            actionType: ActivityLogType.VACCINE_RECORD_ADDED,
            details: note ? `vaccine type: ${VaccineRecordType[vaccineType]}.\n your note: ${note}` :  `vaccine type: ${VaccineRecordType[vaccineType]}`
        });

        await activityLog.save();

        res.status(201).json({ message: 'Vaccine record added successfully', vaccinationRecord });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while adding vaccine record, please try again later' });
    }
}

async function addPetRoutineCare (req, res) {
    try {
        const { petId } = req.params;
        const { activity, note, date, nextDate } = req.body;

        // Create a new RoutineCareRecord document
        const routineCareRecord = new RoutineCareRecord({
            activity: RoutineCareActivity[activity],
            note,
            date,
            nextDate,
            pet: petId
        });

        await routineCareRecord.save();
       
        //TODO - if there is cost value - add it to the pet expense fiels 
        //with the expenses type - ExpenseCategory.RoutineCare
        const pet = await Pet.findByIdAndUpdate(
            petId,
            { $push: { routineCareRecords: routineCareRecord._id } },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            type: ActivityType.ROUTINE_CARE,
            actionType: ActivityLogType.ROUTINE_CARE_ADDED,
            details: note ? `routine care type: ${RoutineCareActivity[activity]}.\n your note: ${note}` :  `routine care type: ${RoutineCareActivity[activity]}`

        });
        await activityLog.save();

        res.status(201).json({ message: 'Routine care record added successfully',  routineCareRecord});
    } catch (error) {
        console.error('Error adding routine care record:', error);
        res.status(500).json({ error: 'Error while adding routine care record, please try again later' });
    }
}

async function addPetNote (req, res) {
    try {
        const { petId } = req.params;
        const { noteData } = req.body;
 
        // Create a new Note document
        const note = new Note({
            ...noteData,
            pet: petId
        });
        await note.save();
        const pet = await Pet.findByIdAndUpdate(
            petId,
            { $push: { notes: note._id } },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            type: ActivityType.NOTE,
            actionType: ActivityLogType.NOTE_ADDED,
            details: noteData.content
        });
        await activityLog.save();

        res.status(201).json({ message: 'Note added successfully',  note});
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Error while adding note, please try again later' });
    }
}

async function addPetExpense (req, res) {
    try {
        const { petId } = req.params;
        const { category, amount, note, date } = req.body;

         // Create a new Note document
         const expense = new Expense({
            category: ExpenseCategory[category],
            amount, 
            note,
            date,
            pet: petId
        });

        await expense.save();
        const pet = await Pet.findByIdAndUpdate(
            petId,
            { $push: { expenses: expense._id } },
            { new: true }
        );
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            type: ActivityType.EXPENSE,
            actionType: ActivityLogType.EXPENSE_ADDED,
            details: note ? `expense type: ${ExpenseCategory[category]}.\n your note: ${note}` :  `expense type: ${ExpenseCategory[category]}`
        });
        await activityLog.save();

        //Add to the totalExpenses for the pet owner
        const user = await User.findById(pet.owner);
        user.totalExpenses += amount;
        await user.save();

        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Error while adding expense, please try again later' });
    }
}

async function addPetAllergy (req, res) {
    try {
        const { petId } = req.params;
        const { allergyData } = req.body;
console.log('addPetAllergy: ', allergyData);

        const allergy = new Allergy({
            name: allergyData.name,
            note: allergyData.note ? allergyData.note : null,
            treatment: allergyData.treatment ? allergyData.treatment : null,
            date: allergyData.date,
            pet: petId
        });

        await allergy.save();


        // Find the pet by ID and update its allergies array
        const pet = await Pet.findByIdAndUpdate(
            petId,
            { $push: { allergies: allergy._id } },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        // Log the activity
        const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            type: ActivityType.ALLERGY,
            actionType: ActivityLogType.ALLERGY_ADDED,
            details: allergy.note ? `Allergy name: ${allergy.name}.\n The treatment: ${allergy.treatment}\n your note: ${allergy.note}` :  `Allergy name: ${allergy.name}\n The treatment: ${allergy.treatment}`
        });

        await activityLog.save();

        res.status(201).json({ message: 'Allergy added successfully', allergy });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while adding allergy, please try again later' });
    }
}

async function addPetMedication (req, res) {
    try {
        const { petId } = req.params;
        const { medicationData } = req.body;

        const medication = new Medication({
            name: medicationData.name,
            note: medicationData.note ? medicationData.note : null,
            dosage: medicationData.dosage,
            startDate: medicationData.startDate,
            endDate: medicationData.endDate,
            pet: petId
        });

        await medication.save();

        // Find the pet by ID and update its medications array
        const pet = await Pet.findByIdAndUpdate(
            petId,
            { $push: { medications: medication._id } },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        // Log the activity
        const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            type: ActivityType.MEDICATION,
            actionType: ActivityLogType.MEDICATION_ADDED,
            details: medication.note ? `Medication name: ${medication.name}.\n The dosage: ${medication.dosage}\n start date:${new Date(medication.startDate).toLocaleDateString()} - end date:${new Date(medication.endDate).toLocaleDateString()}\n your note: ${medication.note}` :
              `Medication name: ${medication.name}.\n The dosage: ${medication.dosage}\n start date:${new Date(medication.startDate).toLocaleDateString()} - end date:${new Date(medication.endDate).toLocaleDateString()}`
        });

        await activityLog.save();

        res.status(201).json({ message: 'Medication added successfully', medication });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while adding medication, please try again later' });
    }
}

async function addPetVetVisit (req, res) {
    try {
        const { petId } = req.params;
        const { vetVisitData } = req.body;

        const vetVisit = new VetVisit({
            reason: vetVisitData.reason,
            note: vetVisitData.note ? vetVisitData.note : null,
            examination: vetVisitData.examination ? vetVisitData.examination : null,
            date: vetVisitData.date,
            pet: petId
        });

        await vetVisit.save();

        // Find the pet by ID and update its vetVisitis array
        const pet = await Pet.findByIdAndUpdate(
            petId,
            { $push: { vetVisitis: vetVisit._id } },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        // Log the activity
        const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            type: ActivityType.VET_VISIT,
            actionType: ActivityLogType.VET_VISIT_ADDED,
            details: vetVisit.note ? `Visit Reason: ${vetVisit.reason}\n${vetVisit.examination ? `Examination: ${vetVisit.examination}` : ''}\nyour note: ${vetVisit.note}` :
             `Visit Reason: ${vetVisit.reason}}\n${vetVisit.examination ? `Examination: ${vetVisit.examination}` : ''}`
        });
        await activityLog.save();

        res.status(201).json({ message: 'Vet visit added successfully', vetVisit });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while adding vet visit, please try again later' });
    }
}

async function addPetMealPlanner (req, res) {
    try {
        const { petId } = req.params;
        const { mealData } = req.body;
console.log('mealData: ', mealData);
        const mealPlanner = new MealPlanner({
            amount: mealData.amount,
            note: mealData.note ? mealData.note : null,
            food: mealData.food,
            date: mealData.date,
            petId: petId
        });
        await mealPlanner.save();
        // Find the pet by ID and update its vetVisitis array
        const pet = await Pet.findByIdAndUpdate(
            petId,
            { $push: { mealPlanner: mealPlanner._id } },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
       
        // Log the activity
        const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            type: ActivityType.MEAL_PLANNER,
            actionType: ActivityLogType.MEAL_PLANNER_ADDED,
            details: mealPlanner.note ? `Meal details: ${mealPlanner.food}, Amount:${mealPlanner.amount}\nyour note: ${mealPlanner.note}` :
             `Meal details: ${mealPlanner.food}, Amount:${mealPlanner.amount}}`
        });
        await activityLog.save();

        res.status(201).json({ message: 'Meal Planner added successfully', meal: mealPlanner });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while adding meal planner, please try again later' });
    }
}

async function addPetEmergencyContacts (req, res) {
    try {
        const { petId } = req.params;
        const { contactData } = req.body;

        const contact = new EmergencyContact({
            name: contactData.name,
            phone: contactData.phone,
            type: contactData.type,
            petId: petId
        });
        await contact.save();
        // Find the pet by ID and update its vetVisitis array
        const pet = await Pet.findByIdAndUpdate(
            petId,
            { $push: { emergencyContacts: contact._id } },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        
        // Log the activity
        const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            actionType: ActivityLogType.EMERGENCT_CONTACT_ADDED,
            details: `Contact details:\n Name:${contact.name}, Relationship:${contact.type}` 
           
        });
        await activityLog.save();

        res.status(201).json({ message: 'Emergency Contact added successfully', contact });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while adding meal planner, please try again later' });
    }
}

async function addPetMedicalCondition (req, res) {
    try {
        const { petId } = req.params;
        const { medicalData } = req.body;

        const condition = new MedicalCondition({
            name: medicalData.name,
            description: medicalData.description,
            continuedTreatment: medicalData.continuedTreatment,
            dateDiagnosed: medicalData.dateDiagnosed,
            note: medicalData.note,
            pet: petId
        });
        await condition.save();
        // Find the pet by ID and update its vetVisitis array
        const pet = await Pet.findByIdAndUpdate(
            petId,
            { $push: { medicalConditions: condition._id } },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        
        // Log the activity
        const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            type: ActivityType.MEDICAL_CONDITION,
            actionType: ActivityLogType.MEDICAL_CONDITION_ADDED,
            details: `Medical condition details:\n Name:${condition.name}, Description:${condition.description}` 
           
        });
        await activityLog.save();

        res.status(201).json({ message: 'Medical Condition added successfully', contact });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while adding medical condition, please try again later' });
    }
}

async function updateNoteById (req, res) {
    try {
        const { noteId } = req.params;
        const { noteData } = req.body;

        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        note.content = noteData.content;
        note.title = noteData.title;
        note.updatedDate = Date.now();
        await note.save();

        const pet = await Pet.findById(note.pet);
        // Update the corresponding note within the pet notes array
        // const index = pet.notes.findIndex(note => note._id.toString() === noteId);
        // if (index !== -1) {
        //     pet.notes[index] = note;
        // }

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: noteData.pet,
            type: ActivityType.NOTE,
            actionType: ActivityLogType.NOTE_EDIT
        });
        await activityLog.save();

        res.status(200).json({ message: 'Note updated successfully', note });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Error while updating note, please try again later' });
    }
}

async function deleteNote (req, res) {
    try {
        const { noteId } = req.params;
        const note = await Note.findByIdAndDelete(noteId);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        // Remove from the pet notes array
        const pet = await Pet.findById(note.pet);
        pet.notes = pet.notes.filter(petNote => petNote.toString() !== noteId );
        console.log('pet notes: ', pet.notes);
        await pet.save();

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: pet._id,
            type: ActivityType.NOTE,
            actionType: ActivityLogType.NOTE_DELETE
        });
        await activityLog.save();

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting note, please try again later' });
    }
}

async function updateAllergyById (req, res) {
    try {
        const { alleryId } = req.params;
        const { allergyData } = req.body;

        const allergy = await Allergy.findById(alleryId);
        if (!allergy) {
            return res.status(404).json({ error: 'Allergy not found' });
        }

        allergy.note = allergyData.note;
        allergy.treatment = allergyData.treatment;
        allergy.date = allergyData.date;
        allergy.name = allergyData.name;
        await allergy.save();

        const pet = await Pet.findById(allergy.pet);
        // Update the corresponding allergy within the pet allergies array
        const index = pet.allergies.findIndex(allergy => allergy._id.toString() === alleryId);
        if (index !== -1) {
            pet.allergies[index] = allergy;
        }

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: allergy.pet,
            type: ActivityType.ALLERGY, 
            actionType: ActivityLogType.ALLERGY_EDIT
        });
        await activityLog.save();

        res.status(200).json({ message: 'Allergy updated successfully', allergy });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Error while updating note, please try again later' });
    }
}

async function deleteAllergy (req, res) {
    try {
        const { allergyId } = req.params;

        const allergy = await Allergy.findByIdAndDelete(allergyId);
        if (!allergy) {
            return res.status(404).json({ error: 'Allergy not found' });
        }
        // Remove from the pet allergies array
        const pet = await Pet.findById(allergy.pet);
        pet.allergies = pet.allergies.filter(allergy => allergy.toString() !== allergyId );

        console.log('pet allergies: ', pet.allergies);
        await pet.save();

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: pet._id,
            type: ActivityType.ALLERGY,
            actionType: ActivityLogType.ALLERGY_DELETE
        });
        await activityLog.save();

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting note, please try again later' });
    }
}

async function updateMedicationById (req, res) {
    try {
        const { medicationId } = req.params;
        const { medicationData } = req.body;

        const medication = await Medication.findById(medicationId);
        if (!medication) {
            return res.status(404).json({ error: 'Medication not found' });
        }

        medication.note = medicationData.note;
        medication.dosage = medicationData.dosage;
        medication.startDate = medicationData.startDate;
        medication.endDate = medicationData.endDate;
        medication.name = medicationData.name;
        await medication.save();

        const pet = await Pet.findById(medication.pet);
        const index = pet.medications.findIndex(med => med._id.toString() === medicationId);
        if (index !== -1) {
            pet.medications[index] = medication;
        }

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: medication.pet,
            type: ActivityType.MEDICATION,
            actionType: ActivityLogType.MEDICATION_EDIT
        });
        await activityLog.save();

        res.status(200).json({ message: 'Medication updated successfully', medication });
    } catch (error) {
        res.status(500).json({ error: 'Error while updating note, please try again later' });
    }
}

async function deleteMedication (req, res) {
    try {
        const { medicationId } = req.params;

        const medication = await Medication.findByIdAndDelete(medicationId);
        if (!medication) {
            return res.status(404).json({ error: 'Medication not found' });
        }
        // Remove from the pet medications array
        const pet = await Pet.findById(medication.pet);
        pet.medications = pet.notes.filter(med => med.toString() !== medication );
        await pet.save();

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: pet._id,
            type: ActivityType.MEDICATION,
            actionType: ActivityLogType.MEDICATION_DELETE
        });
        await activityLog.save();

        res.status(200).json({ message: 'Medication deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting medication, please try again later' });
    }
}

async function updateVetVisitById (req, res) {
    try {
        const { visitId } = req.params;
        const { visitData } = req.body;

        const visit = await VetVisit.findById(visitId);
        if (!visit) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        visit.note = visitData.note;
        visit.reason = visitData.reason;
        visit.examination = visitData.examination;
        visit.date = visitData.date;
        await visit.save();

        const pet = await Pet.findById(visit.pet);

        const index = pet.vetVisits.findIndex(visit => visit._id.toString() === visitId);
        if (index !== -1) {
            pet.vetVisits[index] = visit;
        }

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: visit.pet,
            type: ActivityType.VET_VISIT,
            actionType: ActivityLogType.VET_VISIT_EDIT
        });
        await activityLog.save();

        res.status(200).json({ message: 'Visit updated successfully', visit });
    } catch (error) {
        res.status(500).json({ error: 'Error while updating visit, please try again later' });
    }
}

async function deleteVetVisit (req, res) {
    try {
        const { visitId } = req.params;

        const visit = await VetVisit.findByIdAndDelete(visitId);
        if (!visit) {
            return res.status(404).json({ error: 'Visit not found' });
        }
        // Remove from the pet visits array
        const pet = await Pet.findById(visit.pet);
        pet.vetVisits = pet.notes.filter(visit => visit.toString() !== visitId );
        await pet.save();

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: pet._id,
            type: ActivityType.VET_VISIT,
            actionType: ActivityLogType.VET_VISIT_DELETE
        });
        await activityLog.save();

        res.status(200).json({ message: 'Visit deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting visit, please try again later' });
    }
}

async function updateMealPlannerById (req, res) {
    try {
        const { mealId } = req.params;
        const { mealData } = req.body;

        const meal = await MealPlanner.findById(mealId);
        if (!meal) {
            return res.status(404).json({ error: 'Meal Planner not found' });
        }

        meal.date = mealData.date;
        meal.food = mealData.food;
        meal.examination = mealData.examination;
        meal.amount = mealData.amount;
        meal.note = mealData.note;
        meal.updatedDate = Date.now();
        await meal.save();

        const pet = await Pet.findById(meal.petId);
        // Update the corresponding note within the pet notes array
        const index = pet.mealPlanner.findIndex(meal => meal._id.toString() === mealId);
        if (index !== -1) {
            pet.mealPlanner[index] = meal;
        }

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: visit.pet,
            type: ActivityType.MEAL_PLANNER,
            actionType: ActivityLogType.MEAL_PLANNER_EDIT
        });
        await activityLog.save();

        res.status(200).json({ message: 'Meal Planner updated successfully', meal });
    } catch (error) {
        res.status(500).json({ error: 'Error while updating meal planner, please try again later' });
    }
}

async function deleteMealPlanner (req, res) {
    try {
        const { mealId } = req.params;
        const meal = await MealPlanner.findByIdAndDelete(mealId);
        if (!meal) {
            return res.status(404).json({ error: 'Meal Planner not found' });
        }
        // Remove from the pet meals array
        const pet = await Pet.findById(meal.petId);
        pet.mealPlanner = pet.mealPlanner.filter(meal => meal.toString() !== mealId );
        await pet.save();

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: pet._id,
            type: ActivityType.MEAL_PLANNER,
            actionType: ActivityLogType.MEAL_PLANNER_DELETE
        });
        await activityLog.save();

        res.status(200).json({ message: 'Meal Planner deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting meal planner, please try again later' });
    }
}

async function updateEmergencyContactById (req, res) {
    try {
        const { contactId } = req.params;
        const { contactData } = req.body;

        const contact = await EmergencyContact.findById(contactId);
        if (!contact) {
            return res.status(404).json({ error: ' Contact not found' });
        }

        contact.name = contactData.name;
        contact.phone = contactData.phone;
        contact.type = contactData.type;
        await contact.save();

        const pet = await Pet.findById(contact.petId);
        // Update the corresponding note within the pet notes array
        const index = pet.emergencyContacts.findIndex(contact => contact._id.toString() === contactId);
        if (index !== -1) {
            pet.emergencyContacts[index] = contact;
        }

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: contact.pet,
            actionType: ActivityLogType.EMERGENCT_CONTACT_EDIT
        });
        await activityLog.save();

        res.status(200).json({ message: 'Contact updated successfully', meal });
    } catch (error) {
        res.status(500).json({ error: 'Error while updating contact, please try again later' });
    }
}

async function deleteEmergencyContact (req, res) {
    try {
        const { contactId } = req.params;
        const contact = await MealPlanner.findByIdAndDelete(contactId);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        // Remove from the pet contacts array
        const pet = await Pet.findById(contact.petId);
        pet.emergencyContacts = pet.emergencyContacts.filter(contact => contact.toString() !== contactId );
        await pet.save();

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: pet._id,
            actionType: ActivityLogType.EMERGENCT_CONTACT_DELETE
        });
        await activityLog.save();

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting contact, please try again later' });
    }
}

async function updateMedicalConditionById (req, res) {
    try {
        const { conditionId } = req.params;
        const { conditionData } = req.body;

        const condition = await MedicalCondition.findById(conditionId);
        if (!meal) {
            return res.status(404).json({ error: 'Medical Condition not found' });
        }

        condition.name = conditionData.date;
        condition.description = conditionData.description;
        condition.continuedTreatment = conditionData.continuedTreatment;
        condition.dateDiagnosed = conditionData.dateDiagnosed;
        condition.note = conditionData.note;
        condition.updatedDate = Date.now();
        await condition.save();

        const pet = await Pet.findById(meal.petId);

        const index = pet.medicalConditions.findIndex(condition => condition._id.toString() === conditionId);
        if (index !== -1) {
            pet.medicalConditions[index] = condition;
        }

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: pet._id,
            type: ActivityType.MEDICAL_CONDITION,
            actionType: ActivityLogType.MEDICAL_CONDITION_EDIT
        });
        await activityLog.save();

        res.status(200).json({ message: 'Medical Condition updated successfully', meal });
    } catch (error) {
        res.status(500).json({ error: 'Error while updating medical condition, please try again later' });
    }
}

async function deleteMedicalCondition (req, res) {
    try {
        const { conditionId } = req.params;
        const condition = await MedicalCondition.findByIdAndDelete(conditionId);
        if (!meal) {
            return res.status(404).json({ error: 'Medical Condition not found' });
        }

        const pet = await Pet.findById(condition.pet);
        pet.medicalConditions = pet.medicalConditions.filter(condition => condition.toString() !== conditionId );
        await pet.save();

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: pet._id,
            type: ActivityType.MEDICAL_CONDITION,
            actionType: ActivityLogType.MEDICAL_CONDITION_DELETE
        });
        await activityLog.save();

        res.status(200).json({ message: 'Medical Condition deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting medical condition, please try again later' });
    }
}

async function updatePetById(req, res) {
    try {
        const { petId } = req.params;
        const { name, species, breed, age, weight, description, chipNumber } = req.body;

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        // Update the pet document with the new information
        if (name) pet.name = name;
        if (species) pet.species = species;
        if (breed) pet.breed = breed;
        if (age) pet.age = age;
        if (weight) pet.weight = weight;
        if (description) pet.description = description;
        if (chipNumber) pet.chipNumber = chipNumber;

        await pet.save();

        //TODO - if weight is change - add to activity log
        if (weight) {
            const weightActivityLog = new ActivityLog({
                userId: pet.owner, 
                petId: petId,
                type: ActivityType.WEIGHT,
                actionType: ActivityLogType.PET_WEIGHT_UPDATE,
                details: `update weight to ${weight} `
            });
            await weightActivityLog.save();
        }
        
        const user = await User.findById(pet.owner);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the pet reference in the user's pets array
        const petIndex = user.pets.findIndex(pet => pet._id.toString() === petId);
        if (petIndex !== -1) {
            user.pets[petIndex] = pet;
        }
        await user.save();

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            actionType: ActivityLogType.PET_EDIT
        });
        await activityLog.save();

        res.status(200).json({ message: 'Pet updated successfully', pet });
    } catch (error) {
        res.status(500).json({ error: 'Error while updating pet, please try again later' });
    }
}

async function deletePet (req, res) {
    //TODO - need to check what about all the record of the pet in the other schemas,
    // and about the pet in the pets array in the user schema
    //TODO -  think how to add an ativity log - the pet {petName} deleted
    try {
        const { petId } = req.params;
    
        const deletedPet  = await Pet.findByIdAndDelete(petId);
        if (!deletedPet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        //  // Remove pet from user's pet list
        //  const user = await User.findOneAndUpdate(
        //     {_id: deletePet.owner},
        //     // { pets: petId },
        //     { $pull: { pets: petId } },
        //     { new: true }
        // );

         // Log the activity
         const activityLog = new ActivityLog({
            userId: deletedPet.owner, 
            petId: petId,
            actionType: ActivityLogType.PET_DELETE
        });
        await activityLog.save();

        res.status(200).json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting pet, please try again later' });
    }
}




module.exports = {
    getPetById,
    getPetsByUserId,
    getPetVaccinationRecord,
    getPetRoutineCare,
    getPetNote,
    getPetExpense,
    getPetActivityLog,
    getPetUpcomingEvents,
    getPetExpensesArrays,
    getPetWeightTracker,
    getPetAllergies,
    getPetMedications,
    getPetVetVisits,
    getPetMealPlanner,
    getPetEmergencyContacts,
    getPetMedicalConditions,
    addPet,
    uploadAdditionalImageToNewPet,
    addPetVaccineRecord,
    addPetRoutineCare,
    addPetNote,
    addPetExpense,
    addPetAllergy,
    addPetMedication,
    addPetVetVisit,
    addPetMealPlanner,
    addPetEmergencyContacts,
    addPetMedicalCondition,
    updateNoteById,
    updatePetById,
    deleteNote,
    updateMealPlannerById,
    deleteMealPlanner,
    updateEmergencyContactById,
    deleteEmergencyContact,
    updateMedicalConditionById,
    deleteMedicalCondition,
    updateAllergyById,
    deleteAllergy,
    updateMedicationById,
    deleteMedication,
    updateVetVisitById,
    deleteVetVisit,
    deletePet,
    singleImageUpload,
    multipleImagesUpload,
};

/**
* @swagger
* paths:
*   /pets/vaccinationRecord/{petId}:
*     get:
*       summary: Get vaccination records for a pet by ID
*       tags:
*         - Pet
*       description: Retrieve vaccination records for a pet by its unique identifier.
*       parameters:
*         - in: path
*           name: petId
*           required: true
*           description: ID of the pet to retrieve vaccination records for
*           schema:
*             type: string
*       responses:
*         200:
*           description: Successfully retrieved the vaccination records
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/VaccinationRecord'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*     post:
*       summary: Add a new vaccine record for a pet
*       tags:
*         - Pet
*       parameters:
*         - in: path
*           name: petId
*           required: true
*           schema:
*             type: string
*             description: ID of the pet to add the vaccine record for
*         - in: body
*           name: body
*           required: true
*           schema:
*             $ref: '#/components/schemas/VaccineRecord'
*       responses:
*         201:
*           description: Vaccine record added successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                     description: Success message
*                   vaccinationRecord:
*                     $ref: '#/components/schemas/VaccinationRecord'
*         404:
*            description: Pet not found
*            content:
*              application/json:
*                schema:
*                  type: object
*                  properties:
*                    error:
*                      type: string
*                      example: Pet not found.
*         500:
*            description: Internal server error
*            content:
*              application/json:
*                schema:
*                  type: object
*                  properties:
*                    error:
*                      type: string
*                      example: Internal server error.
*
*   /pets/routineCare/{petId}:
*     get:
*       summary: Get routine care records for a pet by ID
*       tags:
*         - Pet
*       description: Retrieve routine care records for a pet by its unique identifier.
*       parameters:
*         - in: path
*           name: petId
*           required: true
*           description: ID of the pet to retrieve routine care records for
*           schema:
*             type: string
*       responses:
*         200:
*           description: Successfully retrieved the routine care records
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/RoutineCareRecord'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*     post:
*       summary: Add a new routine care record for a pet
*       tags:
*         - Pet
*       parameters:
*         - in: path
*           name: petId
*           required: true
*           schema:
*             type: string
*             description: ID of the pet to add the routine care record for
*         - in: body
*           name: body
*           required: true
*           schema:
*             $ref: '#/components/schemas/RoutineCareRecord'
*       responses:
*         201:
*           description: Routine care record added successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                     description: Success message
*                   routineCareRecord:
*                     $ref: '#components/schemas/RoutineCareRecord'
*         404:
*            description: Pet not found
*            content:
*              application/json:
*                schema:
*                  type: object
*                properties:
*                   error:
*                      type: string
*                      example: Pet not found.
*         500:
*            description: Internal server error
*            content:
*              application/json:
*                schema:
*                  type: object
*                  properties:
*                    error:
*                      type: string
*                      example: Internal server error.
*
*   /pets/user/{userId}:
*     get:
*       summary: "Get pets by user ID"
*       tags:
*         - "User"
*       parameters:
*         - in: "path"
*           name: "userId"
*           required: true
*           description: "ID of the user to get pets for"
*           type: "string"
*       responses:
*         200:
*           description: "Successfully retrieved pets"
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: "#/components/schemas/Pet"
*         404:
*           description: "User not found"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: User not found
*         500:
*           description: "Internal server error"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error
*
*   /pets/{userId}:
*     post:
*       summary: Add a new pet
*       tags:
*         - Pet
*       parameters:
*         - in: path
*           name: userId
*           required: true
*           schema:
*             type: string
*             description: ID of the user to add the pet for
*         - in: formData
*           name: newPet
*           required: true
*           schema:
*             type: string
*             description: JSON string representing the new pet
*         - in: formData
*           name: file
*           required: true
*           schema:
*             type: file
*             description: Image file of the new pet
*       responses:
*         201:
*           description: Pet added successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                     description: Success message
*                   pet:
*                     $ref: '#/components/schemas/Pet'
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*
*   /pets/{petId}:
*     get:
*       summary: "Get pet by ID"
*       tags:
*         - "Pet"
*       parameters:
*         - in: "path"
*           name: "petId"
*           required: true
*           description: "ID of the pet to retrieve"
*           type: "string"
*       responses:
*         200:
*           description: "Successfully retrieved pet"
*           content:
*             application/json:
*               schema:
*                 $ref: "#/components/schemas/Pet"
*         404:
*           description: "Pet not found"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: "Internal server error"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error
*     put:
*       summary: Update a pet by ID
*       tags:
*         - Pet
*       async: true
*       parameters:
*       requestBody:
*         description: The data for the new note
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 petId:
*                   type: string
*                 name:
*                   type: string
*                 species:
*                   type: string
*                 breed:
*                   type: string
*                 age:
*                   type: number
*                 weight:
*                   type: number
*                 description:
*                   type: string
*                 chipNumber:
*                   type: string
*       responses:
*         200:
*           description: Pet updated successfully
*           content:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                   pet:
*                     $ref: '#/components/schemas/Pet'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                      type: string
*                      example: Internal server error.
*     delete:
*       summary: Delete a pet by ID
*       tags:
*         - Pet
*       async: true
*       parameters:
*       responses:
*         200:
*           description: Pet deleted successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
* 
*   /pets/note/{petId}:
*     get:
*       summary: Get notes for a pet by ID
*       tags:
*         - Pet
*       description: Retrieve notes for a pet by its unique identifier.
*       parameters:
*         - in: path
*           name: petId
*           required: true
*           description: ID of the pet to retrieve notes for
*           schema:
*             type: string
*       responses:
*         200:
*           description: Successfully retrieved the notes
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/Note'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*     post:
*       summary: Add a note for a pet
*       tags:
*         - Pet
*       async: true
*       parameters:
*         - in: path
*           name: petId
*           required: true
*           description: ID of the pet to retrieve notes for
*           schema:
*             type: string
*       requestBody:
*         description: The data for the new note
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 petId:
*                   type: string
*                 noteData:
*                   type: object
*       responses:
*         201:
*           description: Note added successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                   note:
*                     $ref: '#/components/schemas/Note'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*
*   /pets/note/{noteId}:
*     put:
*       summary: Update a note by ID
*       tags:
*         - Pet
*       async: true
*       parameters:
*         - in: path
*           name: noteId
*           required: true
*           description: ID of the note
*           schema:
*             type: string
*       requestBody:
*         description: The updated note data
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 noteId:
*                   type: string
*                 noteData:
*                   type: object
*       responses:
*         200:
*           description: Note updated successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                   note:
*                     $ref: '#/components/schemas/Note'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*     delete:
*       summary: Delete a note by ID
*       tags:
*         - Pet
*       async: true
*       parameters:
*         - in: path
*           name: noteId
*           required: true
*           description: ID of the note
*           schema:
*             type: string
*       responses:
*         200:
*           description: Note deleted successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
* 
*   /pets/expense/{petId}:
*     get:
*       summary: Get expenses for a pet by ID
*       tags:
*         - Pet
*       description: Retrieve expenses for a pet by its unique identifier.
*       parameters:
*         - in: path
*           name: petId
*           required: true
*           description: ID of the pet to retrieve expenses for
*           schema:
*             type: string
*       responses:
*         200:
*           description: Successfully retrieved the expenses
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/Expense'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*     post:
*       summary: Add an expense for a pet
*       tags:
*         - Pet
*       async: true
*       parameters:
*       requestBody:
*         description: The data for the new expense
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 petId:
*                   type: string
*                 category:
*                   type: string
*                 amount:
*                   type: number
*                 note:
*                   type: string
*                 date:
*                   type: string
*       responses:
*         201:
*           description: Expense added successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                   expense:
*                     $ref: '#/components/schemas/Expense'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
* 
*   /pets/activity/{petId}:
*     get:
*       summary: Get activity logs for a pet by ID
*       tags:
*         - Pet
*       description: Retrieve activity logs for a pet by its unique identifier.
*       parameters:
*         - in: path
*           name: petId
*           required: true
*           description: ID of the pet to retrieve activity logs for
*           schema:
*             type: string
*       responses:
*         200:
*           description: Successfully retrieved the activity logs
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/ActivityLog'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*  
*   /pets/weight-track/{petId}:
*     get:
*       summary: Get weight tracker logs for a pet by ID
*       tags:
*         - Pet
*       description: Retrieve weight tracker logs for a pet by its unique identifier.
*       parameters:
*         - in: path
*           name: petId
*           required: true
*           description: ID of the pet to retrieve weight tracker logs for
*           schema:
*             type: string
*       responses:
*         200:
*           description: Successfully retrieved the weight tracker logs
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/ActivityLog'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
* 
*   /pets/upcoming/{petId}:
*    get:
*     summary: Get upcoming events for a pet by ID
*     tags:
*       - Pet
*     description: Retrieve upcoming events for a pet by its unique identifier.
*     parameters:
*       - in: path
*         name: petId
*         required: true
*         description: ID of the pet to retrieve upcoming events for
*         schema:
*           type: string
*     responses:
*       200:
*         description: Successfully retrieved the user upcoming events
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   nextDate:
*                     type: string
*                     format: date-time
*                     description: The date of the upcoming event
*                   actionType:
*                     type: string
*                     description: The type of action for the event (Vaccine, Routine Care, Vet Visit, etc.)
*                   details:
*                     type: string
*                     description: Additional details about the event
*       404:
*         description: Pet not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: Pet not found.
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: Internal server error.
* 
*   /pets/expenses-array/{petId}:
*    get:
*     summary: Get expenses arrays for a pet by ID
*     tags:
*       - Pet
*     description: Retrieve different arrays of expenses data for a pet by its unique identifier.
*     parameters:
*       - in: path
*         name: petId
*         required: true
*         description: ID of the pet to retrieve expenses arrays for
*         schema:
*           type: string
*     responses:
*       200:
*         description: Successfully retrieved the expenses arrays
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 allExpenses:
*                   type: array
*                   items:
*                     $ref: '#/components/schemas/Expense'
*                   description: Array of all expenses for the pet
*                 monthlyExpensesChartData:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       month:
*                         type: number
*                         description: Month index (1-12)
*                       amount:
*                         type: number
*                         description: Total expenses for the month
*                   description: Array of monthly expenses data
*                 categoryExpensesChartData:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       category:
*                         type: string
*                         description: Expense category
*                       amount:
*                         type: number
*                         description: Total expenses for the category
*                   description: Array of category expenses data
*       404:
*         description: Pet not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: Pet not found.
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: Internal server error.
* 
*   /pets/allergy/{petId}:
*     get:
*       summary: Retrieve allergies of a pet
*       tags:
*         - Pet
*       parameters:
*         - in: path
*           name: petId
*           required: true
*           schema:
*             type: string
*             description: ID of the pet to retrieve allergies for
*       responses:
*         200:
*           description: Successful response
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/Allergy'
*         404:  
*            description: Pet not found
*            content:
*              application/json:
*                schema:
*                  type: object
*                  properties:
*                    error:
*                      type: string
*                      example: Pet not found.
*         500:
*            description: Internal server error
*            content:
*              application/json:
*                schema:
*                  type: object
*                  properties:
*                    error:
*                      type: string
*                      example: Internal server error.
*     post:
*       summary: Add an allergy for a pet
*       tags:
*         - Pet
*       async: true
*       parameters:
*       requestBody:
*         description: The data for the new allergy
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 petId:
*                   type: string
*                 allergyData:
*                   type: object
*       responses:
*         201:
*           description: Allergy added successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                   allergy:
*                     $ref: '#/components/schemas/Allergy'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*
*   /pets/medication/{petId}:
*     get:
*       summary: Retrieve medications of a pet
*       tags:
*         - Pet
*       parameters:
*         - in: path
*           name: petId
*           required: true
*           schema:
*             type: string
*             description: ID of the pet to retrieve medications for
*       responses:
*         200:
*           description: Successful response
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/Medication'
*         404:
*            description: Pet not found
*            content:
*              application/json:
*                schema:
*                  type: object
*                  properties:
*                    error:
*                      type: string
*                      example: Pet not found.
*         500:
*            description: Internal server error
*            content:
*              application/json:
*                schema:
*                  type: object
*                  properties:
*                    error:
*                      type: string
*                      example: Internal server error.
*     post:
*       summary: Add a medication for a pet
*       tags:
*         - Pet
*       async: true
*       parameters:
*       requestBody:
*         description: The data for the new medication
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 petId:
*                   type: string
*                 medicationData:
*                   type: object
*       responses:
*         201:
*           description: Medication added successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                   medication:
*                     $ref: '#/components/schemas/Medication'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*
*   /pets/additional-images/{petId}:
*     post:
*       summary: Upload additional images to a new pet
*       tags:
*         - Pet
*       parameters:
*         - in: path
*           name: petId
*           required: true
*           schema:
*             type: string
*             description: ID of the pet to upload additional images for
*         - in: formData
*           name: files
*           required: true
*           schema:
*             type: file
*             description: Additional image files to upload
*       responses:
*         201:
*           description: Additional images added successfully
*         500:
*            description: Internal server error
*            content:
*              application/json:
*                schema:
*                  type: object
*                  properties:
*                    error:
*                      type: string
*                      example: Internal server error.
* 
*
*   /pets/allergy/{allergyId}:
*     put:
*       summary: Update an allergy by ID
*       tags:
*         - Pet
*       async: true
*       parameters:
*       requestBody:
*         description: The updated allergy data
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 noteId:
*                   type: string
*                 content:
*                   type: object
*       responses:
*         200:
*           description: Allergy updated successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                   allergy:
*                     $ref: '#/components/schemas/Allergy'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*   delete:
*       summary: Delete an allergy by ID
*       tags:
*         - Pet
*       async: true
*       parameters:
*       responses:
*         200:
*           description: Allergy deleted successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*
*   /pets/medication/{medicationId}:
*     put:
*       summary: Update a medication by ID
*       tags:
*         - Pet
*       async: true
*       parameters:
*       requestBody:
*         description: The updated medication data
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 noteId:
*                   type: string
*                 content:
*                   type: object
*       responses:
*         200:
*           description: Medication updated successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                   medication:
*                     $ref: '#/components/schemas/Medication'
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*     delete:
*       summary: Delete a medication by ID
*       tags:
*         - Pet
*       async: true
*       parameters:
*       responses:
*         200:
*           description: Medication deleted successfully
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*         404:
*           description: Pet not found
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Pet not found.
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*
*   /pets/vet-visit/{petId}:
*     get:
*       summary: Retrieve vet visits of a pet
*       tags:
*         - Pet
*       parameters:
*         - in: path
*           name: petId
*           required: true
*           schema:
*             type: string
*             description: ID of the pet to retrieve vet visits for
*       responses:
*         200:
*           description: Successful response
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/VetVisit'
*         404:
*            description: Pet not found
*            content:
*              application/json:
*                schema:
*                  type: object
*                  properties:
*                    error:
*                      type: string
*                      example: Pet not found.
*         500:
*            description: Internal server error
*            content:
*              application/json:
*                schema:
*                  type: object
*                  properties:
*                    error:
*                      type: string
*                      example: Internal server error.
*     post:
*      summary: Add a vet visit for a pet
*      tags:
*        - Pet
*      async: true
*      parameters:
*      requestBody:
*        description: The data for the new vet visit
*        required: true
*        content:
*            schema:
*              type: object
*              properties:
*                petId:
*                  type: string
*                vetVisitData:
*                  type: object
*      responses:
*        201:
*          description: Vet visit added successfully
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  message:
*                    type: string
*                  vetVisit:
*                    $ref: '#/components/schemas/VetVisit'
*        404:
*          description: Pet not found
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: Pet not found.
*        500:
*          description: Internal server error
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: Internal server error.
*
*
*   /pets/vet-visit/{vetId}:
*     put:
*      summary: Update a vet visit by ID
*      tags:
*        - Pet
*      async: true
*      parameters:
*      requestBody:
*        description: The updated vet visit data
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                noteId:
*                  type: string
*                content:
*                  type: object
*      responses:
*        200:
*          description: Vet visit updated successfully
*          content:
*              schema:
*                type: object
*                properties:
*                  message:
*                    type: string
*                  vetVisit:
*                    $ref: '#/components/schemas/VetVisit'
*        404:
*          description: Pet not found
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: Pet not found.
*        500:
*          description: Internal server error
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: Internal server error.
*     delete:
*      summary: Delete a vet visit by ID
*      tags:
*        - Pet
*      async: true
*      parameters:
*      responses:
*        200:
*           description: Vet visit deleted successfully
*           content:
*             application/json:
*               schema:
*                type: object
*               properties:
*                  message:
*                    type: string
*        404:
*          description: Pet not found
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: Pet not found.
*        500:
*          description: Internal server error
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: Internal server error.
*
*
* components:
*   schemas:
*     VaccinationRecord:
*       type: object
*       properties:
*         pet:
*           type: string
*           description: ID of the pet associated with this vaccination record
*         vaccineType:
*           type: string
*           enum: 
*             - DHPP
*             - Rabies
*             - Vaccination against Esophagus Worms
*             - Flea and Tick Treatment
*             - Deworming
*             - FVRCP
*             - FeLV
*             - Other
*           description: Type of vaccine
*         note:
*           type: string
*           description: Additional note for the vaccination record
*         date:
*           type: string
*           format: date-time
*           description: Date of vaccination
*         nextDate:
*           type: string
*           format: date-time
*           description: Next vaccination date
*         created_at:
*           type: string
*           format: date-time
*           description: Date of creation
*
*     RoutineCareRecord:
*       type: object
*       properties:
*         pet:
*           type: string
*           description: ID of the pet associated with this routine care record
*         activity:
*           type: string
*           enum:
*             - Feeding
*             - Training
*             - Brushing
*             - Bathing
*             - Nail trimming
*             - Ear cleaning
*             - Teeth brushing
*             - Weighing
*             - Other
*           description: Type of routine care activity
*         note:
*           type: string
*           description: Additional note for the routine care record
*         cost:
*           type: number
*           description: Cost associated with the routine care activity
*         date:
*           type: string
*           format: date-time
*           description: Date of routine care activity
*         nextDate:
*           type: string
*           format: date-time
*           description: Next scheduled date for routine care activity
*         created_at:
*           type: string
*           format: date-time
*           description: Date of creation
*
*     VetVisit:
*       type: object
*       properties:
*         id:
*           type: string
*           description: ID of the vet visit
*         date:
*           type: string
*           format: date
*           description: Date of the vet visit
*         reason:
*           type: string
*           description: Reason for the vet visit
*
*     Allergy:
*       type: object
*       properties:
*         id:
*           type: string
*           description: ID of the allergy
*         name:
*           type: string
*           description: Name of the allergy
*
*     Medication:
*       type: object
*       properties:
*         id:
*           type: string
*           description: ID of the medication
*         name:
*           type: string
*           description: Name of the medication 
*
*     Pet:
*       type: object
*       properties:
*         name:
*           type: string
*           description: Name of the pet
*         age:
*           type: number
*           description: Age of the pet
*         species:
*           type: string
*           enum:
*             - MALE
*             - FEMALE
*           description: Species of the pet
*         breed:
*           type: string
*           description: Breed of the pet
*         weight:
*           type: number
*           description: Weight of the pet
*         description:
*           type: string
*           description: Description of the pet
*         birthday:
*           type: string
*           format: date
*           description: Birthday of the pet
*         image:
*           type: string
*           description: Image URL of the pet
*         chipNumber:
*           type: string
*           description: Chip number of the pet
*         medications:
*           type: array
*           items:
*             type: string
*           description: Array of medication IDs associated with the pet
*         allergies:
*           type: array
*           items:
*             type: string
*           description: Array of allergy IDs associated with the pet
*         vetVisits:
*           type: array
*           items:
*             type: string
*           description: Array of vet visit IDs associated with the pet
*         additionalImages:
*           type: array
*           items:
*             type: string
*           description: Array of additional image URLs of the pet
*         owner:
*           type: string
*           description: ID of the user who owns the pet
*         vaccinationRecords:
*           type: array
*           items:
*             type: string
*           description: Array of vaccination record IDs associated with the pet
*         routineCareRecords:
*           type: array
*           items:
*             type: string
*           description: Array of routine care record IDs associated with the pet
*         notes:
*           type: array
*           items:
*             type: string
*           description: Array of note IDs associated with the pet
*         expenses:
*           type: array
*           items:
*             type: string
*           description: Array of expense IDs associated with the pet
*         created_at:
*           type: string
*           format: date-time
*           description: Date of creation
*/