const db = require('../db');

exports.getSummary = (req, res) => {
  const sqlMembres = 'SELECT COUNT(*) AS totalMembres FROM membre';
  const sqlAnnonces = 'SELECT COUNT(*) AS annoncesActives FROM annonce';
  const sqlSolde = `
    SELECT
      (SELECT IFNULL(SUM(montant), 0) FROM revenu) AS totalRevenus,
      (SELECT IFNULL(SUM(montant), 0) FROM depense) AS totalDepenses
  `;

  const sqlRecentActivities = `
  SELECT type, created_at FROM (
    (SELECT 'membre' AS type, created_at FROM membre ORDER BY created_at DESC LIMIT 1)
    UNION ALL
    (SELECT 'annonce' AS type, created_at FROM annonce ORDER BY created_at DESC LIMIT 1)
    UNION ALL
    (SELECT 'revenu' AS type, date_creation AS created_at FROM revenu ORDER BY date_creation DESC LIMIT 1)
  ) AS recent_activities
  ORDER BY created_at DESC
`;


  db.query(sqlMembres, (err, membresResult) => {
    if (err) {
      console.error('Erreur SQL membres:', err);
      return res.status(500).json({ error: 'Erreur membres' });
    }

    db.query(sqlAnnonces, (err, annoncesResult) => {
      if (err) {
        console.error('Erreur SQL annonces:', err);
        return res.status(500).json({ error: 'Erreur annonces' });
      }

      db.query(sqlSolde, (err, soldeResult) => {
        if (err) {
          console.error('Erreur SQL solde:', err);
          return res.status(500).json({ error: 'Erreur solde' });
        }

        db.query(sqlRecentActivities, (err, recentResult) => {
          if (err) {
            console.error('Erreur SQL activités récentes:', err);
            return res.status(500).json({ error: 'Erreur activités récentes' });
          }

          try {
            const totalMembres = membresResult[0].totalMembres;
            const annoncesActives = annoncesResult[0].annoncesActives;
            const totalRevenus = soldeResult[0].totalRevenus;
            const totalDepenses = soldeResult[0].totalDepenses;
            const soldeActuel = totalRevenus - totalDepenses;
            const recentActivities = recentResult;

            res.json({
              totalMembres,
              annoncesActives,
              totalRevenus,
              totalDepenses,
              soldeActuel,
              recentActivities
            });
          } catch (e) {
            console.error('Erreur lors de la construction de la réponse :', e);
            res.status(500).json({ error: 'Erreur traitement données' });
          }
        });
      });
    });
  });
};
