const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Import cors

const server = express();
server.use(bodyParser.json());
server.use(cors()); // Use cors

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: "delice",
});

db.connect(function (error) {
  if (error) {
    console.log("Error connecting to db");
  } else {
    console.log("Successfully connected to db");
  }
});

server.listen(9002, function check(error) {
  if (error) console.log("Error ....||||");
  else console.log("Started ....|||| 9002");
});

// Add Product
server.post("/api/product/add", (req, res) => {
  const details = {
    ProductName: req.body.ProductName,
    Description: req.body.Description,
    Price: req.body.Price,
    StockQuantity: req.body.StockQuantity,
    CategoryID: req.body.CategoryID,
    SupplierID: req.body.SupplierID,
    ExpiryDate: req.body.ExpiryDate,
    ProductPhoto: req.body.ProductPhoto
  };

  const sql = "INSERT INTO product SET ?";
  db.query(sql, details, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send({ status: false, message: "Product creation failed" });
    } else {
      res.send({ status: true, message: "Product created successfully" });
    }
  });
});


// Get All Products
server.get("/api/product", (req, res) => {
  var sql = "SELECT * FROM product";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error connecting to db");
    } else {
      res.send({ status: true, data: result });
    }
  });
});

// Search Product by ID
server.get("/api/product/:id", (req, res) => {
  var productId = req.params.id;
  var sql = "SELECT * FROM product WHERE id=" + productId;
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error connecting to db");
    } else {
      res.send({ status: true, data: result });
    }
  });
});

// Update Product
server.put("/api/product/update/:id", (req, res) => {
  let sql = `UPDATE product SET
    ProductName='${req.body.ProductName}',
    Description='${req.body.Description}',
    Price='${req.body.Price}',
    StockQuantity='${req.body.StockQuantity}',
    CategoryID='${req.body.CategoryID}',
    SupplierID='${req.body.SupplierID}',
    ExpiryDate='${req.body.ExpiryDate}',
    ProductPhoto='${req.body.ProductPhoto}'
    WHERE id=${req.params.id}`;
  db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Product update failed" });
    } else {
      res.send({ status: true, message: "Product updated successfully" });
    }
    console.log(result);
  });
});

// Delete Product
server.delete("/api/product/delete/:id", (req, res) => {
  let sql = "DELETE FROM product WHERE id=" + req.params.id;
  db.query(sql, (error) => {
    if (error) {
      res.send({ status: false, message: "Product deletion failed" });
    } else {
      res.send({ status: true, message: "Product deleted successfully" });
    }
  });
});
//add user
server.post("/api/users/add", (req, res) => {
  const details = {
    name: req.body.name,
    mobile: req.body.mobile,
    password: req.body.password, // Note: Ensure this matches the database schema
  };

  const sql = "INSERT INTO users SET ?";
  db.query(sql, details, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send({ status: false, message: "User creation failed" });
    } else {
      res.send({ status: true, message: "User created successfully" });
    }
  });
});
// Get All users
server.get("/api/users", (req, res) => {
  var sql = "SELECT * FROM users";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error connecting to db");
    } else {
      res.send({ status: true, data: result });
    }
  });
});
// Delete Product
server.delete("/api/users/delete/:id", (req, res) => {
  let sql = "DELETE FROM users WHERE id=" + req.params.id;
  db.query(sql, (error) => {
    if (error) {
      res.send({ status: false, message: "user deletion failed" });
    } else {
      res.send({ status: true, message: "user deleted successfully" });
    }
  });
});

//POSTE SUPERMARKET
server.post("/api/supermarket/add", (req, res) => {
  const details = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    tel: req.body.tel,
    validation: req.body.validation,
  };
  const sql = "INSERT INTO supermarket SET ?";
  db.query(sql, details, (error, results) => {
    if (error) {
      console.error("Database error:", error); // Log error details
      console.error("SQL Query:", sql); // Log the SQL query
      console.error("Provided Data:", details); // Log the incoming data
      res.status(500).send({
        status: false,
        message: "Failed to register supermarket. Please try again later.",
      });
    } else {
      res.send({
        status: true,
        message: "Supermarket registered successfully!",
      });
    }
  });
});


//GET ALL SUPERMARKET 
server.get("/api/supermarket", (req, res) => {
  console.log("Request received for /api/supermarket");
  var sql = "SELECT * FROM supermarket";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error connecting to db", error);
      res.status(500).send({ status: false, message: "Error fetching supermarkets" });
    } else {
      res.send({ status: true, data: result });
    }
  });
});


