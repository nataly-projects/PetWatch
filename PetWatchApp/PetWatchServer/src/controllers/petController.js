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

async function getPetsByUserId(req, res) {
    try {
        const { userId } = req.params;

        // const pets = await Pet.find({ owner: userId }).populate('category');
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
        console.log('add pet: ', req.body);
        const { userId } = req.params;
        const { name, species, breed, age, weight, description, chipNumber, birthday } = req.body;

        const newPet = new Pet({
            name,
            species,
            breed,
            age,
            weight,
            description, 
            chipNumber,
            birthday,
            owner: userId,
        });
        await newPet.save();

        // Find the user by ID and update the pets field
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { pets: newPet._id } }, // Add the pet's ID to the pets array
            { new: true }
        );

        const weightActivityLog = new ActivityLog({
            userId: newPet.owner, 
            petId: newPet._id,
            actionType: ActivityLogType.PET_WEIGHT_UPDATE,
            details: `update weight to ${weight} `
        });
        await weightActivityLog.save();

          // Log the activity
          const activityLog = new ActivityLog({
            userId: newPet.owner, 
            petId: newPet._id,
            actionType: ActivityLogType.PET_ADDED
        });
        await activityLog.save();

        res.status(201).json({ message: 'Pet added successfully', pet: newPet });
    } catch (error) {
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
        const { content } = req.body;

        // Create a new Note document
        const note = new Note({
            content,
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
            details: content
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
};