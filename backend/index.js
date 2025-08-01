const express = require('express');
const db = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const authRoutes = require('./routes/auth');
const membreRoutes = require('./routes/membre');
const compteRoutes = require('./routes/compte');
const annonceRoutes = require('./routes/annonce');
const tresorerieRoutes = require('./routes/tresorerie');
const depenseRoutes = require('./routes/depense');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cookieParser());


app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost',
    'https://localhost',
    'capacitor://localhost',
    'https://association-soeremf.onrender.com',
    'https://association-soeremf.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


app.use((req, res, next) => {
  const origin = req.headers.origin;
  if ([
    'http://localhost:8080',
    'http://localhost',
    'capacitor://localhost',
    'https://association-soeremf.onrender.com'
  ].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});


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
