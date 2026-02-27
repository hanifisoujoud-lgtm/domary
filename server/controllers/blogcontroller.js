const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, getBlogsByStatus } = require("../model/blogmodel");

const addNewBlog = (req, res) => {
  const { title, content, image_url, author, status } = req.body;

  console.log("Données reçues pour blog:", req.body); // Debug

  // Validation
  if (!title || !content || !author) {
    return res.status(400).json({ message: "Titre, contenu et auteur sont requis." });
  }

  if (title.length < 5 || title.length > 255) {
    return res.status(400).json({ message: "Le titre doit contenir entre 5 et 255 caractères." });
  }

  if (content.length < 50) {
    return res.status(400).json({ message: "Le contenu doit contenir au moins 50 caractères." });
  }

  if (status && !['draft', 'published'].includes(status)) {
    return res.status(400).json({ message: "Statut invalide. Utilisez 'draft' ou 'published'." });
  }

  createBlog({ title, content, image_url, author, status }, (err, id) => {
    if (err) {
      console.error("Erreur création blog:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      message: "Blog créé avec succès", 
      id,
      data: { title, content, image_url, author, status }
    });
  });
};

const getAllBlogsController = (req, res) => {
  getAllBlogs((err, blogs) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ 
      message: "Blogs récupérés", 
      count: blogs.length, 
      data: blogs 
    });
  });
};

const getBlogByIdController = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

  getBlogById(id, (err, blog) => {
    if (err) {
      if (err.message === "Blog non trouvé") return res.status(404).json({ message: "Blog non trouvé" });
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Blog récupéré", data: blog });
  });
};

const updateBlogController = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

  const { title, content, image_url, author, status } = req.body;

  // Validation
  if (!title || !content || !author) {
    return res.status(400).json({ message: "Titre, contenu et auteur sont requis." });
  }

  if (title.length < 5 || title.length > 255) {
    return res.status(400).json({ message: "Le titre doit contenir entre 5 et 255 caractères." });
  }

  if (content.length < 50) {
    return res.status(400).json({ message: "Le contenu doit contenir au moins 50 caractères." });
  }

  if (status && !['draft', 'published'].includes(status)) {
    return res.status(400).json({ message: "Statut invalide. Utilisez 'draft' ou 'published'." });
  }

  updateBlog(id, { title, content, image_url, author, status }, (err, affectedRows) => {
    if (err) {
      if (err.message === "Blog non trouvé") return res.status(404).json({ message: "Blog non trouvé" });
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Blog mis à jour avec succès" });
  });
};

const deleteBlogController = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

  deleteBlog(id, (err, affectedRows) => {
    if (err) {
      if (err.message === "Blog non trouvé") return res.status(404).json({ message: "Blog non trouvé" });
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Blog supprimé avec succès" });
  });
};

const getBlogsByStatusController = (req, res) => {
  const { status } = req.params;
  
  if (!['draft', 'published'].includes(status)) {
    return res.status(400).json({ message: "Statut invalide. Utilisez 'draft' ou 'published'." });
  }

  getBlogsByStatus(status, (err, blogs) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ 
      message: `Blogs ${status} récupérés`, 
      count: blogs.length, 
      data: blogs 
    });
  });
};

module.exports = { 
  addNewBlog, 
  getAllBlogsController, 
  getBlogByIdController, 
  updateBlogController, 
  deleteBlogController, 
  getBlogsByStatusController 
};