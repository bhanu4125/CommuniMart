import mongoose from 'mongoose';

export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (!mongoose.connection.db) return false;
    const admin = mongoose.connection.db.admin();
    const ping = await admin.ping();
    return Boolean(ping && ping.ok);
  } catch {
    return false;
  }
};
