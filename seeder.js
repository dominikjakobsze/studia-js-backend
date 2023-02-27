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

export const createStarConstellationTable = `
    CREATE TABLE star_constellation (
      id INT PRIMARY KEY AUTO_INCREMENT,
      starId INT,
      constellationId INT,
      FOREIGN KEY (starId) REFERENCES stars(id),
      FOREIGN KEY (constellationId) REFERENCES constellations(id)
    );
`;

export const createConstellationsTable = `
    CREATE TABLE constellations (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      article TEXT NOT NULL,
      imageUrl VARCHAR(255) NOT NULL,
      turned BOOLEAN NOT NULL DEFAULT FALSE,
      shine BOOLEAN NOT NULL DEFAULT FALSE,
      PRIMARY KEY (id)
    );
`;