import { Schema, model, Document } from 'mongoose';

export interface IAuditLog extends Document {
  adminId: Schema.Types.ObjectId;
  action: string;
  targetId?: string;
  details?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetId: { type: String },
  details: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
