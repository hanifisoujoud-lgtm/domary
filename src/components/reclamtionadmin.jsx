// src/pages/ReclamationAdmin.jsx
import React, { useState, useEffect } from 'react';

const Reclamationadmin = () => {
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = 'http://localhost:5000';

    // Fonction pour récupérer toutes les réclamations
    const fetchReclamations = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/reclamations`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const result = await response.json();
            // Assurez-vous que les données sont un tableau
            setReclamations(Array.isArray(result.data) ? result.data : []);
        } catch (err) {
            console.error("Erreur lors de la récupération des réclamations:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour supprimer une réclamation
    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette réclamation ?")) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/reclamations/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            // Mettre à jour la liste sans recharger la page
            setReclamations(reclamations.filter(reclamation => reclamation.id !== id));
            alert("Réclamation supprimée avec succès.");
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
            setError(err.message);
            alert("Erreur lors de la suppression de la réclamation.");
        }
    };

    // Charger les réclamations au montage du composant
    useEffect(() => {
        fetchReclamations();
    }, []);

    // Fonction pour formater la date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    // Affichage des états de chargement et d'erreur
    if (loading) {
        return <div className="text-center mt-5">Chargement des réclamations...</div>;
    }
    if (error) {
        return <div className="alert alert-danger text-center mt-5">Erreur: {error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Administration des Réclamations</h1>
            <div className="card shadow-sm">
                <div className="card-body">
                    {reclamations.length === 0 ? (
                        <div className="alert alert-info text-center" role="alert">
                            Aucune réclamation trouvée.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Nom Complet</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Message</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reclamations.map((reclamation) => (
                                        <tr key={reclamation.id}>
                                            <td>{reclamation.id}</td>
                                            <td>{reclamation.fullname}</td>
                                            <td>{reclamation.email}</td>
                                            <td style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {reclamation.message}
                                            </td>
                                            <td>{formatDate(reclamation.created_at)}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(reclamation.id)}
                                                >
                                                    <i className="bi bi-trash"></i> Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reclamationadmin;