import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Task = mongoose.model('Task', TaskSchema);

export const taskRepository = {
  async create(data) {
    const task = new Task(data);
    return task.save();
  },
  
  async findById(id) {
    return Task.findById(id)
      .populate('projectId', 'name')
      .populate('assigneeId', 'email')
      .populate('createdById', 'email');
  },
  
  findAll(query = {}) {
    return Task.find(query)
      .populate('projectId', 'name')
      .populate('assigneeId', 'email')
      .populate('createdById', 'email');
  },
  
  async update(id, data) {
    return Task.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
  },
  
  async delete(id) {
    return Task.findByIdAndDelete(id);
  },
};

