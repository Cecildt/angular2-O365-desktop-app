(function(global) {

  // map tells the System loader where to look for things
  var map = {
    'boot': 'boot', // 'dist',
    'rxjs': '../node_modules/rxjs',
    '@angular': '../node_modules/@angular',
    'symbol-observable': '../node_modules/symbol-observable',
    'app': 'app',
    'authHelper': 'authHelper',
    'profile': 'profile',
    'home': 'home',
    'login': 'login',
    'files': 'files',
    'contacts': 'contacts',
    'groups': 'groups',
    'mails': 'mails',
    'notes': 'notes',
    'tasks': 'tasks',
    'trending': 'trending',
    'users': 'users',
    'svcConsts': 'svcConsts',
    'child_process': '@node/child_process'
        
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'boot': { main: 'boot.js',  defaultExtension: 'js' },
    'rxjs': { defaultExtension: 'js' },
    'symbol-observable': { main: 'index.js', defaultExtension: 'js' },
    'app': { main: 'app.js',  defaultExtension: 'js' },
    'authHelper': { main: 'authHelper.js',  defaultExtension: 'js' },
    'profile': { main: 'profile.js',  defaultExtension: 'js' },
    'home': { main: 'home.js',  defaultExtension: 'js' },
    'login': { main: 'login.js',  defaultExtension: 'js' },
    'files': { main: 'files.js',  defaultExtension: 'js' },
    'contacts': { main: 'contacts.js',  defaultExtension: 'js' },
    'groups': { main: 'groups.js',  defaultExtension: 'js' },
    'mails': { main: 'mails.js',  defaultExtension: 'js' },
    'notes': { main: 'notes.js',  defaultExtension: 'js' },
    'tasks': { main: 'tasks.js',  defaultExtension: 'js' },
    'trending': { main: 'trending.js',  defaultExtension: 'js' },
    'users': { main: 'users.js',  defaultExtension: 'js' },
    'svcConsts': { main: 'svcConsts.js',  defaultExtension: 'js' }
  };

  var packageNames = [
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/router',
    '@angular/router-deprecated',
    '@angular/testing',
    '@angular/upgrade',
  ];

  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function(pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });

  var config = {
    map: map,
    packages: packages
  }

  // filterSystemConfig - index.html's chance to modify config before we register it.
  if (global.filterSystemConfig) { global.filterSystemConfig(config); }

  System.config(config);

})(this);