// MongoDB initialization script for CloudBlitz
// This script creates initial collections and indexes

// Switch to the cloudblitz database
db = db.getSiblingDB('cloudblitz');

// Create collections
db.createCollection('users');
db.createCollection('enquiries');

// Create indexes for better performance
// Users collection indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ createdAt: 1 });

// Enquiries collection indexes
db.enquiries.createIndex({ status: 1 });
db.enquiries.createIndex({ assignedTo: 1 });
db.enquiries.createIndex({ email: 1 });
db.enquiries.createIndex({ createdAt: 1 });
db.enquiries.createIndex({ deletedAt: 1 }, { sparse: true });

// Create compound indexes
db.enquiries.createIndex({ status: 1, createdAt: -1 });
db.enquiries.createIndex({ assignedTo: 1, status: 1 });

// Text index for search functionality
db.enquiries.createIndex({
  customerName: "text",
  email: "text",
  message: "text"
}, {
  name: "enquiry_search_index"
});

// Create default admin user
db.users.insertOne({
  name: "System Administrator",
  email: "admin@cloudblitz.com",
  passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: password
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
});

print("✅ CloudBlitz database initialized successfully!");
print("📧 Default admin user: admin@cloudblitz.com");
print("🔑 Default password: password");
print("⚠️  Please change the default password in production!");