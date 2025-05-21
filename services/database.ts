import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Open database
const db = SQLite.openDatabase('gestaoagri.db');

// Initialize database tables
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Create gestoes table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS gestoes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nomeCultivo TEXT NOT NULL,
          nomeInsumo TEXT NOT NULL,
          quantidade TEXT NOT NULL,
          data TEXT NOT NULL
        );`,
        [],
        () => {
          console.log('Database initialized successfully');
          resolve(true);
        },
        (_, error) => {
          console.error('Error initializing database:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Add new gestao
export const addGestao = (gestao: {
  nomeCultivo: string;
  nomeInsumo: string;
  quantidade: string;
  data: string;
}) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO gestoes (nomeCultivo, nomeInsumo, quantidade, data) VALUES (?, ?, ?, ?)',
        [gestao.nomeCultivo, gestao.nomeInsumo, gestao.quantidade, gestao.data],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error) => {
          console.error('Error adding gestao:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Get all gestoes
export const getGestoes = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM gestoes ORDER BY id DESC',
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => {
          console.error('Error fetching gestoes:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Get statistics
export const getStatistics = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
          COUNT(DISTINCT nomeCultivo) as totalCultivos,
          COUNT(DISTINCT nomeInsumo) as totalInsumos,
          nomeCultivo,
          COUNT(*) as count
         FROM gestoes
         GROUP BY nomeCultivo`,
        [],
        (_, { rows: { _array } }) => {
          const stats = {
            totalCultivos: 0,
            totalInsumos: 0,
            cultivosPorTipo: _array.map(row => ({
              name: row.nomeCultivo,
              value: row.count,
              color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
              legendFontColor: "#7F7F7F",
              legendFontSize: 12,
            }))
          };

          if (_array.length > 0) {
            stats.totalCultivos = _array[0].totalCultivos;
            stats.totalInsumos = _array[0].totalInsumos;
          }

          resolve(stats);
        },
        (_, error) => {
          console.error('Error fetching statistics:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};