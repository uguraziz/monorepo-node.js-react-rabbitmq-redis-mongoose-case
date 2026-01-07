import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Comment = mongoose.model('Comment', CommentSchema);

export const commentRepository = {
  async create(data) {
    const comment = new Comment(data);
    return comment.save();
  },
  
  async findById(id) {
    return Comment.findById(id).populate('userId', 'email').populate('taskId', 'title');
  },
  
  findAll(query = {}) {
    return Comment.find(query).populate('userId', 'email').populate('taskId', 'title');
  },
  
  async update(id, data) {
    return Comment.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
  },
  
  async delete(id) {
    return Comment.findByIdAndDelete(id);
  },
};

