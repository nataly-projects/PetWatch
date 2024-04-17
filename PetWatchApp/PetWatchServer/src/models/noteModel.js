const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const NoteSchema = new Schema({
    pet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pet'
    },
    createdDate: { 
        type: Date, 
        default: Date.now 
    },
    updatedDate: { 
        type: Date, 
    },
    title: {
        type: String,
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    }
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = { Note, NoteSchema};
