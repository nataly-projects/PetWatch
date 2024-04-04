const { Pet } =  require('../models/petModel');
const { User } = require('../models/userModel');
const { VaccinationRecord } = require('../models/vaccinationRecordModel');
const { RoutineCareRecord } = require('../models/routineCareRecordModel');
const { Note } = require('../models/noteModel');
const { Expense } = require('../models/expenseModel');

async function getPetsByUserId(req, res) {
    try {
        const { userId } = req.params;

        // const pets = await Pet.find({ owner: userId }).populate('category');
        const user = await User.findById(userId).populate('pets');
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

  async function getPetWeightTracker (req, res) {
    //TODO - think how to get the info
    try {
        const { petId } = req.params;
        const pet = await Pet.findById(petId);
        if (!pet) {
        return res.status(404).json({ error: 'Pet not found' });
        }
      
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function addPet (req, res) {
    try {
        console.log('add pet: ', req.body);
        const { userId } = req.params;
        const { name, species, breed, age, weight, description, chipNumber  } = req.body;

        const newPet = new Pet({
            name,
            species,
            breed,
            age,
            weight,
            description, 
            chipNumber,
            owner: userId,
        });
        await newPet.save();

        // Find the user by ID and update the pets field
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { pets: newPet._id } }, // Add the pet's ID to the pets array
            { new: true }
        );

        res.status(201).json({ message: 'Pet added successfully', pet: newPet });
    } catch (error) {
        res.status(500).json({ error: 'Error while adding pet, try again later' });
    }
}

async function addPetVaccineRecord (req, res) {
    try {
        const { petId } = req.params;
        const { vaccineType, note, date, nextDate } = req.body;

        // Create a new VaccinationRecord document
        const vaccinationRecord = new VaccinationRecord({
            vaccineType,
            note,
            date,
            nextDate,
            pet: petId
        });

        await vaccinationRecord.save();

        // const pet = await Pet.findById(petId);
        // if (!pet) {
        //     return res.status(404).json({ error: 'Pet not found' });
        // }
        // pet.vaccinationRecords.push({ vaccineName, vaccineType, note, date, nextDate });
        // await pet.save();

        // Find the pet by ID and update its vaccinationRecords array
        const pet = await Pet.findByIdAndUpdate(
            petId,
            { $push: { vaccinationRecords: vaccinationRecord._id } },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        res.status(201).json({ message: 'Vaccine record added successfully', vaccinationRecord });
    } catch (error) {
        res.status(500).json({ error: 'Error while adding vaccine record, please try again later' });
    }
}

async function addPetRoutineCare (req, res) {
    try {
        const { petId } = req.params;
        const { activity, note, date, nextDate } = req.body;

        // Create a new RoutineCareRecord document
        const routineCareRecord = new RoutineCareRecord({
            activity,
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
            category,
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
    addPet,
    addPetVaccineRecord,
    addPetRoutineCare,
    addPetNote,
    addPetExpense,
    updateNoteById,
    updatePetById,
    deleteNote,
    deletePet,
};