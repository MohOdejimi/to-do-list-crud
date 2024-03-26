const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient

const PORT = 3030

require('dotenv').config()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'


MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
.then(client => {
    console.log(`Connected to ${dbName} Database`)
    db = client.db(dbName)
}).catch((e) => {
    console.log(e);
    console.log("Error Connecting to DB");
})    

app.get('/', (request, response) => {
    db.collection('tasks').find().toArray()
    .then(data => {
        db.collection('tasks').countDocuments({completed: false})
        .then(items => {
            console.log(data, items)
            response.render('index.ejs', {tasks: data, itemsLeft: items})
        })  
    })
    .catch(error => {
        console.error(error)
    })
})

app.post('/addTask', (request, response) => {
    console.log(request.body)
    db.collection('tasks').insertOne({
        task: request.body.task,
        completed: false
    })
    .then(data => {
        console.log('Task added')
        console.log(data)
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    console.log(request.body);
    try {
        db.collection('tasks').updateOne(
            { task: request.body.taskToBeCompleted },
            { $set: { completed: true } }
        );
        console.log('Task Completed');
        response.json('Marked Complete');
    } catch (err) {
        console.log(err);
    }
});


app.listen(PORT, () => {
    console.log("Server is running on port 3030, you better go run to catch it");
})