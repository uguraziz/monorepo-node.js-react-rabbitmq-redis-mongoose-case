import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Project = mongoose.model('Project', ProjectSchema);

export const projectRepository = {
  async create(data) {
    const project = new Project(data);
    return project.save();
  },
  
  async findById(id) {
    return Project.findById(id).populate('ownerId', 'email').populate('members', 'email');
  },
  
  findAll(query = {}) {
    return Project.find(query).populate('ownerId', 'email').populate('members', 'email');
  },
  
  async update(id, data) {
    return Project.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
  },
  
  async delete(id) {
    return Project.findByIdAndDelete(id);
  },
  
  async addMember(projectId, userId) {
    return Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: userId } },
      { new: true }
    );
  },
  
  async removeMember(projectId, userId) {
    return Project.findByIdAndUpdate(
      projectId,
      { $pull: { members: userId } },
      { new: true }
    );
  },
};

