var gulp = require('gulp');
var imageop = require('gulp-image-optimization');
var imageResize = require('gulp-image-resize');

gulp.task('images', function(cb) {
    gulp.src(['assets/images_original/*.png','assets/images_original/*.jpg','assets/images_original/*.gif','assets/images_original/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('assets/images')).on('end', cb).on('error', cb);
});

gulp.task('resize', function () {
  gulp.src('assets/images/*.jpg')

    .pipe(imageResize({
      width : 960,
      height : 1280,
      imageMagick: true
    }))
    .pipe(gulp.dest('assets/images_resized'));
});
