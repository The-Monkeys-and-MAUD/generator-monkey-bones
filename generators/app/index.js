'use strict';

/*    
     .-"-.            .-"-.            .-"-.           .-"-.
   _/_-.-_\_        _/.-.-.\_        _/.-.-.\_       _/.-.-.\_
  / __} {__ \      /|( o o )|\      ( ( o o ) )     ( ( o o ) )
 / //  "  \\ \    | //  "  \\ |      |/  "  \|       |/  "  \|
/ / \'---'/ \ \  / / \'---'/ \ \      \'/^\'/         \ .-. /
\ \_/`"""`\_/ /  \ \_/`"""`\_/ /      /`\ /`\         /`"""`\
 \           /    \           /      /  /|\  \       /       \


The Monkeys (c) 2016 | http://themonkeys.com.au/ 
Date: 15/1/16

@author Lachlan Tweedie, lachlant@themonkeys.com.au

*/
 
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.Base.extend({

	// Configurations will be loaded here.

	//Ask for user input
	prompting: function() {

		console.log(yosay(chalk.cyan('Hello, and welcome to Monkey Bones! \n') + chalk.white('The project builder used by ')  + chalk.yellow('THE MONKEYS ') ) );
	
		var done = this.async();

		this.prompt([{

		  type: 'input',
		  name: 'name',
		  message: 'Your project name',
		  default: this.appname

		},
		{

		  type: 'input',
		  name: 'description',
		  message: 'A description for your project',
		  default: "A basic HTML project."

		},
		{

		  type: 'input',
		  name: 'author',
		  message: 'Name of author',
		  default: "Lachlan Tweedie"

		},
		{

		  type: 'input',
		  name: 'email',
		  message: 'Email of the author',
		  default: "lachlant@themonkeys.com.au"

		},
		{

		  type: 'input',
		  name: 'architecture',
		  message: 'How is the project structured and built?',

		  default: "Nothing different from usual."

		},
		{
    
	      type: 'list',
	      name: 'styling',
	      message: 'Which css precompiler would you like to use?',
	      choices: ['sass' , 'less']
	    
	    },{
		
			type: 'confirm',
			name: 'hasBootstrap',
			message: 'Would you like Boostrap included?',
			default: true
		
		
		},{
		
			type: 'confirm',
			name: 'setUpStaging',
			message: 'Would you like set up staging details right now?',
			default: true
		
		
		}], function(answers) {

		  	this.props = answers;

			done();

		}.bind(this));

	},


	serverPrompting: function(){

		var done = this.async();

		if(this.props.setUpStaging){

	  		this.prompt([{
				type: 'input',
				name: 'gitStage',
				message: 'What\'s the GIT repo name for staging?',
				default: ''

			},
			{

				type: 'input',
				name: 'stagingLink',
				message: 'What\'s the subdomain for monkeylabs.com.au?',
				default: ''


			}], function(answers){

				this.props.gitHubRepo = answers.gitStage;
				this.props.gitStage = getGitURL(answers.gitStage);
				this.props.stagingLink = getStagingURL(answers.stagingLink);
				this.props.package_json;

				done();

			}.bind(this));

	  	}else{
	  		done();
	  	}
	},

	createJsonFiles : function () {

		this.props.package_json =  {
			"name": this.props.name.replace(/\s/g, '-'),
			"description": this.props.description,	
			
			"version": "0.0.0",
			"author": {
				"name": "Lachlan Tweedie",
				"email": "lachlant@themonkeys.com.au",
				"url": "themonkeys.com.au"
			},

			"dependencies": {},

			"repository": {
			  "type": "git",
			  "url": "git://github.com/themonkeys/" + this.props.gitHubRepo + ".git"
			},

			"scripts": {

			    "dev": "gulp"
			},

			"devDependencies": {
				"browser-sync": "^1.6.2",
				"gulp": "^3.8.9",
				"gulp-ng-annotate": "^2.0.0",
				"gulp-autoprefixer": "^1.0.1",
				"gulp-batch": "^1.0.5",
				"gulp-changed" : "^1.3.0",
				"gulp-concat": "2.4.2",
				"gulp-inject": "^3.0.0",
				"gulp-less": "^3.0.5",
				"gulp-livereload": "^3.8.1",
				"gulp-clean-css": "^2.0.2",
				"gulp-rename": "^1.2.0",
				"gulp-sass": "^2.0.4",
				"gulp-uglify": "1.0.1",
				"gulp-watch": "^4.3.5",
				"less": "^2.5.3",
				"stream-combiner2": "^1.1.1"
			}
		};

		this.props.bower_json =   {
			"name": this.props.name,
			"description": this.props.description,
			"version": "0.0.0",
			"dependencies": {}
		};

		// bower.json

		if(this.props.hasBootstrap){
			this.props.bower_json.dependencies.bootstrap = "3.3.5";
		}

		// package.json

		this.props.package_json.dependencies["normalize.css"] = "3.0.3"; // always have normalise
	},


	// Writing Logic here

	writing: {

		// Copy the configuration files

		config: function () {


			this.fs.writeJSON('package.json', this.props.package_json); 
			this.fs.writeJSON('bower.json', this.props.bower_json); 
	        this.fs.copy(
	          this.templatePath('bowerrc'),
	          this.destinationPath('.bowerrc')
	        );

	        var ext = this.props.styling == 'less' ? 'less' : 'scss';

	        this.fs.copyTpl(
	            this.templatePath('gulpfile.js'),
	            this.destinationPath('gulpfile.js'), {
	               styling: this.props.styling,
	               hasBootstrap: this.props.hasBootstrap,
	               stylingExt : ext,
	               author: this.props.author,
	               email: this.props.email
	            }
	        );

	        // DEPLOYMENT

	        this.fs.copyTpl(
	            this.templatePath('_deployment/README.md'),
	            this.destinationPath('deployment/README.md'), {
	               gitStaging: this.props.gitStage,
	               stagingLink: this.props.stagingLink 
	            }
	        );

	        // Git Ignore 
	        this.fs.copy(
		    	this.templatePath('_deployment/deploy.sh'),
		    	this.destinationPath('deployment/deploy.sh'));

	        this.fs.copy(
		    	this.templatePath('.gitignore'),
		    	this.destinationPath('.gitignore'));

	        // Prototype

	       this.fs.copyTpl(
		    	this.templatePath('_prototype/README.md'),
		    	this.destinationPath('prototype/README.md'),
		    	{
		    		name: this.props.name
		    	}

		    );

	        // main readme

	        this.fs.copyTpl(
	            this.templatePath('_README.md'),
	            this.destinationPath('README.md'), {
	                name: this.props.name,
	                description: this.props.description,
	                architecture: this.props.architecture
	            }
	        );

	    },

	  // Copy application files
		app: function() {

			// css

			this.fs.copy(
		    	this.templatePath('_css/_vendor/normalize.css'),
		    	this.destinationPath('build/public/css/vendor/normalize.css'));

			// js

			this.fs.copy(
		    	this.templatePath('_js/_vendor/jquery-1.11.1.min.js'),
		    	this.destinationPath('build/js/vendor/jquery-1.11.1.min.js'));

			this.fs.copy(
		    	this.templatePath('_js/_vendor/tweenmax.js'),
		    	this.destinationPath('build/js/vendor/tweenmax.js'));

			this.fs.copy(
		    	this.templatePath('_js/_vendor/modernizr-2.8.3.min.js'),
		    	this.destinationPath('build/public/js/vendor/modernizr-2.8.3.min.js'));

			this.fs.copy(
		    	this.templatePath('_js/_main.js'),
		    	this.destinationPath('build/js/global.js'));

			this.fs.copy(
		    	this.templatePath('_js/_main.js'),
		    	this.destinationPath('build/js/home.js'));

			// html

			 this.fs.copyTpl(
	            this.templatePath('_html/_index.ejs'),
	            this.destinationPath('build/public/index.html'), {
	                name: this.props.name,
	                description: this.props.description
	            }
	        );

			// images

			this.fs.copy(
				this.templatePath('_images/favicon.ico'),
				this.destinationPath('build/public/images/favicon.ico')
			);

			// fonts directory 
			
			mkdirp.sync('build/public/fonts/');


			var ext = this.props.styling == 'less' ? 'less' : 'scss';

			this.fs.copy(
				this.templatePath('_'+ ext +'/**/*' + ext),
				this.destinationPath('build/' + ext)
			);
	
		}
	},

	//Install Dependencies
	install: function() {
	  this.installDependencies({
	  	callback: function () {

			console.log(yosay(chalk.cyan('Monkey Bones project ready! Like our stuff? Visit: ') + ' ' + chalk.grey('http://themonkeys.com.au ') + ' '  + chalk.yellow('Starting Gulp tasks now so you can swing right in. \n')  ) );

	  		this.spawnCommand('gulp', ['default']);	      

	    }.bind(this) 
	  });
	}


});


function get_html_source( _type, _path ){

	if(_type == "js"){
		
		return '<script src="' + _path + '"></script>';

	}else if (_type == "css"){


		
	}else{

		return '';

	}

	
}



function getGitURL (projectName){

	if(!projectName || projectName == '')

		return '[NO DOCUMENTATION ADDED YET]';

	else

		return 'ssh://monkey-deployment@deployment.monkeylabs.com.au/home/monkey-deployment/' + projectName + '/stage.git'

}

function getStagingURL (projectName){

	if(!projectName || projectName == '')

		return '[NO DOCUMENTATION ADDED YET]';
	
	else

		return 'http://'+projectName+'.monkeylabs.com.au/'; 
		
}




