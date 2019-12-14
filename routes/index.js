var express = require('express');
const jwt = require('jsonwebtoken');
var uuid = require('uuid');
var gerenciarToken = require('../util/jwt');

const ResponseLoginError = { message: 'Error in username or password' };
const ResponseNotFoundError = { message: 'Task not found' };

var router = express.Router();

var tasks = [];

/* Requisicao 01 */
router.get('/', function(req, res, next) {
  res.status(200).send({'message': 'ok'});
});

/* Requisicao 02 e 03 */
router.post('/login', (req, res) => {
  let body = req.body;
  if (body.username == 'usuario' && body.password == '123456') {
    var token = jwt.sign({ username: 'usuario', role: 'admin' }, gerenciarToken.PASS, {expiresIn: '1h'});
    res.status(200).send({ token });
  } else {
    res.status(401).send(ResponseLoginError);
  }
});

/* Requisicao 04 e 05*/
router.post('/tasks', gerenciarToken.verificarTokenJWT, (req, res) => {
  let body = req.body;

  const task = {
      title: body.title,
      description: body.description,
      isDone: body.isDone,
      isPriority: body.isPriority,
      id: uuid()
  };

    tasks.push(task);
    res.status(201).send(task);
});

/* Requisicao 06 e 10*/
router.get('/tasks', gerenciarToken.verificarTokenJWT, (req, res) => {
    res.status(200).send(tasks);
});

/* Requisicao 07 */
router.put('/tasks/:idDaQuestao04', gerenciarToken.verificarTokenJWT, (req, res) => {
  let idTask = req.params.idDaQuestao04;
  let updateTask;

  // Atualizar para pegar o corpo todo 
  tasks.forEach((task) => {
    if(task.id == idTask) {
      task.isDone = req.body.isDone
      updateTask = task;
    }
  });

  if(!updateTask){
    res.status(404).send(ResponseNotFoundError);
  }else{
    res.status(200).send(updateTask);
  }
  
});

/* Requisicao 08 */
router.get('/tasks/:idDaQuestao04', gerenciarToken.verificarTokenJWT, (req, res) => {
  var idTask = req.params.idDaQuestao04;
  var task = tasks.find(task => task.id == idTask);

  if(!task){
    res.status(404).send(ResponseNotFoundError);
  }else{
    res.status(200).send(task);
  }
});

/* Requisicao 09 */
router.delete('/tasks/:idDaQuestao04', gerenciarToken.verificarTokenJWT, (req, res) => {
  var idTask = req.params.idDaQuestao04;
  var task = tasks.find(task => task.id == idTask);

  if(!task){
    res.status(404).send(ResponseNotFoundError);
  }else{
    var index = tasks.findIndex(task => task.id == idTask);
    tasks.splice(index,1);
    res.status(200).send(task);
  }
})

module.exports = router;