/// Modifier uniquement le champ 'validation' d'un supermarché
server.patch("/api/supermarket/:id", (req, res) => {
  const supermarketId = req.params.id; // Récupérer l'ID du supermarché
  const validationStatus = req.body.validation; // Récupérer la nouvelle valeur de 'validation'

  // Vérifier que la valeur de 'validation' est correcte
  if (validationStatus !== 'true' && validationStatus !== 'false') {
    return res.status(400).send({
      status: false,
      message: "Validation status must be 'true' or 'false'.",
    });
  }

  // Requête SQL pour ne mettre à jour que le champ 'validation'
  const sql = "UPDATE supermarket SET validation = ? WHERE id = ?";
  db.query(sql, [validationStatus, supermarketId], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      res.status(500).send({
        status: false,
        message: "Failed to update supermarket validation. Please try again later.",
      });
    } else {
      if (results.affectedRows > 0) {
        res.send({
          status: true,
          message: "Supermarket validation updated successfully!",
        });
      } else {
        res.status(404).send({
          status: false,
          message: "Supermarket not found.",
        });
      }
    }
  });
});

// Supprimer un supermarché
server.delete("/api/supermarket/:id", (req, res) => {
  const supermarketId = req.params.id;

  const sql = "DELETE FROM supermarket WHERE id = ?";
  db.query(sql, [supermarketId], (error, results) => {
    if (error) {
      console.error("Database error:", error); 
      res.status(500).send({
        status: false,
        message: "Failed to delete supermarket. Please try again later.",
      });
    } else {
      if (results.affectedRows > 0) {
        res.send({
          status: true,
          message: "Supermarket deleted successfully!",
        });
      } else {
        res.status(404).send({
          status: false,
          message: "Supermarket not found.",
        });
      }
    }
  });
});





// Get supermarket by ID
server.get("/api/supermarket/:id", (req, res) => {
  const supermarketId = req.params.id;
  var sql = "SELECT * FROM supermarket WHERE id = ?";
  
  db.query(sql, [supermarketId], function (error, result) {
    if (error) {
      console.log("Error connecting to db", error);
      res.status(500).send({ status: false, message: "Error fetching supermarket" });
    } else {
      if (result.length > 0) {
        res.send({ status: true, data: result[0] });
      } else {
        res.status(404).send({ status: false, message: "Supermarket not found" });
      }
    }
  });
});



server.post('/api/panier/add', (req, res) => {
  const { idProduct, idSuperMarket, quantity, address, valider, Commander } = req.body;

  // Vérification des champs obligatoires
  if (!idProduct || !idSuperMarket || !quantity || !address) {
      return res.status(400).send({
          status: false,
          message: 'Tous les champs obligatoires doivent être renseignés.',
      });
  }

  // Vérifiez la longueur de l'adresse
  if (address.length > 20) {
      return res.status(400).send({
          status: false,
          message: 'L\'adresse est trop longue (maximum 20 caractères).',
      });
  }

  // Validation des valeurs "valider" et "Commander"
  const validValues = ['true', 'false'];
  if (!validValues.includes(valider) || !validValues.includes(Commander)) {
      return res.status(400).send({
          status: false,
          message: 'Les valeurs de "valider" et "Commander" doivent être "true" ou "false".',
      });
  }

  // Préparer la requête SQL pour insérer les données dans la table `panier`
  const sql = `
      INSERT INTO panier (idProduit, idSuperMarket, quantity, Address, valider, Commander)
      VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
      parseInt(idProduct),
      parseInt(idSuperMarket),
      parseInt(quantity),
      address,
      valider, // Insérer la chaîne de caractères ("true"/"false")
      Commander // Insérer la chaîne de caractères ("true"/"false")
  ];

  db.query(sql, values, (error, results) => {
      if (error) {
          console.error('Erreur lors de l\'ajout au panier:', error);
          return res.status(500).send({
              status: false,
              message: 'Erreur interne. Impossible d\'ajouter au panier.',
          });
      }

      res.send({
          status: true,
          message: 'Produit ajouté au panier avec succès !',
          panierId: results.insertId // Retourner l'ID si nécessaire
      });
  });
});


//GET PANIER BY SuperMarketId
server.get('/api/panier/get/:supermarketId', (req, res) => {
  const supermarketId = req.params.supermarketId;

  const sql = 'SELECT * FROM panier WHERE idSuperMarket = ?';
  db.query(sql, [supermarketId], (error, results) => {
    if (error) {
      return res.status(500).send({ status: false, message: 'Erreur lors de la récupération du panier.' });
    }
    res.send(results);
  });
});




