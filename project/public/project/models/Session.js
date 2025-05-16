import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true }, // minutos
    successful: { type: Boolean, default: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' } // se linkado a uma task
  });  

  export default mongoose.model('Routine', routineSchema);
