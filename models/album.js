const mongoose = require('mongoose');


const songSchema = new mongoose.Schema(
  {
    songName: String,
  },
  { timestamps: true }
);


const albumSchema = new mongoose.Schema(
  {
    albumName: String,
    songs: [songSchema],
  },
  { timestamps: true }
);


const Album = mongoose.model('Album', albumSchema);
const Song = mongoose.model('Song', songSchema);
module.exports = { Album, Song };