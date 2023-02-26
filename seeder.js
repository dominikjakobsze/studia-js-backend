export const createTableUsersQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL)`;