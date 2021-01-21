const presence = new Presence({
    clientId: "801743263052726292" //The client ID of the Application created at https://discordapp.com/developers/applications
  }),
  strings = presence.getStrings({
    play: "presence.playback.playing",
    pause: "presence.playback.paused"
    //You can use this to get translated strings in their browser language
  });
var deets = "Idle";
var state = "";
var plst = "";
let strt : Date = 0;

function setVars(){
    //Grab and process all your data here

    // element grabs //
    // api calls //
    // variable sets //
    let path = window.location.pathname;
    if (path.startsWith("/explore")) {
        deets = "Browsing idly";
        state = "Exploring";
        return;
    } else 
    if (path.startsWith("/library")) {
      deets = "Browsing idly";
      state = "Checking out their library";
      return;
    } else {
      switch (path) {
        case "/feed":
          if (strt.getTime() !== 0) {
            strt = 0;
          }
          plst = "";
          deets = "Browsing idly";
          state = "Feed";
          break;
        case "/mix-editor":
          if (strt.getTime() == 0) {
            strt = Date.now();
          }
          deets = "Mix Editor";
          state = `Working on "${document.getElementsByClassName("mix-editor-header-project-name-input")[0].value}"`;
          break;
        default:
          if (window.location.search.startsWith("?revId=")) {
            // On a song page
            if (document.getElementsByClassName("global-player-icon-button")[1].classList[2] == "icon-player-play") {
              plst = "Paused";
            } else {
              plst = "Playing";
            };
            deets = "Listening";
            state = `"${document.getElementsByTagName("song-link")[0].innerText}" - ${document.getElementsByTagName("project-author")[0].innerText}`
          }
          break;
      }
    }
}

setInterval(setVars, 10000);
//Run the function separate from the UpdateData event every 10 seconds to get and set the variables which UpdateData picks up

presence.on("UpdateData", async () => {
  /*UpdateData is always firing, and therefore should be used as your refresh cycle, or `tick`. This is called several times a second where possible.

    It is recommended to set up another function outside of this event function which will change variable values and do the heavy lifting if you call data from an API.*/

  let presenceData: PresenceData = {
    largeImageKey:
      "mainicon" /*The key (file name) of the Large Image on the presence. These are uploaded and named in the Rich Presence section of your application, called Art Assets*/,
    smallImageKey:
      plst.toLowerCase(), /*The key (file name) of the Large Image on the presence. These are uploaded and named in the Rich Presence section of your application, called Art Assets*/,
    smallImageText: plst, //The text which is displayed when hovering over the small image
    details: deets, //The upper section of the presence text
    state: state //The lower section of the presence text
    //startTimestamp: 1577232000 //The unix epoch timestamp for when to start counting from
  }; /*Optionally you can set a largeImageKey here and change the rest as variable subproperties, for example presenceSata.type = "blahblah"; type examples: details, state, etc.*/
  if (strt.getTime == 0) {
    presenceData["startTimestamp"] = strt;
  }
  if (presenceData.details == null) {
    //This will fire if you do not set presence details
    presence.setTrayTitle(); //Clears the tray title for mac users
    presence.setActivity(); /*Update the presence with no data, therefore clearing it and making the large image the Discord Application icon, and the text the Discord Application name*/
  } else {
    //This will fire if you set presence details
    presence.setActivity(presenceData); //Update the presence with all the values from the presenceData object
  }
});
