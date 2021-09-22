//Main file
const express = require('express')
require('./db/mongoose')
const app = express()
const userRouter = require('./routers/userRouter')
const recipeRouter = require('./routers/recipeRouter')
const commentRouter = require('./routers/commentRouter')

app.set('port', process.env.PORT || 3000)
app.use(express.json())
app.use(userRouter)
app.use(recipeRouter)
app.use(commentRouter)

app.listen(app.get('port'), () => {
    console.log('app is running on port ' + app.get('port'))
})