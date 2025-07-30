const db = require('../db');

exports.getAllDepenses = (req, res) => {
  const sql = `
    SELECT d.id, d.description, d.montant, d.date_creation,
           m.nom, m.prenom, m.role
    FROM depense d
    LEFT JOIN membre m ON d.responsable = m.id
    ORDER BY d.date_creation DESC
  `;

  db.query(sql, (err, depenses) => {
    if (err) {
      console.error('Erreur lors de la récupération des dépenses :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const depensesAvecResponsable = depenses.map(d => ({
      ...d,
      nom: d.nom ?? "Inconnu",
      prenom: d.prenom ?? "",
      role: d.role ?? "Inconnu"
    }));

    res.json(depensesAvecResponsable);
  });
};

exports.createDepense = (req, res) => {
  const { description, montant, responsable } = req.body;

  if (!description || !montant || !responsable) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const sql = `INSERT INTO depense (description, montant, responsable) VALUES (?, ?, ?)`;

  db.query(sql, [description, montant, responsable], (err, result) => {
    if (err) {
      console.error('Erreur lors de la création de la dépense :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    res.status(201).json({ message: 'Dépense ajoutée avec succès', id: result.insertId });
  });
};
