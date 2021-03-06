// Generated by CoffeeScript 1.4.0
(function() {
  var db, expect, mongoose;

  expect = require('expect.js');

  mongoose = require('mongoose');

  db = mongoose.createConnection('mongodb://localhost/mongoose_autoincr_test');

  describe('Counter model test', function() {
    var Card, Counter, User, autoIncr, cardSchema, userSchema;
    autoIncr = require('../');
    autoIncr.loadAutoIncr(db);
    userSchema = new mongoose.Schema({
      username: String
    });
    userSchema.plugin(autoIncr.plugin, {
      modelName: 'User'
    });
    mongoose.model('User', userSchema);
    cardSchema = new mongoose.Schema({
      name: String
    });
    cardSchema.plugin(autoIncr.plugin, {
      modelName: 'Card'
    });
    mongoose.model('Card', cardSchema);
    User = null;
    Counter = null;
    Card = null;
    before(function() {
      User = db.model('User');
      Card = db.model('Card');
      return Counter = db.model('Counter');
    });
    it('should create user field on Counter db', function(done) {
      return Counter.remove({}, function(err) {
        var card;
        card = new Card({
          name: 'john'
        });
        return card.save(function(err) {
          return Counter.findOne({
            field: 'card'
          }, function(err, doc) {
            expect(doc.c).to.be(1);
            return Card.remove({}, done);
          });
        });
      });
    });
    it('test autoincrement', function(done) {
      return User.remove({}, function(err) {
        var answers, checkSequence, i, usernames, _i;
        answers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '10', '11'];
        usernames = [];
        for (i = _i = 0; _i <= 36; i = ++_i) {
          usernames.push('chris' + i);
        }
        checkSequence = function(next) {
          var user, username;
          if (usernames.length === 0) {
            return next();
          }
          username = usernames.pop();
          user = new User({
            username: username
          });
          return user.save(function(err) {
            return User.findOne({
              username: username
            }, function(err, doc) {
              var answer;
              answer = answers.shift();
              expect(doc.url_id).to.be(answer);
              return checkSequence(next);
            });
          });
        };
        return checkSequence(function() {
          return User.remove({}, done);
        });
      });
    });
    return it('should not resave if url_id already exists', function(done) {
      return Counter.remove({}, function(err) {
        if (err) {
          throw err;
        }
        return User.remove({}, function(err) {
          var user;
          if (err) {
            throw err;
          }
          user = new User({
            username: 'chris'
          });
          return user.save(function(err, user) {
            expect(user.url_id).to.be('1');
            return user.save(function(err, user) {
              expect(user.url_id).to.be('1');
              return Counter.findOne({
                field: 'user'
              }, function(err, doc) {
                expect(doc.c).to.be(1);
                return done();
              });
            });
          });
        });
      });
    });
  });

}).call(this);
