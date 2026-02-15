# Inventory Management System – Backend

Overview :-

This repository contains the backend API for the Inventory Management System (IMS). It is built with Node.js, Express, and MongoDB, providing endpoints for:

User authentication (Admin/Viewer)

Product management (CRUD, SKU auto-generation)

Stock management (IN/OUT, movement history, soft delete)

Role-based access control


**Features :-**

User Roles: ADMIN and VIEWER

Product Management: Create, Update, Delete, List Products

Stock Management:

Adjust stock with IN/OUT movements

Stock history with before/after quantities

Soft delete movements

Admin-only access to stock operations

Search: Products and stock history search by name, SKU, or date

Swagger Documentation: API endpoints documented for easy testing



**Tech Stack :-**

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Bcryptjs for password hashing

Swagger for API documentation


# Setup

1. Clone the repository

git clone https://github.com/satishdwivedi-01/Inventory-Management-Server
cd inventory-backend

2. Install dependencies

npm install

3. Environment Variables
Create a .env file at the root:

PORT=5000
MONGO_URI=mongodb://localhost:27017/ims_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
CLIENT_URL=http://localhost:5173

4. Run the app  
npm run dev


**Scripts**
You can seed default users or run helper scripts from the src/scripts folder:

Seed Admin User :
node src/scripts/seedAdmin.js

Seed Viewer User:
node src/scripts/seedViewer.js

**API Documentation**

Swagger docs are available at:

http://localhost:5000/api-docs

**Notes**

All stock adjustments are tracked with beforeQuantity and afterQuantity.

Soft delete is implemented for both products and stock movements.

Admin-only routes are protected by JWT and role-based middleware.