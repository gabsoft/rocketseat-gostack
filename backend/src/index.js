const { response } = require('express')
const express = require('express')
const { uuid, isUuid } = require('uuidv4')

const app = express()

app.use(express.json())

const projects = []

function logRequests(req, res, next){
    const { method, url } = req

    const logLabel = `[${method.toUpperCase()}] ${url}`

    console.log(logLabel)

    return next()
}

function validateProjectId(req, res, next){
    console.log(req)
    const { id } = req.params

    if(!isUuid(id)){
        return res.status(400).json({error: 'Invalid Project ID.'})
    }

    return next()
}

app.use(logRequests)

app.get('/projects', (req, res) => {

    const { title } = req.query

    const results = title ? projects.filter(project => project.title.toLowerCase().includes(title.toLowerCase())) : projects
 
    return res.json(results)
})

app.post('/projects', (req, res) => {
    const { title, owner } = req.body

    const project = { id: uuid(), title, owner }

    projects.push(project)

    return res.json(project)
})

app.put('/projects/:id', validateProjectId, (req, res) => {
    const { id } = req.params
    const { title, owner } = req.body


    const projectIndex = projects.findIndex( project => project.id === id)

    projectIndex < 0 ? response.status(400).json({error: "Project not found"}) : false

    const project = {
        id,
        title,
        owner
    }

    projects[projectIndex] = project

    return res.json(project)
})


app.delete('/projects/:id', validateProjectId, (req, res) => {
    const { id } = req.params

    const projectIndex = projects.findIndex( project => project.id === id)

    projectIndex < 0 ? response.status(400).json({error: "Project not found"}) : false

    projects.splice(projectIndex, 1)

    return res.send()
})

app.listen(3333, () =>{
    console.log("🚀 Back-end started on port 3333!")
})