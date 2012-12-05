// Generated by CoffeeScript 1.4.0
(function() {
  var base_36, counter_name, db, mongoose, toBase36;

  mongoose = require('mongoose');

  counter_name = null;

  db = null;

  exports.loadAutoIncr = function(database, options) {
    var schema;
    options = options || {};
    counter_name = options.counterName || 'Counter';
    db = database;
    schema = new mongoose.Schema({
      field: {
        type: String,
        unique: true
      },
      c: {
        type: Number,
        "default": 0
      }
    });
    return mongoose.model(counter_name, schema);
  };

  base_36 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

  toBase36 = function(input, output, cb) {
    var remainder;
    if (input > 0) {
      remainder = input % 36;
      input = Math.floor(input / 36);
      output = base_36[remainder] + output;
      return toBase36(input, output, cb);
    } else {
      return cb(output);
    }
  };

  exports.plugin = function(schema, options) {
    var Counter, model_name;
    if (!options.modelName) {
      throw new Error('Missing required parameter: modelName');
    }
    model_name = options.modelName.toLowerCase();
    Counter = db.model(counter_name);
    schema.add({
      url_id: {
        type: String,
        unique: true
      }
    });
    return schema.pre('save', function(next) {
      var self,
        _this = this;
      self = this;
      return Counter.collection.findAndModify({
        field: model_name
      }, [], {
        $inc: {
          c: 1
        }
      }, {
        "new": true,
        upsert: true
      }, function(err, doc) {
        var count;
        count = doc.c;
        if (err) {
          return next(err);
        } else {
          if (!self.url_id) {
            return toBase36(count, "", function(result) {
              self.url_id = result;
              return next();
            });
          } else {
            return next();
          }
        }
      });
    });
  };

}).call(this);
