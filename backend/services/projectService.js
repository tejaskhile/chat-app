import mongoose from "mongoose";
import projectModel from "../models/projectModel.js";

export const createProject = async ({
    name , userId
}) => {
    if(!name || !userId){
        throw new Error('Name and userId are required')
    }
    return await projectModel.create({
        name, 
        users: [ userId ]
    })
}

export const allUserProjects = async ({userId}) => {
    if(!userId){
        throw new Error('userId is required')
    }

    return await projectModel.find({users: userId})
}

export const addUsersToProject = async ({projectId, users, userId}) => {
    if(!projectId || !users){
        throw new Error('projectId and users are required')
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Invalid project ID')
    }

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error('Invalid user ID')
    }
    
    if(!Array.isArray(users)){
        throw new Error('Users must be an array')
    }

    if(!userId){
        throw new Error('userId is required')
    }

    const project = await projectModel.findOne({
        _id: projectId,
        users: userId    
    });

    if(!project){
        throw new Error('Project not found')
    }

    const updatedProject = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        $addToSet: {users: {$each: users}}
    }, {new: true})

    return updatedProject;
}

export const getProjectById = async ({projectId}) => {

    if(!projectId){
        throw new Error('projectId is required')
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Invalid project ID')
    }

    const project = await projectModel.findOne({
        _id: projectId
    }).populate('users');

    return project 
}