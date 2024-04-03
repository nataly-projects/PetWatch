const { Pet } =  require('../models/petModel');
const { User } = require('../models/userModel');

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

async function getPetsById(req, res) {
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
        res.status(201).json({ message: 'Pet added successfully', pet: newPet });
    } catch (error) {
        res.status(500).json({ error: 'Error while adding pet, try again later' });
    }
}

async function addPetVaccineRecord (req, res) {
    try {
        const { petId } = req.params;
        const { vaccineName, vaccineType, note, date, nextDate } = req.body;

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        pet.vaccinationRecords.push({ vaccineName, vaccineType, note, date, nextDate });
        await pet.save();
        res.status(201).json({ message: 'Vaccine record added successfully', pet });
    } catch (error) {
        res.status(500).json({ error: 'Error while adding vaccine record, please try again later' });
    }
}

async function addPetRoutineCare (req, res) {
    try {
        const { petId } = req.params;
        const { activity, date } = req.body;
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        pet.routineCare.push({ activity, note, cost, date, nextDate });
        //TODO - if there is cost value - add it to the pet expense fiels 
        //with the expenses type - ExpenseCategory.RoutineCare
        await pet.save();
        res.status(201).json({ message: 'Routine care record added successfully', pet });
    } catch (error) {
        console.error('Error adding routine care record:', error);
        res.status(500).json({ error: 'Error while adding routine care record, please try again later' });
    }
}

async function addPetNote (req, res) {
    try {
        const { petId } = req.params;
        const { title, content } = req.body;
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        pet.notes.push({ createdDate, content, updatedDate });
        await pet.save();
        res.status(201).json({ message: 'Note added successfully', pet });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Error while adding note, please try again later' });
    }
}

async function addPetExpense (req, res) {
    try {
        const { petId } = req.params;
        const { category, amount, date } = req.body;

        //Add row in the pet expenses row
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        pet.expenses.push({ category, amount, date, note });
        await pet.save();

        //Add to the totalExpenses for the pet owner
        const user = await User.findById(pet.owner);
        user.totalExpenses += amount;
        await user.save();

        res.status(201).json({ message: 'Expense added successfully', pet });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Error while adding expense, please try again later' });
    }
}

async function editNote (req, res) {
    try {
        const { petId, noteId } = req.params;
        const { updatedNote } = req.body;

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        const noteIndex = pet.notes.findIndex(note => note._id.toString() === noteId);
        if (noteIndex === -1) {
            return res.status(404).json({ error: 'Note not found' });
        }
        pet.notes[noteIndex] = updatedNote;
        await pet.save();
        res.status(200).json({ message: 'Note updated successfully', updatedNote });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Error while updating note, please try again later' });
    }
}

async function deleteNote (req, res) {
    try {
        const { petId, noteId } = req.params;

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        pet.notes = pet.notes.filter(note => note._id.toString() !== noteId);
        await pet.save();
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while deleting note, please try again later' });
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
    getPetsById,
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
    editNote,
    deleteNote,
    deletePet,
};