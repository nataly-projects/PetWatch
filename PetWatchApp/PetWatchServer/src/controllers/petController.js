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
const  {ActivityLogType, VaccineRecordType, RoutineCareActivity, ExpenseCategory } = require('../utils/enums');

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
                    { path: 'vetVisits' }
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
            match: { nextDate: { $gte: new Date() }},
            populate: {path: 'pet',select: 'name'} 
        });

        console.log('petWithUpcomingEvents: ', petWithUpcomingEvents);
        const upcomingEvents = [];

        // const upcomingEvents = [...petWithUpcomingEvents.vaccinationRecords, ...petWithUpcomingEvents.routineCareRecords];


        
        petWithUpcomingEvents.vaccinationRecords.forEach(vaccineRecord => {
                upcomingEvents.push({
                    ...vaccineRecord.toObject(),
                    actionType: 'Vaccine',
                    details: `Vaccine Type: ${vaccineRecord.vaccineType}`
                });
            });
      
        petWithUpcomingEvents.routineCareRecords.forEach(routineCareRecord => {
            upcomingEvents.push({
                ...routineCareRecord.toObject(),
                actionType: 'Routine Care',
                details: `Routine Care Type: ${routineCareRecord.activity}`
            });
        });

        petWithUpcomingEvents.vetVisits.forEach(visit => {
            upcomingEvents.push({
                ...visit.toObject(),
                actionType: 'Vet Visit',
                details: `The Reason: ${visit.reason}`
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

  console.log('petWithExpenses: ', petWithExpenses);
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

async function addPet (req, res) {
    try {
        console.log('add pet');
        const { userId } = req.params;
        const {newPet} = req.body;
        const imagePath = req.file.path;
        
console.log('file: ', req.file);
console.log('newPet: ', newPet);
const petData = JSON.parse(newPet);
console.log('petData: ', petData);
        let medicationIds, allergyIds, vaccinationIds, noteIds, rouineCareIds, expenseIds, vetVisitIds = [];

        // const newPet = new Pet({
        //     name: petData.name,
        //     age: petData.age,
        //     birthday: petData.birthday,
        //     breed: petData.breed,
        //     chipNumber: petData.chip,
        //     description: petData.description,
        //     owner: petData.owner,
        //     species: petData.species,
        //     weight: petData.weight,
        //     image: imagePath,
        // });
        // console.log('new pet: ', newPet);
        // await newPet.save();
        // const pet = newPet._id;

        // if (petData.expenses.length > 0) {
        //     expenseIds = await Promise.all(petData.expenses.map(async (expense) => {
        //         const newExpense = new Expense({ ...expense, pet });
        //         console.log('newExpense: ', newExpense);
        //         await newExpense.save();
        //         return newExpense._id;
        //     }));
        // }

        // if (petData.medications.length > 0) {
        //     medicationIds = await Promise.all(petData.medications.map(async (medication) => {
        //         const newMedication = new Medication({ ...medication, pet });
        //         await newMedication.save();
        //         return newMedication._id;
        //     }));
        // }

        // if (petData.allergies.length > 0) {
        //     allergyIds = await Promise.all(petData.allergies.map(async (allergy) => {
        //         const newAllergy = new Allergy({ ...allergy, pet });
        //         await newAllergy.save();
        //         return newAllergy._id;
        //     }));
        // }

        // if (petData.routineCareRecord.length > 0) {
        //     rouineCareIds = await Promise.all(petData.routineCareRecord.map(async (routineCare) => {
        //         const newRoutineCare = new RoutineCareRecord({ ...routineCare, pet });
        //         await newRoutineCare.save();
        //         return newRoutineCare._id;
        //     }));
        // }

        // if (petData.vaccinationRecord.length > 0) {
        //     vaccinationIds = await Promise.all(petData.vaccinationRecord.map(async (vaccine) => {
        //         const newVaccine = new VaccinationRecord({ ...vaccine, pet });
        //         await newVaccine.save();
        //         return newVaccine._id;
        //     }));
        // }

        // if (petData.vetVisits.length > 0) {
        //     vetVisitIds = await Promise.all(petData.vetVisits.map(async (visit) => {
        //         const newVisit = new VetVisit({ ...visit, pet });
        //         await newVisit.save();
        //         return newVisit._id;
        //     }));
        // }

        // if (petData.notes.length > 0) {
        //     noteIds = await Promise.all(petData.notes.map(async (note) => {
        //         const newNote = new Note({ ...note, pet });
        //         await newNote.save();
        //         return newNote._id;
        //     }));
        // }

        // // Update the pet document with the IDs of related data items
        // newPet.medications = medicationIds;
        // newPet.allergies = allergyIds;
        // newPet.vaccinationRecords = vaccinationIds;
        // newPet.routineCareRecords = rouineCareIds,
        // newPet.expenses = expenseIds;
        // newPet.notes = noteIds;
        // newPet.vetVisits = vetVisitIds;
        // await newPet.save();

        // // Find the user by ID and update the pets field
        // const updatedUser = await User.findByIdAndUpdate(
        //     userId,
        //     { $push: { pets: newPet._id } }, // Add the pet's ID to the pets array
        //     { new: true }
        // );

        // const weightActivityLog = new ActivityLog({
        //     userId: newPet.owner, 
        //     petId: newPet._id,
        //     actionType: ActivityLogType.PET_WEIGHT_UPDATE,
        //     details: `update weight to ${newPet.weight} `
        // });
        // await weightActivityLog.save();

        //   // Log the activity
        //   const activityLog = new ActivityLog({
        //     userId: newPet.owner, 
        //     petId: newPet._id,
        //     actionType: ActivityLogType.PET_ADDED
        // });
        // await activityLog.save();

        // res.status(201).json({ message: 'Pet added successfully', pet: newPet });
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

        // const pet = await Pet.findById(petId);
        // if (!pet) {
        //     return res.status(404).json({ error: 'Pet not found' });
        // }
        // // Extract paths of additional images from req.files and add them to pet.additionalImages
        // const additionalImagePaths = req.files.map(file => file.path);
        // pet.additionalImages = pet.additionalImages.concat(additionalImagePaths);

        // await pet.save();

        // res.status(201).json({ message: 'Pet Additional images added successfully' });

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
console.log('addPetMedication: ', medicationData);

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
console.log('addPetVetVisit: ', vetVisitData);

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

async function updateNoteById (req, res) {
    try {
        const { noteId } = req.params;
        const { noteData } = req.body;
console.log(noteId);
console.log(noteData);
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
        const { noteId } = req.params;
        const { content } = req.body;

        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        note.content = content;
        note.updatedDate = Date.now();
        await note.save();

        const pet = await Pet.findById(note.pet);
        // Update the corresponding note within the pet notes array
        const index = pet.notes.findIndex(note => note._id.toString() === noteId);
        if (index !== -1) {
            pet.notes[index] = note;
        }

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            actionType: ActivityLogType.NOTE_EDIT
        });
        await activityLog.save();

        res.status(200).json({ message: 'Note updated successfully', note });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Error while updating note, please try again later' });
    }
}

async function deleteAllergy (req, res) {
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
            actionType: ActivityLogType.NOTE_DELETE
        });
        await activityLog.save();

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting note, please try again later' });
    }
}

async function updateMedicationById (req, res) {
    try {
        const { noteId } = req.params;
        const { content } = req.body;

        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        note.content = content;
        note.updatedDate = Date.now();
        await note.save();

        const pet = await Pet.findById(note.pet);
        // Update the corresponding note within the pet notes array
        const index = pet.notes.findIndex(note => note._id.toString() === noteId);
        if (index !== -1) {
            pet.notes[index] = note;
        }

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            actionType: ActivityLogType.NOTE_EDIT
        });
        await activityLog.save();

        res.status(200).json({ message: 'Note updated successfully', note });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Error while updating note, please try again later' });
    }
}

