const express = require('express');
const db = require('./db');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const membreRoutes = require('./routes/membre');
const compteRoutes = require('./routes/compte');
const annonceRoutes = require('./routes/annonce');
const tresorerieRoutes = require('./routes/tresorerie');
const depenseRoutes = require('./routes/depense');
const dashboardRoutes = require('./routes/dashboard');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors({
   origin: [
    'http://localhost:8080',                   
    'capacitor://localhost',                   
    'http://localhost',
    'https://association-soeremf.onrender.com',                       
   
  ],
  credentials: true,
}));
app.use(express.json());




app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur Express !');
});

app.use('/auth', authRoutes);
app.use('/membres', membreRoutes);
app.use('/compte', compteRoutes);
app.use('/annonces', annonceRoutes);
app.use('/tresorerie', tresorerieRoutes);
app.use('/depense', depenseRoutes);
app.use('/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
