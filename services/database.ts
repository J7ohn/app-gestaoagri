import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('gestaoagri.db');

// Types
export interface Cultura {
  id?: number;
  nome: string;
  variedade: string;
  data_plantio: string;
  area: number;
  data_colheita: string;
  status: 'plantado' | 'colhido' | 'perdido';
}

export interface Insumo {
  id?: number;
  nome: string;
  tipo: 'fertilizante' | 'semente' | 'defensivo';
  quantidade_estoque: number;
}

export interface AplicacaoInsumo {
  id?: number;
  id_insumo: number;
  id_cultura: number;
  quantidade: number;
  data: string;
}

// Initialize database
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Culturas table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS culturas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          variedade TEXT NOT NULL,
          data_plantio TEXT NOT NULL,
          area REAL NOT NULL,
          data_colheita TEXT NOT NULL,
          status TEXT NOT NULL
        );
      `);

      // Insumos table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS insumos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          tipo TEXT NOT NULL,
          quantidade_estoque REAL NOT NULL
        );
      `);

      // Aplicações de insumos table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS aplicacoes_insumos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          id_insumo INTEGER NOT NULL,
          id_cultura INTEGER NOT NULL,
          quantidade REAL NOT NULL,
          data TEXT NOT NULL,
          FOREIGN KEY (id_insumo) REFERENCES insumos (id),
          FOREIGN KEY (id_cultura) REFERENCES culturas (id)
        );
      `,
      [],
      () => resolve(true),
      (_, error) => {
        console.error('Error creating tables:', error);
        reject(error);
        return false;
      });
    });
  });
};

// Culturas CRUD
export const addCultura = (cultura: Cultura) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO culturas (nome, variedade, data_plantio, area, data_colheita, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [cultura.nome, cultura.variedade, cultura.data_plantio, cultura.area, 
         cultura.data_colheita, cultura.status],
        (_, { insertId }) => resolve(insertId),
        (_, error) => {
          console.error('Error adding cultura:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getCulturas = (status?: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const query = status 
        ? 'SELECT * FROM culturas WHERE status = ? ORDER BY data_plantio DESC'
        : 'SELECT * FROM culturas ORDER BY data_plantio DESC';
      const params = status ? [status] : [];

      tx.executeSql(
        query,
        params,
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => {
          console.error('Error fetching culturas:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const updateCulturaStatus = (id: number, status: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE culturas SET status = ? WHERE id = ?',
        [status, id],
        (_, { rowsAffected }) => resolve(rowsAffected > 0),
        (_, error) => {
          console.error('Error updating cultura status:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Insumos CRUD
export const addInsumo = (insumo: Insumo) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO insumos (nome, tipo, quantidade_estoque)
         VALUES (?, ?, ?)`,
        [insumo.nome, insumo.tipo, insumo.quantidade_estoque],
        (_, { insertId }) => resolve(insertId),
        (_, error) => {
          console.error('Error adding insumo:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getInsumos = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM insumos ORDER BY nome',
        [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => {
          console.error('Error fetching insumos:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const updateInsumoEstoque = (id: number, quantidade: number) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE insumos SET quantidade_estoque = quantidade_estoque - ? WHERE id = ?',
        [quantidade, id],
        (_, { rowsAffected }) => resolve(rowsAffected > 0),
        (_, error) => {
          console.error('Error updating insumo stock:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Aplicações de Insumos
export const addAplicacaoInsumo = async (aplicacao: AplicacaoInsumo) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO aplicacoes_insumos (id_insumo, id_cultura, quantidade, data)
         VALUES (?, ?, ?, ?)`,
        [aplicacao.id_insumo, aplicacao.id_cultura, aplicacao.quantidade, aplicacao.data],
        async (_, { insertId }) => {
          try {
            await updateInsumoEstoque(aplicacao.id_insumo, aplicacao.quantidade);
            resolve(insertId);
          } catch (error) {
            reject(error);
          }
        },
        (_, error) => {
          console.error('Error adding aplicacao:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getAplicacoesPorCultura = (culturaId: number) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT ai.*, i.nome as insumo_nome, i.tipo as insumo_tipo
         FROM aplicacoes_insumos ai
         JOIN insumos i ON ai.id_insumo = i.id
         WHERE ai.id_cultura = ?
         ORDER BY ai.data DESC`,
        [culturaId],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => {
          console.error('Error fetching aplicacoes:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Relatórios
export const getRelatorioInsumosPorCultura = (culturaId: number) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
          i.nome as insumo_nome,
          i.tipo as insumo_tipo,
          SUM(ai.quantidade) as total_aplicado,
          COUNT(ai.id) as numero_aplicacoes
         FROM aplicacoes_insumos ai
         JOIN insumos i ON ai.id_insumo = i.id
         WHERE ai.id_cultura = ?
         GROUP BY i.id`,
        [culturaId],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => {
          console.error('Error generating report:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};