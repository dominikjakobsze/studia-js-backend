export const createStarsTable = `
    CREATE TABLE stars (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      article TEXT NOT NULL,
      imageUrl VARCHAR(255) NOT NULL,
      turned BOOLEAN NOT NULL DEFAULT FALSE,
      shine BOOLEAN NOT NULL DEFAULT FALSE,
      PRIMARY KEY (id)
    );
`;