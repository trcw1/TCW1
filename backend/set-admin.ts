import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tcw1admin:Opemipo87$$@cluster0.k77ry0x.mongodb.net/tcw1?appName=Cluster0';

async function setAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    
    const db = mongoose.connection.db!;
    const result = await db.collection('users').updateOne(
      { email: 'tcw.1@hotmail.com' },
      { $set: { isAdmin: true } }
    );
    
    console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    
    if (result.matchedCount === 0) {
      console.log('❌ User not found');
    } else if (result.modifiedCount > 0) {
      console.log('✓ User set as admin successfully!');
    } else {
      console.log('ℹ User was already admin');
    }
    
    const user = await db.collection('users').findOne({ email: 'tcw.1@hotmail.com' });
    console.log('✓ Current isAdmin status:', user?.isAdmin);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

setAdmin();
