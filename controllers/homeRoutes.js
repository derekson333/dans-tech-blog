const router = require('express').Router();
const { User, Post } = require('../models');
const withAuth = require('../utils/auth')

// GET route to render the homepage
router.get('/', async (req, res) => {
    try {
        const usersData = await User.findAll()
        const users = usersData.map((user) => user.get({ plain: true }))

        const recipesData = (await Recipe.findAll({
            include: {
                model: User,
                attributes: ['user_name']
            }
        })).slice(0, 8);
        const recipes = recipesData.map((recipe) => recipe.get({ plain: true }))
        
        res.status(200).render('homepage', { 
            users, 
            recipes,
            logged_in: req.session.logged_in,
            user_id: req.session.user_id
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET route to render the login page
router.get('/login', (req, res) => {
    try {
        if (req.session.logged_in) {
            res.redirect(`/users/${req.session.user_id}`);
            return;
        };

        res.status(200).render('login');
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET route to render the sign up page
router.get('/signup', (req, res) => {
    try {
        if (req.session.logged_in) {
            res.redirect('/');
            return;
        };

        res.status(200).render('signup', {});
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router; 