async function deleteMedication (req, res) {
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
            actionType: ActivityLogType.NOTE_DELETE
        });
        await activityLog.save();

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting note, please try again later' });
    }
}

async function updateVetVisitById (req, res) {
    try {
        const { noteId } = req.params;
        const { content } = req.body;

        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        note.content = content;
        note.updatedDate = Date.now();
        await note.save();

        const pet = await Pet.findById(note.pet);
        // Update the corresponding note within the pet notes array
        const index = pet.notes.findIndex(note => note._id.toString() === noteId);
        if (index !== -1) {
            pet.notes[index] = note;
        }

         // Log the activity
         const activityLog = new ActivityLog({
            userId: pet.owner, 
            petId: petId,
            actionType: ActivityLogType.NOTE_EDIT
        });
        await activityLog.save();

        res.status(200).json({ message: 'Note updated successfully', note });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Error while updating note, please try again later' });
    }
}

async function deleteVetVisit (req, res) {
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
            actionType: ActivityLogType.NOTE_DELETE
        });
        await activityLog.save();

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting note, please try again later' });
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
    addPet,
    uploadAdditionalImageToNewPet,
    addPetVaccineRecord,
    addPetRoutineCare,
    addPetNote,
    addPetExpense,
    addPetAllergy,
    addPetMedication,
    addPetVetVisit,
    updateNoteById,
    updatePetById,
    deleteNote,
    deletePet,
    singleImageUpload,
    multipleImagesUpload,
};

