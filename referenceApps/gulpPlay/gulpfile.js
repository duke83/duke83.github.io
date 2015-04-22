var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var gulpprint = require ('gulp-print')

gulp.task('list',function(){
    return gulp
        .src("./dataDoodlerHarvest/src/**/*.js")
        .pipe(gulpprint())
})

gulp.task('default', function () {
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            PORT: 8000
        },
        ignore: ['./node_modules/**']
    })
        .on('restart', function () {
            console.log('Restarting')
        })
    console.log('this is js?');
})