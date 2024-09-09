import express from 'express';
import db from './db.js';

const adminRouter = express.Router();

// Admin route to assign roles
adminRouter.post('/assign-role', async (req, res) => {
    const { userId, roleName } = req.body;
    
    try {
      const roleResult = await db.query('SELECT id FROM roles WHERE name = $1', [roleName]);
      
      if (roleResult.rows.length === 0) {
        return res.render('admin/admin-dashboard', { error: 'Role not found', user: {} });
      }
      
      const roleId = roleResult.rows[0].id;
      
      await db.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, roleId]);
  
      // Fetch user data
      const userResult = await db.query('SELECT email, permissions FROM users WHERE id = $1', [userId]);
      const user = userResult.rows[0] || { email: 'Unknown', permissions: [] }; // Provide defaults
      
      res.render('admin/admin-dashboard', {
        message: "Role assigned successfully",
        user,
        users: [] // Pass an empty array for users
      });
      
    } catch (error) {
      console.error(error);
      res.render('admin/admin-dashboard', { error: "Failed to assign role", user: {}, users: [] });
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
