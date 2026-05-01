import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  company: string;
  role: string;
  duration: string;
  description: string;
  logo?: string;
  type: 'work' | 'leadership' | 'hackathon' | 'workshop';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String },
    type: {
      type: String,
      enum: ['work', 'leadership', 'hackathon', 'workshop'],
      default: 'work',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);
