var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    multer  = require('multer'),
    upload = multer({ dest: 'uploads/' }),
    type = upload.single('userFile')

var app = express()

app.set('port', process.env.PORT || 3000)
app.use(express.static(path.join(__dirname, 'public')))

// Middleware for logging all the requests:
function logger (req, res, next) {
    console.log(req.method, req.originalUrl)
    next()
}
app.use(logger)

// Have a landing page explainging how it works
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.post('/file', type, function (req, res, next) {
    var fileInfo = {
            filename: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size
        }

    // Delete the file, since we don't need it anymore,  to avoid filling up the memory:
    fs.unlink(req.file.path, function (err) {
        if (err) throw err
    })
    
    res.send(fileInfo)
})

// 404: Not found
app.use(function(req, res, next){
    res.status(404).json({ERROR: 'Page not found.'})
})

app.listen(app.get('port'))
console.log('Express server listening on port ' + app.get('port'))
