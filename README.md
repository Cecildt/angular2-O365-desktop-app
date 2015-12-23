# angular2-O365-desktop-app
Desktop application using Electron, Angular 2, Material Design Lite and Office 365 (Microsoft Graph API).

## Getting started

Install dependencies

`
npm install
`

Compile typescript files

`
npm run tsc
`

Run application

`
npm run electron
`

## Azure AD application Registration

Register this application in the Azure Active Directory service for your Office 365 tenant.
Easy to use online tool: [Office 365 App Registration Tool](https://dev.office.com/app-registration) 

* App Registration Type: Native Application
* Redirect URI: http://localhost:8000
* Select all read items for Users, Groups, Mail, Calendar, Contacts and Files.
* Register the app and remember to copy your client ID provided to you.
* Update the svcConstant.ts file with your values.

// Image

Once your app is registered you need to download the app manifest file from [Azure Portal](https://manage.windowsazure.com/)
Set "oauth2AllowImplicitFlow": true in application manifest file and upload the amnifest file again.

### Azure AD Application Permission requirements
You need to make sure the application permission is set correctly to have access to the Microsoft Graph resource.
This can be done in the [Azure Portal](https://manage.windowsazure.com/)

Required Permissions

* Read all notebooks that the user can access
* Access user's data anytime
* Read items in all site collections
* Read files that the user selects
* Read user files and files shared with user
* Read user contacts
* Read user calendars
* Read user mail
* Read directory data
* Read all groups
* Read all users' full profiles
* Read all users' basic profiles
* Sign in and read user profile
* Read user notebooks
* Read users' relevant people list

Go to [Microsoft Graph API](http://graph.microsoft.io/docs/overview/overview) if you want to know more.

## Application Build & Deployment

Follow Electron documentation for build for Windows, Linux and OSX.

To package files for deployment:


* npm install -g asar
* asar pack angular2-O365-desktop-app app.asar


** More details to follow **

## Resources

* [Angular 2](https://angular.io/)
* [Material Design Lite](http://www.getmdl.io/)
* [Electron](http://electron.atom.io/)
* [Office 365](https://products.office.com/en-gb/business/compare-office-365-for-business-plans)
* [Office 365 Development](https://dev.office.com/)

## TODO

* Set Electron top menu options.
* Improve error handling.
* Implement better design for each section.
* Manual refresh button for user.
* Add content paging.
* Add D3.js for dashboard components
* Setup production build task.
* Create unit tests.


If you have any issues or suggestion please submit on [GitHub Issues](https://github.com/Cecildt/angular2-O365-desktop-app/issues).