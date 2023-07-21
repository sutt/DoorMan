const express = require('express');
const path = require('path');
const app = express();
const mockRunPredict = require('./mock-data/mock.run.predict.json');
const mockInternalProgress = require('./mock-data/mock.internal.progress.json');
const mockInfo = require('./mock-data/mock.info.json');

// console.log(mockInfo)

// Serve static files
app.use(express.static(path.join(__dirname, '../front-ui/v1')));

app.get('/info', (req, res) => {
    // res.json({'a':'ok'})
    res.json(mockInfo)
})

app.post('/run/predict', (req, res) => {
    res.json(mockRunPredict)
    // can use this route for timing of when frontend is loaded
    // and switch ws proxy to the right target
})

app.post('/internal/progress', (req, res) => {
    res.json(mockInternalProgress)
})

app.get('/admin', (req, res) => {
    res.json({'data':['admin', 'panel']})
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});