/**
 * @swagger
 *paths:
*  /pets/{petId}/vaccinationRecord:
*    get:
*      summary: Get vaccination records for a pet by ID
*      tags:
*        - Pet
*      description: Retrieve vaccination records for a pet by its unique identifier.
*      parameters:
*        - in: path
*          name: petId
*          required: true
*          description: ID of the pet to retrieve vaccination records for
*          schema:
*            type: string
*      responses:
*        200:
*          description: Successfully retrieved the vaccination records
*          content:
*            application/json:
*              schema:
*                type: array
*                items:
*                  $ref: '#/components/schemas/VaccinationRecord'
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
*  /pets/{petId}/routineCare:
*    get:
*      summary: Get routine care records for a pet by ID
*      tags:
*        - Pet
*      description: Retrieve routine care records for a pet by its unique identifier.
*      parameters:
*        - in: path
*          name: petId
*          required: true
*          description: ID of the pet to retrieve routine care records for
*          schema:
*            type: string
*      responses:
*        200:
*          description: Successfully retrieved the routine care records
*          content:
*            application/json:
*              schema:
*                type: array
*                items:
*                  $ref: '#/components/schemas/RoutineCareRecord'
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
*  /users/{userId}/pets:
*    get:
*      summary: "Get pets by user ID"
*      tags:
*        - "User"
*      parameters:
*        - in: "path"
*          name: "userId"
*          required: true
*          description: "ID of the user to get pets for"
*          type: "string"
*      responses:
*        200:
*          description: "Successfully retrieved pets"
*          content:
*            application/json:
*              schema:
*                type: array
*                items:
*                  $ref: "#/components/schemas/Pet"
*        404:
*          description: "User not found"
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: User not found
*        500:
*          description: "Internal server error"
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: Internal server error
*  /pets/{petId}:
*    get:
*      summary: "Get pet by ID"
*      tags:
*        - "Pet"
*      parameters:
*        - in: "path"
*          name: "petId"
*          required: true
*          description: "ID of the pet to retrieve"
*          type: "string"
*      responses:
*        200:
*          description: "Successfully retrieved pet"
*          content:
*            application/json:
*              schema:
*                $ref: "#/components/schemas/Pet"
*        404:
*          description: "Pet not found"
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: Pet not found.
*        500:
*          description: "Internal server error"
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: Internal server error
* 
 *  /pets/{petId}/note:
 *   get:
 *     summary: Get notes for a pet by ID
 *     tags:
 *       - Pet
 *     description: Retrieve notes for a pet by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: ID of the pet to retrieve notes for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
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
 * /pets/{petId}/expense:
 *   get:
 *     summary: Get expenses for a pet by ID
 *     tags:
 *       - Pet
 *     description: Retrieve expenses for a pet by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: ID of the pet to retrieve expenses for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
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
 * /pets/{petId}/activityLog:
 *   get:
 *     summary: Get activity logs for a pet by ID
 *     tags:
 *       - Pet
 *     description: Retrieve activity logs for a pet by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: ID of the pet to retrieve activity logs for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the activity logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActivityLog'
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
 * /pets/{petId}/weightTracker:
 *   get:
 *     summary: Get weight tracker logs for a pet by ID
 *     tags:
 *       - Pet
 *     description: Retrieve weight tracker logs for a pet by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: ID of the pet to retrieve weight tracker logs for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the weight tracker logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActivityLog'
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
 * /pets/{petId}/upcomingEvents:
 *  get:
 *   summary: Get upcoming events for a pet by ID
 *   tags:
 *     - Pet
 *   description: Retrieve upcoming events for a pet by its unique identifier.
 *   parameters:
 *     - in: path
 *       name: petId
 *       required: true
 *       description: ID of the pet to retrieve upcoming events for
 *       schema:
 *         type: string
 *   responses:
 *     200:
 *       description: Successfully retrieved the user upcoming events
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 nextDate:
 *                   type: string
 *                   format: date-time
 *                   description: The date of the upcoming event
 *                 actionType:
 *                   type: string
 *                   description: The type of action for the event (Vaccine, Routine Care, Vet Visit, etc.)
 *                 details:
 *                   type: string
 *                   description: Additional details about the event
 *     404:
 *       description: Pet not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Pet not found.
 *     500:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Internal server error.
 * 
 * /pets/{petId}/expensesArrays:
 *  get:
 *   summary: Get expenses arrays for a pet by ID
 *   tags:
 *     - Pet
 *   description: Retrieve different arrays of expenses data for a pet by its unique identifier.
 *   parameters:
 *     - in: path
 *       name: petId
 *       required: true
 *       description: ID of the pet to retrieve expenses arrays for
 *       schema:
 *         type: string
 *   responses:
 *     200:
 *       description: Successfully retrieved the expenses arrays
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               allExpenses:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Expense'
 *                 description: Array of all expenses for the pet
 *               monthlyExpensesChartData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     month:
 *                       type: number
 *                       description: Month index (1-12)
 *                     amount:
 *                       type: number
 *                       description: Total expenses for the month
 *                 description: Array of monthly expenses data
 *               categoryExpensesChartData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: string
 *                       description: Expense category
 *                     amount:
 *                       type: number
 *                       description: Total expenses for the category
 *                 description: Array of category expenses data
 *     404:
 *       description: Pet not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Pet not found.
 *     500:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Internal server error.
 * 
* components:
*  schemas:
*    VaccinationRecord:
*      type: object
*      properties:
*        pet:
*          type: string
*          description: ID of the pet associated with this vaccination record
*        vaccineType:
*          type: string
*          enum: 
*            - DHPP
*            - Rabies
*            - Vaccination against Esophagus Worms
*            - Flea and Tick Treatment
*            - Deworming
*            - FVRCP
*            - FeLV
*            - Other
*          description: Type of vaccine
*        note:
*          type: string
*          description: Additional note for the vaccination record
*        date:
*          type: string
*          format: date-time
*          description: Date of vaccination
*        nextDate:
*          type: string
*          format: date-time
*          description: Next vaccination date
*        created_at:
*          type: string
*          format: date-time
*          description: Date of creation
*
*    RoutineCareRecord:
*      type: object
*      properties:
*        pet:
*          type: string
*          description: ID of the pet associated with this routine care record
*        activity:
*          type: string
*          enum:
*            - Feeding
*            - Training
*            - Brushing
*            - Bathing
*            - Nail trimming
*            - Ear cleaning
*            - Teeth brushing
*            - Weighing
*            - Other
*          description: Type of routine care activity
*        note:
*          type: string
*          description: Additional note for the routine care record
*        cost:
*          type: number
*          description: Cost associated with the routine care activity
*        date:
*          type: string
*          format: date-time
*          description: Date of routine care activity
*        nextDate:
*          type: string
*          format: date-time
*          description: Next scheduled date for routine care activity
*        created_at:
*          type: string
*          format: date-time
*          description: Date of creation
*
*    Pet:
*      type: object
*      properties:
*        name:
*          type: string
*          description: Name of the pet
*        age:
*          type: number
*          description: Age of the pet
*        species:
*          type: string
*          enum:
*            - MALE
*            - FEMALE
*          description: Species of the pet
*        breed:
*          type: string
*          description: Breed of the pet
*        weight:
*          type: number
*          description: Weight of the pet
*        description:
*          type: string
*          description: Description of the pet
*        birthday:
*          type: string
*          format: date
*          description: Birthday of the pet
*        image:
*          type: string
*          description: Image URL of the pet
*        chipNumber:
*          type: string
*          description: Chip number of the pet
*        medications:
*          type: array
*          items:
*            type: string
*          description: Array of medication IDs associated with the pet
*        allergies:
*          type: array
*          items:
*            type: string
*          description: Array of allergy IDs associated with the pet
*        vetVisits:
*          type: array
*          items:
*            type: string
*          description: Array of vet visit IDs associated with the pet
*        additionalImages:
*          type: array
*          items:
*            type: string
*          description: Array of additional image URLs of the pet
*        owner:
*          type: string
*          description: ID of the user who owns the pet
*        vaccinationRecords:
*          type: array
*          items:
*            type: string
*          description: Array of vaccination record IDs associated with the pet
*        routineCareRecords:
*          type: array
*          items:
*            type: string
*          description: Array of routine care record IDs associated with the pet
*        notes:
*          type: array
*          items:
*            type: string
*          description: Array of note IDs associated with the pet
*        expenses:
*          type: array
*          items:
*            type: string
*          description: Array of expense IDs associated with the pet
*        created_at:
*          type: string
*          format: date-time
*          description: Date of creation
*
 */