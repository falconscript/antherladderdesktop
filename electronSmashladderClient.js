// SMASHLADDER JS FOR ELECTRON


// note - could wrap this all in an if check for smashladder.com if you kept the files separate
// cause this file runs before any JS file of smashladder.com or ANY SITE that a user navigates to
// from within the electron window (i.e. clicking on some punk's youtube link in chat)
process.once('loaded', () => {
  // just a weird electron thing you need to throw in to get jQuery working, not sure why tbh
  // will need to ask me more about it if you like the idea tbh
  // global.document and global.window - though we seem to be within window already
  if (typeof module === 'object') {window.module = module; module = undefined;}
  delete module;
  delete window.module; // can sometimes break stuff - make sure to use the real fix here:
  // https://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined

  // ideally you want to revert back after adding scripts
  // if (window.module) module = window.module;



  // --- STUFF ABOVE THIS LINE IS STUPID



  // THIS IS THE CLIENT JAVASCRIPT TO PUT INTO THE SMASHLADDER.COM WEBSITE JS
  // It is in a protective wrapper so it only executes IF it is in the elctron app
  // Electron specific code for running within an Electron app's loaded browser tab
  window.IS_ELECTRON = typeof(window.require) === "function";

  // wrap to not break at least on loading for non-electron (meaning in actual browser)
  if (window.IS_ELECTRON) {
    alert("Confirmed we are in electron app. Electron hooks added.");

    // Set up electron
    window.electron = window.require('electron'); // not webpack require!
    // Create a listener for the VERSION event (I do not fire this sorry anther, works as example)
    electron.ipcRenderer.on('VERSION', (event, version) => {

    });

    // Function to signal the NODE process component to START UP dolphin process
    window.launchDolphin = function launchDolphin (someArgumentsToSendToDolphin) {
      alert("Launching dolphin! (just notepad actually).");
      //setTimeout(() => {
        electron.ipcRenderer.send("LAUNCH_DOLPHIN", someArgumentsToSendToDolphin);
      //}, 1000); // dramatic effect of delay, not needed
    }

    // stupid place to put this, but I can't access your site javascript files (thankfully)
    window.onload = function () {
      $(document).ready(() => { // yes I know this looks redundant, but we don't have jquery before onload fires
        let crazyButton = $(`
          <div
            onclick="window.launchDolphin()"
            class="btn btn-primary"
            style="width:50%;height:50px;position:absolute;z-index:500;right 10%;top:50%;"
          >
            START MATCH EXAMPLE - ANTHER CLICK THIS
          </div>
        `);

        $("body").prepend(crazyButton); // add crazy button
        //window.scrollTo(0, 0); // scroll back up after adding div
      });
    };

  }

});
