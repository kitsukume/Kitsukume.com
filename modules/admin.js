import express from 'express';
import db from './db.js';
import dotenv from 'dotenv';
dotenv.config();
const adminRouter = express.Router();



adminRouter.post('/manage-role', async (req, res) => {
    const { userId, roleName, process } = req.body;
  
    try {
      // Query for role
      const roleResult = await db.query('SELECT id FROM roles WHERE name = $1', [roleName]);
      if (roleResult.rows.length === 0) {
        return res.json({ message: 'Role not found' });
      }
  
      const roleId = roleResult.rows[0].id;
  
      // Process assignment or removal
      if (process === 'assign') {
        await db.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, roleId]);
      } else if (process === 'remove') {
        const deleteResult = await db.query('DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2', [userId, roleId]);
        if (deleteResult.rowCount === 0) {
          return res.json({ message: 'Role not assigned to user' });
        }
      } else {
        return res.json({ message: 'Invalid action' });
      }
  
      // Query all users for updating the table
      const usersResult = await db.query(`
        SELECT users.id, users.email, array_agg(roles.name) AS roles
        FROM users
        LEFT JOIN user_roles ON users.id = user_roles.user_id
        LEFT JOIN roles ON user_roles.role_id = roles.id
        GROUP BY users.id
      `);
      const users = usersResult.rows;
      
      // Send the response only once
      res.json({ message: 'Operation successful', users });
  
    } catch (err) {
      console.error(err);
      // Ensure only one response is sent
      if (!res.headersSent) {
        res.json({ message: 'Failed to process request' });
      }
    }
  });

  
 


  adminRouter.get('/stream', async (req, res) => {
    if (req.isAuthenticated()) {
      console.log(req.user); // Log the user object to verify it's being passed
  
      if (req.user.roles.includes('admin')) {
        try {
          const result = await db.query(`
            SELECT u.id, u.email, array_agg(r.name) AS roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            GROUP BY u.id;
          `);
          const users = result.rows;
          const streamKey = process.env.STREAM_KEY; 
          res.render('admin/stream', { streamKey, user: req.user, users });
        } catch (err) {
          console.error(err);
          res.status(500).send('Server error');
        }
      } else {
        res.status(403).send('Access denied. Admins only.');
      }
    } else {
      res.redirect('/home');
    }
  });





// Route to display the admin dashboard
adminRouter.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
      if (req.user.roles.includes('admin')) {
        try {
          const result = await db.query(`
            SELECT u.id, u.email, array_agg(r.name) AS roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            GROUP BY u.id;
          `);
          const users = result.rows;

          res.render('admin/admin-dashboard', { user: req.user, users });
        } catch (err) {
          console.error(err);
          res.status(500).send('Server error');
        }
      } else {
        res.status(403).send('Access denied. Admins only.');
      }
    } else {
      res.redirect('/home');
    }
  });

export default adminRouter;
