const express = require('express');
const router = express.Router();
const checkToken = require('../middleware/checkToken');

const Treatment = require('../models/treatment');
const Clinic = require('../models/clinic');

router.post('/:id', checkToken.checkToken, (req, res, next) => {
    let token = req.decoded;

    Clinic.findById(req.params.id, (err, clinic) => {
        if (err) return next(err);

        if (!clinic) {
            throw new Error('Clinic not found');
        }

        let treatment = new Treatment({
            name: req.body.name,
            value: req.body.value,
            clinic: clinic._id,
            user: token.id
        });

        treatment.save((err, treatment) => {
            if (err) return next(err);
            res.status(200).json(treatment);
        });
    });
});

router.get('/:id/treatments', checkToken.checkToken, (req, res, next) => {
    let token = req.decoded;

    Clinic.findById(req.params.id, (err, clinic) => {
       if (err) return next(err);

       if (!clinic) {
           throw new Error('Clinic not found');
       }

       Treatment.find({clinic: clinic._id, user: token.id}, (err, treatments) => {
           if (err) return next(err);
           res.status(200).json(treatments);
       });
    });
});

router.put('/:id', checkToken.checkToken, (req, res, next) => {
   let token = req.decoded;

   Treatment.findById(req.params.id, (err, treatment) => {
       if (err) return next(err);

       if (!treatment) {
           throw new Error('Treatment not found');
       }

       treatment.name = req.body.name;
       treatment.value = req.body.value;

       treatment.save((err, treatment) => {
           if (err) return next(err);
           res.status(200).json(treatment);
       });
   });
});

router.delete('/:id', checkToken.checkToken, (req, res, next) => {
   Treatment.findById(req.params.id, (err, treatment) => {
      if (err) return next(err);

      if (!treatment) {
          throw new Error('Treatment not found');
      }

      if (treatment.user !== req.decoded.id) {
          throw new Error('User not found');
      }

      treatment.remove((err, treatment) => {
          if (err) return next(err);
          res.status(200).json(treatment);
      });
   });
});

module.exports = router;
