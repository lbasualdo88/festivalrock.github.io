
//SRC busca el archivo//DEST lo guarda//
const { src, dest, watch, parallel }=require("gulp");

/////////DEPENDENCIAS//////////

///DEP-CSS
const sass=require("gulp-sass")(require('sass')); //-->Aca la importamos a (sass) para despues mandarla a llamar
const plumber=require('gulp-plumber');
const autoprefixer = require('autoprefixer'); //le da soporte si el css usado no tiene tanto
const cssnano = require('cssnano'); //comprime el archivo
const postcss = require('gulp-postcss'); //ayuda a los dos de arriba
const sourcemaps = require('gulp-sourcemaps');

///DEP-IMAGENES
const cache=require('gulp-cache');
const imagemin=require('gulp-imagemin');
const webp=require('gulp-webp');
const avif=require('gulp-avif');

//JavaScript
const terser = require('gulp-terser-js');

function css(done){
    src('src/scss/**/*.scss') //1ro- Idetinficar el archivo SASS
    .pipe(sourcemaps.init())
    .pipe( plumber() )
    .pipe( sass() ) //2DO-Compilarlo--Se compila con ".PIPE()"-->los ".pipe" se ejecutan en cadena uno tras otros
    .pipe( postcss([ autoprefixer(), cssnano() ]) ) 
    .pipe(sourcemaps.write('.'))
    .pipe( dest("build/css") );  //3RO- Este ".pipe" ejecuta "DEST" que es el que manda a almacenarla en el disco
    ///////////////////////////////////////////////
    done(); //CALLBACK que avisa a gulp cuando llegamos al final
}



function imagenes(done) {
    const opciones= {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
    .pipe( cache(imagemin(opciones) ) )
    .pipe( dest('build/img') )
    done();
}


function versionWebp( done ) {

    const opciones= {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
    .pipe( webp(opciones) )
    .pipe( dest('build/img') )

    done();
}

function versionAvif(done) {
    const opciones= {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
    .pipe( avif(opciones) )
    .pipe( dest('build/img') )

    done()
}
function javascript(done){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe( terser() )
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}


function dev(done) {
    watch("src/scss/**/*.scss", css);
    watch("src/js/**/*.js", javascript);
    done();
}

exports.css=css;
exports.js=javascript;
exports.imagenes=imagenes;
exports.versionWebp=versionWebp;
exports.versionAvif=versionAvif;
exports.dev=parallel( imagenes, versionWebp, versionAvif, javascript, dev);

