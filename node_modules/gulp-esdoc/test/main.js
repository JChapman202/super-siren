var gulpESDocPlugin = require('../');
var fs = require('fs');
var should = require('should');
var es = require('event-stream');
var gutil = require('gulp-util');

describe("gulp-esdoc", function () {

  it("should error if config.destination doesn't exist", function(done) {

    var stream = gulpESDocPlugin();

    stream.on("error", function(err) {
      should.exist(err);
      err.message.should.equal('Must specify config.destination');
      done();
    });

    stream.write("./src");
  });

  it("should error on stream", function(done) {
    var srcFile = new gutil.File({
      path: "test/fixtures/testing.txt",
      cwd: "test/",
      base: "test/fixtures",
      contents: fs.createReadStream("test/fixtures/testing.txt")
    });

    var stream = gulpESDocPlugin({destination: './dest'});

    stream.on("error", function(err) {
      should.exist(err);
      err.message.should.equal('Streaming not supported');
      done();
    });

    stream.on("data", function (newFile) {
      newFile.contents.pipe(es.wait(function(err, data) {
        done(err);
      }));
    });

    stream.write(srcFile);
  });


});
