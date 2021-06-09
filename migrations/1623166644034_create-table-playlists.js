/* eslint-disable max-len */
/* eslint-disable quotes */
/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
    },
    owner: {
      type: 'VARCHAR(50)',
    },
  });

  // membuat user baru
  pgm.sql('INSERT INTO users(id, username, password, fullname) ' +
    'VALUES '+
    "('old_playlists', 'old_playlists', 'old_playlists', 'old_playlists')");

  // mengubah nilai owner pada playlist yang owner-nya bernilai NULL
  pgm.sql("UPDATE playlists SET owner = 'old_playlists' WHERE owner = NULL");

  /*
    memberikan constraint foreign key pada
    owner terhadap kolom id dari tabel users
  */
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_playlists.owner_users.id pada tabel playlists
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');

  // mengubah nilai owner old_playlists pada playlists menjadi NULL
  pgm.sql("UPDATE playlists SET owner = NULL WHERE owner = 'old_playlists'");

  // menghapus user baru.
  pgm.sql("DELETE FROM users WHERE id = 'old_playlists'");

  pgm.dropTable('playlists');
};
