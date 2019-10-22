let express = require('express');
let router = express.Router();

const Clinic = require('../models/clinic');
const Invoice = require('../models/invoice');

const checkToken = require('../middleware/checkToken');

// POST /clinic *** new clinic ****
router.post('/clinic', checkToken.checkToken, (req, res, next) => {
    let token = req.decoded;

    let clinic = new Clinic({
        name: req.body.name,
        pay: req.body.pay,
        user: token.id
    });

    clinic.save((err, clinic) => {
        if (err) return next(err);
        res.status(200).json(clinic);
    });
});

// PUT /clinic/:id *** updating clinic ***
router.patch('/clinic/:id/update', checkToken.checkToken, (req, res, next) => {
    Clinic.findById(req.params.id, (err, clinic) => {
      if (err) {
        return res.json(err);
      }

      if (!clinic) {
        return res.status(500).json({
          message: 'Not clinic found',
          error: { message: 'No clinic found'}
        });
      }

      clinic.labCosts = clinic.labCosts.concat(req.body.labCosts);

      clinic.save((err, clinic) => {
        if (err) return next(err);
        res.status(200).json(clinic);
      });
    });
});

// GET a clinic
router.get('/clinic/:id', checkToken.checkToken, (req, res, next) => {
   Clinic.findById(req.params.id, (err, clinic) => {
       if (err) return next(err);

       if (!clinic) {
           throw new Error('Clinic not found');
       }

       res.status(200).json(clinic);
   });
});

// GET /clinics
router.get('/clinics', checkToken.checkToken, (req, res, next) => {
    let token = req.decoded;

    if (!token) {
        return res.status(401).json({
            message: 'Forbidden'
        });
    }

    Clinic.find({user: token.id}, (err, clinics) => {
      if (err) return next(err);
      res.status(200).json(clinics);
    });
});

// DELETE /clinics
router.delete('/clinic/:id', checkToken.checkToken, (req, res, next) => {

    Clinic.findById(req.params.id, (err, clinic) => {
      if (err) return next(err);

      if (!clinic) {
        return res.status(500).json({
          message: 'Not clinic found',
          error: { message: 'No clinic found'}
        });
      }

      clinic.remove((err, clinic) => {
        if (err) return next(err);

        Invoice.deleteMany({clinic: clinic._id}, (err, invoices) => {
            if (err) return next(err);
            res.json({
                clinic: clinic,
                invoices: invoices
            });
        });
      })
    });
});

/////////// Invoices Section ////////////////////

router.post('/:id/invoice', checkToken.checkToken, (req, res, next) => {
    let user = req.decoded;

    Clinic.findById(req.params.id, (err, clinic) => {
      if (err) return next(err);
      let invoice = new Invoice({
            clinic: clinic._id,
            clinicHistory: req.body.clinicHistory,
            name: req.body.name,
            treatments: req.body.treatments,
            price: req.body.price,
            user: user.id
      });

      invoice.save((err, invoice) => {
        if (err) return next(err);
        res.status(200).json(invoice);
      })
    });
});

router.get('/:id/invoices', checkToken.checkToken, (req, res, next) => {
    let user = req.decoded;
    Invoice.find({clinic: req.params.id, user: user.id}, (err, invoices) => {
      if (err) return next(err);
      res.status(200).json(invoices);
    });
});

// Getting all invoices for calculations
router.get('/allInvoices', checkToken.checkToken, (req, res, next) => {
   let user = req.decoded;
   Invoice.find({user: user.id}, (err, invoices) => {
       if (err) return next(err);
       res.status(200).json(invoices);
   });
});

// Posting new treatments


module.exports = router;
