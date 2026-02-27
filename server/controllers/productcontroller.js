const { createProduct, getProducts, getProductsByCategory, getProductById , deleteProduct } = require("../model/productmodel");

// Mapping URL friendly → backend category
const categoryMap = {
  heavy: "heavy_equipment",
  farmland: "sell_rent_farmland",
  manure: "fertilizers_manure",
  accessories: "agri_accessories",
  homemade: "purely_homemade",
};

const addNewProduct = (req, res) => {
  const { category, nom, photo, description } = req.body;

  // Vérifier que la catégorie reçue est valide (backend format)
  const validBackendCategories = Object.values(categoryMap);
  if (!validBackendCategories.includes(category)) {
    return res.status(400).json({ 
      message: "Catégorie invalide. Catégories acceptées: " + validBackendCategories.join(", ")
    });
  }

  if (!nom || !photo || !description) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  createProduct({ category, nom, photo, description }, (err, id) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Produit ajouté", id });
  });
};

const getAllProducts = (req, res) => {
  getProducts((err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Produits récupérés", count: products.length, data: products });
  });
};

// CORRECTION ICI - Le problème était dans cette fonction
const getProductsByCategoryController = (req, res) => {
  const urlCategory = req.params.category; // ex: "heavy" depuis l'URL
  
  console.log("URL Category reçue:", urlCategory); // Debug
  console.log("CategoryMap:", categoryMap); // Debug
  
  const backendCategory = categoryMap[urlCategory]; // ex: "heavy_equipment"
  
  console.log("Backend Category mappée:", backendCategory); // Debug
  
  if (!backendCategory) {
    return res.status(400).json({ 
      message: "Catégorie invalide. Catégories acceptées: " + Object.keys(categoryMap).join(", ")
    });
  }

  getProductsByCategory(backendCategory, (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ 
      message: `Produits de ${backendCategory} récupérés`, 
      count: products.length, 
      data: products 
    });
  });
};

const getProductByIdController = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

  getProductById(id, (err, product) => {
    if (err) {
      if (err.message === "Produit non trouvé") return res.status(404).json({ message: "Produit non trouvé" });
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Produit récupéré", data: product });
  });
};

const getValidCategories = (req, res) => {
  const validCategories = [
    { key: "heavy", label: "Équipement lourd" },
    { key: "farmland", label: "Vente/Location terres agricoles" },
    { key: "manure", label: "Engrais et fumier" },
    { key: "accessories", label: "Accessoires agricoles" },
    { key: "homemade", label: "Purement fait maison" }
  ];
  res.status(200).json({ message: "Catégories valides", data: validCategories });
};


const deleteProductController = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

  deleteProduct(id, (err, affectedRows) => {
    if (err) {
      if (err.message === "Produit non trouvé") return res.status(404).json({ message: "Produit non trouvé" });
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Produit supprimé avec succès" });
  });
};

module.exports = { addNewProduct, getAllProducts, getProductsByCategoryController, getProductByIdController, getValidCategories , deleteProductController };