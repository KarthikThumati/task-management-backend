const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('../../schema/user');
const Task = require('../../schema/task');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require("../../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET;
router.use(bodyParser.json())


router.post('/api/signup', async (req, res) => {
     const { name, email, password } = req.body
     
     if (!name || typeof name !== 'string') {
         return res.json({ status: 'error', error: 'Invalid name' })
      }
        
        if (!password || typeof password !== 'string') {
            return res.json({ status: 'error', error: 'Invalid password' })
        }
        
        if (password.length < 5) {
            return res.json({
                status: 'error',
                error: 'Password too small. Should be atleast 6 characters'
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const response = await User.create({
            name,
			email,
			password: hashedPassword
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' });
  }
);

router.post('/api/login', async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email }).lean()


	if (!user) {
		return res.json({ status: 'error', error: 'Invalid email/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the email, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				email: user.email
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', token: token })
	}

	res.json({ status: 'error', error: 'Invalid emmail/password' });
})


router.post('/api/createTask', auth, async (req, res) => {
	const { task, priority, status, start_date, end_date } = req.body;

    const response = await Task.create({
        task,
        priority,
        status,
        start_date,
        end_date
    })
    console.log('Task created successfully: ', response);
	return res.json({ status: 'ok', data: response });

})


router.put('/api/editTask/:id', auth, async (req, res) => {
	
   const response = await Task.findOneAndUpdate({
       _id: req.params.id
    },{
		$set:{
		task:req.body.task,
        priority: req.body.priority,
        status: req.body.status,
        start_date: req.body.start_date,
        end_date: req.body.end_date
		}
	})
    console.log('Task update successfully: ', response);
	return res.json({ status: 'ok', data: response , message: "Task update successfully"});

})


router.get('/api/tasks', async (req, res) => {
	try{
        const data = await Task.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }

})


router.get('/api/task/:id', function (req, res, next) {
	Task.findById({_id: req.params.id})
	.then(result =>{
        res.status(200).json({
			message: 'product',
			result: result
		})
	})
	.catch(error =>{
		res.status(500).json({message: error.message});
	})
});


router.delete('/api/task/:id', function (req, res, next) {
	Task.findByIdAndRemove({_id: req.params.id})
	.then(result =>{
        res.status(200).json({
			message: 'product deleted',
			result: result
		})
	})
	.catch(error =>{
		res.status(500).json({message: error.message});
	})
});

module.exports = router;