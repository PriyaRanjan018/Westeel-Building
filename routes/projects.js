const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET - Get all projects
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        
        let query = {};
        if (category && category !== 'all') {
            query.category = category;
        }
        
        const projects = await Project.find(query).sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Failed to fetch projects' });
    }
});

// GET - Get single project
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Failed to fetch project' });
    }
});

// POST - Create new project (admin only)
router.post('/', async (req, res) => {
    try {
        // Add authentication middleware here for production
        const newProject = new Project(req.body);
        await newProject.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Project created successfully',
            project: newProject
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Failed to create project' });
    }
});

module.exports = router;