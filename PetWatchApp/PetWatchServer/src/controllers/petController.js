const { Pet } =  require('../models/petModel');

async function getPetsByUserId(req, res) {
    const { userId } = req.params;
    console.log(userId != null);

    if (userId != null) {
        try {
            const pets = await Pet.find({ owner: userId }).populate('category');
            return res.status(200).json({pets});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
    return res.status(200).json([]);  
}

async function getPetsById(req, res) {
    const { petId } = req.params;
    try {
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found.' });
        }
        return res.status(200).json({pet});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

module.exports = {
    getPetsById,
    getPetsByUserId,
};