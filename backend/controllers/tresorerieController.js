const db = require('../db');

exports.getAllRevenus = (req, res) => {
  const sql = `
    SELECT r.id, r.source, r.montant, r.date_creation,
           m.nom, m.prenom, m.role
    FROM revenu r
    LEFT JOIN membre m ON r.responsable = m.id
    ORDER BY r.date_creation DESC
  `;

  db.query(sql, (err, revenus) => {
    if (err) {
      console.error('Erreur lors de la récupération des revenus :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const revenusAvecResponsable = revenus.map(r => ({
      ...r,
      nom: r.nom ?? "Inconnu",
      prenom: r.prenom ?? "",
      role: r.role ?? "Inconnu"
    }));

    res.json(revenusAvecResponsable);
  });
};

exports.createRevenu = (req, res) => {
  const { source, montant, responsable } = req.body;

  if (!source || !montant || !responsable) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const sql = `INSERT INTO revenu (source, montant, responsable) VALUES (?, ?, ?)`;

  db.query(sql, [source, montant, responsable], (err, result) => {
    if (err) {
      console.error('Erreur lors de la création du revenu :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.status(201).json({ message: 'Revenu ajouté avec succès', id: result.insertId });
  });
};
