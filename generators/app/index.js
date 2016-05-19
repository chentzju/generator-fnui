'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var greeting = require("../greeting");

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    // This makes `appname` a required argument.
    this.argument('appname', { type: String, required: false });
    this.appname = (this.appname == ""|| this.appname == null) ? "newapp" : this.appname;
  },
  initializing :function(){
    this.pkg = require('../../package.json');
  },
  prompting :function () {
      var done = this.async();
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the neat ' + chalk.red('generator-fnui') + ' generator!'
    ));
    this.log(greeting);

      var prompts = [{
          type: 'confirm',
          name: 'usejsAnswer',
          message: 'Would you like to use the FNUI javascript components?(你想使用FNUI的JS插件吗)?',
          default: true
        },
        {
          type: 'confirm',
          name: 'amdAnswer',
          message: 'Would you like to use AMD to load js files(你想使用requirejs来加载js文件吗)?',
          default: false,
          when: function (answers) {
            return answers.usejsAnswer;
          }
        }];
      this.prompt(prompts).then(function (answers) {
        this.useJs = answers.usejsAnswer;
        this.amd = answers.amdAnswer;
        done();
      }.bind(this));
    },
  writing : {
    gruntfile:function(){
        this.fs.copy(
          this.templatePath('common/Gruntfile.js'),
          this.destinationPath('Gruntfile.js')
        );
    },
    packageJson:function () {
      this.fs.copyTpl(
       this.templatePath('common/_package.json'),
       this.destinationPath('package.json')
     );
    },
    git:function () {
      this.fs.copy(
        this.templatePath('common/_gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('common/_gitattributes'),
        this.destinationPath('.gitattributes')
      );
      this.fs.copy(
        this.templatePath('common/_travis.yml'),
        this.destinationPath('.travis.yml')
      );
    },
    bower:function () {
      var bowerJson = {
        name:this.appname,
        private: true,
        dependencies: {}
      };

      this.fs.writeJSON('bower.json', bowerJson);
      this.fs.copy(
        this.templatePath('common/_bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },
    editConf:function(){
      this.fs.copy(
        this.templatePath('common/_editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },
    h5bp:function(){
      this.fs.copy(
        this.templatePath('www/favicon.ico'),
        this.destinationPath('www/favicon.ico')
      );

      this.fs.copy(
        this.templatePath('www/img'),
        this.destinationPath('www/img')
      );
      this.fs.copy(
        this.templatePath('www/fonts'),
        this.destinationPath('www/fonts')
      );
    },
    styles:function(){
      var css = 'www/css/';
        if(this.useJs){
            css += 'fnui.min.css'
        }else{
            css += 'fnuitheme.min.css'
        }
      this.fs.copy(
        this.templatePath(css),
        this.destinationPath("www/css/fnui.min.css")
      );
      this.fs.copy(
        this.templatePath("www/css/main.css"),
        this.destinationPath("www/css/main.css")
      );
    },
    scripts:function(){
        if(this.useJs) {
          if (this.amd){
            this.fs.copy(
              this.templatePath("www/js/fnuiamd.min.js"),
              this.destinationPath("www/js/fnui.min.js")
            );
            this.fs.copy(
              this.templatePath("www/js/mainamd.js"),
              this.destinationPath("www/js/main.js")
            );
            this.fs.copy(
              this.templatePath("www/js/require.js"),
              this.destinationPath("www/js/require.js")
            );
            this.fs.copy(
              this.templatePath("www/js/project.js"),
              this.destinationPath("www/html/js/project.js")
            );
          }else{
            this.fs.copy(
              this.templatePath("www/js/fnui.min.js"),
              this.destinationPath("www/js/fnui.min.js")
            );
            this.fs.copy(
              this.templatePath("www/js/main.js"),
              this.destinationPath("www/js/main.js")
            );
          }
          this.fs.copy(
            this.templatePath("www/js/jquery.min.js"),
            this.destinationPath("www/js/jquery.min.js")
          );
        }else {
          mkdirp('www/js');
        }
    },
    html:function () {
       //theme
      this.fs.copyTpl(
            this.templatePath("www/index.html"),
            this.destinationPath("www/index.html"),
            {
              isJS:this.useJs,
              isAMD:this.amd
            }
          );
          this.fs.copy(
            this.templatePath("www/html"),
            this.destinationPath("www/html")
          );
    },
    misc:function(){
        //README
      this.fs.copy(
        this.templatePath("common/README.md"),
        this.destinationPath("README.md")
      );
        //LICENSE
      this.fs.copy(
        this.templatePath("common/LICENSE.md"),
        this.destinationPath("LICENSE.md")
      );
    }
  },

  install: function () {
    this.installDependencies();
  },
  end:function(){
    var howToStart =
      '\nAfter running ' +
      chalk.yellow.bold('npm install & bower install') +
      ', start your' +
      '\nfront end server by running ' +
      chalk.yellow.bold('grunt server') +
      '.';
    this.log(howToStart);
  }
});
