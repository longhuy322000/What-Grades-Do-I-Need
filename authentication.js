/*
    This javascript file includes all authenticated functions
*/

// Init app, check for authentication
function initApp() {
    firebase.auth().onAuthStateChanged(function(user)
    {
    if (user)
    {
        // User is signed in.
        uid = user.uid;
        var data = db.collection("users").doc(uid);
        data.get().then(function(doc)
        {
        if (doc.exists)
        {
            // display class list
            getUserData();
        }
        else
        {
            // can't find users in the database
            db.collection("users").doc(uid).set({});
            getUserData();
        }
        });
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('contents-container').style.display = 'block';
    }
    else
    {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('contents-container').style.display = 'none';
    }
    document.getElementById('loginButton').disabled = false;
    });

    document.getElementById('loginButton').addEventListener('click', startSignIn, false);
}

// Starts the sign-in process.
function startSignIn() {
    document.getElementById('loginButton').disabled = true;
    chrome.runtime.sendMessage({message: 'googleSignIn'});
}

// User signs out
function logOut() {
    firebase.auth().signOut();
}

document.getElementById('logoutButton').onclick = function() {
    logOut();
}