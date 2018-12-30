chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if (request.message == "googleSignIn")
    {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
            chrome.runtime.sendMessage({login: user.uid});
        }).catch(function(error) {
            console.log(error);
        });
    }
});