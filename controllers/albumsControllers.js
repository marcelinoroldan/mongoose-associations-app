const router = require('express').Router();
const Album = require('../models/album').Album;
const Song = require('../models/album').Song;

// Can do the above 2 line like this using destructuring
// const { Album, Song } = require('../models/album');

// NEW ALBUM FORM
router.get('/new', (req, res) => {
    res.render('albums/new.ejs');
  });
  
  router.get('/', (req, res) => {
    // res.send('Index Route');
    Album.find({}, (error, allAlbums) => {
        res.render('albums/index.ejs', {
            albums: allAlbums,
        });
    });
  });
  
  // ADD EMPTY FORM TO ALBUM SHOW PAGE TO ADD SONGS to an ALBUM
  // hard coded paths should be above this - "new" would hit this path if it was above
  router.get('/:albumId', (req, res) => {
      // find album in db by id and add new songs to albums
      Album.findById(req.params.albumId, (error, album) => {
      res.render('albums/show.ejs', { album });
      });
    });

  // CREATE A NEW ALBUM
  router.post('/', (req, res) => {
    Album.create(req.body, (error, newAlbum) => {
      res.redirect(`/albums/${newAlbum.id}`);
      // console.log(req.body)
      // res.send('Show Page')
    });
  });
  
    // DELETE Album
    router.delete('/:id', (req, res) => {
      Album.findByIdAndRemove(req.params.id, (error) => {
      res.redirect('/albums');
      });
    });
  
  // CREATE SONG EMBEDDED IN AN ALBUM
    router.post('/:albumId/songs', (req, res) => {
    console.log(req.body);
    // store new song in memory with data from request body
    const newSong = new Song({ songName: req.body.songName });
  
    // find album in db by id and add new song
    Album.findById(req.params.albumId, (error, album) => {
      album.songs.push(newSong);
      album.save((err, album) => {
        res.redirect(`/albums/${album.id}`);
      });
    });
  });
  
  // **
  
  router.get('/:albumId/songs/:songId/edit', (req, res) => {
    // set the value of the album and song ids
    const albumId = req.params.albumId;
    const songId = req.params.songId;
    // find album in db by id
    Album.findById(albumId, (err, foundAlbum) => {
      // find song embedded in album where song.id equals (songId) - done by Mongoose
      const foundSong = foundAlbum.songs.id(songId);
      // update song text and completed with data from request body
      res.render('songs/edit.ejs', { foundAlbum, foundSong });
    });
  });
  
  // UPDATE SONG EMBEDDED IN A ALBUM DOCUMENT
  router.put('/:albumId/songs/:songId', (req, res) => {
    console.log('PUT ROUTE');
    // set the value of the album and song ids
    const albumId = req.params.albumId;
    const songId = req.params.songId;
  
    // find album in db by id
    Album.findById(albumId, (err, foundAlbum) => {
      // find song embedded in album
      const foundSong = foundAlbum.songs.id(songId);
      // update song name and completed with data from request body
      foundSong.songName = req.body.songName;
      foundAlbum.save((err, savedAlbum) => {
        res.redirect(`/albums/${foundAlbum.id}`);
      });
    });
  });
  


  // DELETE songs on an Album
  router.delete('/:albumId/songs/:songId', (req, res) => {
    console.log('Delete Song');
    // set the value of the album and song ids
    const albumId = req.params.albumId;
    const songId = req.params.songId;
  
    // find album in db by id
    Album.findById(albumId, (err, foundAlbum) => {
      // find song embedded in album
      foundAlbum.songs.id(songId).remove();
      // update song name and completed with data from request body
      foundAlbum.save((err, savedAlbum) => {
        res.redirect(`/albums/${foundAlbum.id}`);
      });
    });
  });
  
  // **
  
  module.exports = router;