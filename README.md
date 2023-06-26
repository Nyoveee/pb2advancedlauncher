# Plazma Burst 2 Advanced Launcher
This launcher was originally designed to be a mod launcher, allowing users to launch different types of .swf file with ease. Lin, another developer of PB2, noticed my launcher and wanted it to be released to the public.

A fixed 950 x 500 webview2 window, it has a better GUI (in my opinion anyways), has all the basic functionalities the original launcher have and more.

### Basic functionalities
* Account system (allowing users to launch the .swf file with their user credentials)
* Automatic update of game file
* News page (loading of page is rate-limited to )

### Additional functionalities
* More links to useful sites
* Ability to store mods (.swf), find additional mods through some database and swap between them with ease.
* Account management system, allowing users to switch between accounts with ease.

This application is made with Tauri, with ReactJs as it's frontend. Tauri is a lightweight alternative to Electron, requiring much less filesize and RAM while enabling the usage of HTML, CSS & JS as it's frontend.

## Prerequisities
As this application uses Tauri, refer to the [Tauri's prerequisitie webpage](https://tauri.app/v1/guides/getting-started/prerequisites/) for installation of Rust as well as certain system dependencies required in running this app in development mode.
1. Microsoft Visual Studio C++ Build Tools

The easiest way is to install [Build Tools for Visual Studio 2022](https://visualstudio.microsoft.com/visual-cpp-build-tools/). When asked which workloads to install, ensure "C++ build tools" and the Windows 10 SDK are selected.

2. [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section)
3. [Rust](https://www.rust-lang.org/tools/install) (it should install Cargo as well.)

This application also requires NodeJs and it's package manager (npm) to be installed. To install npm, you can install NodeJs. The installer will also install npm with it. I would also recommend installing Visual Studio Code if you want to play around with the code.

## Set up

First, clone this repository.

```
git clone https://github.com/Nyoveee/pb2advancedlauncher
```

Once cloned, go into the root directory (pb2advancedlauncher) and run
```
npm i
```

This installs all the dependencies for our frontend (React). Next, we run
```
npm run tauri dev
```
to install all the rust dependencies required and launch our application. (this may a take while.) Running this for the first time may result in an error. Don't worry, try running it again and it should work now.

## Running
To only run the frontend of the code, run
```
npm run start
```

To run the whole application, run
```
npm run tauri dev
```