var uid, itemNums = 0;
var usersData;

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
          db.collection("users").doc(uid)
            .onSnapshot(function(doc) {
              usersData = doc.data();
              var classList = document.getElementById('listClassMenu');
              var first = false;
              while (classList.firstChild) {
                classList.removeChild(classList.firstChild);
              }
              for (var key in usersData)
              {
                var li = document.createElement('li');
                var button = document.createElement('button');
                button.innerHTML = key;
                button.className = "classButton";
                button.id = key;
                button.onclick = (function(key){
                  return function(){
                    document.getElementById('addNewClassContents').style.display = "none";
                    document.getElementById('classContents').style.display = "block";
                    classCLicked(key);
                  }
                })(key);
                li.append(button);
                classList.append(li);
              }
              resetView();
            });
        }
        else
        {
          // can't find users in the database
          console.log("No such document!");
          db.collection("users").doc(uid).set()
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });

      document.getElementById('login-container').style.display = 'none';
      document.getElementById('contents-container').style.display = 'block';
    }
    else
    {
      console.log("not signed in");
      document.getElementById('login-container').style.display = 'block';
      document.getElementById('contents-container').style.display = 'none';
    }
    document.getElementById('loginButton').disabled = false;
  });

  document.getElementById('loginButton').addEventListener('click', startSignIn, false);
}

function startAuth(interactive) {
  // Request an OAuth token from the Chrome Identity API.
  chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      // Authorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function(error) {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        if (error.code === 'auth/invalid-credential') {
          chrome.identity.removeCachedAuthToken({token: token}, function() {
            startAuth(interactive);
          });
        }
      });
    } else {
      console.error('The OAuth Token was null');
    }
  });
}

// Starts the sign-in process.
function startSignIn() {
  document.getElementById('loginButton').disabled = true;
  startAuth(true);
}

window.onload = function() {
  initApp();
};

document.getElementById('logoutButton').onclick = function ()
{
  firebase.auth().signOut();
}

// reset view
function resetView()
{
  document.getElementById('addNewClassContents').style.display = "none";
  document.getElementById('classContents').style.display = "block";

  var first_element = Object.keys(usersData)[0];
  document.getElementById(first_element).style.backgroundColor = "#727272";
  document.getElementById(first_element).style.color = "white";
  classCLicked(first_element);
}

// Allow users to add new Class contents
document.getElementById('addClassButton').onclick = function ()
{
  itemNums = 0;
  document.getElementById('weightInfo').style.display = "none";
  document.getElementById('newClassButtonContainers').style.display = "none";
  for (var name in usersData)
  {
    document.getElementById(name).style.backgroundColor = "transparent";
    document.getElementById(name).style.color = "black";
  }
  document.getElementById('addNewClassContents').style.display = "block";
  document.getElementById('classContents').style.display = "none";
  document.getElementById('weightInfo').style.display = "none";

  var div = document.getElementById('items-new-class');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  document.getElementById('className').value = "";
  document.getElementById('classNameWarning').style.display = "none";
  document.getElementById('newClassWarning').style.display = "none";
}

// Add new items to the new class
document.getElementById('addNewItem').onclick = function ()
{
  itemNums++;
  var div = document.getElementById('items-new-class');
  var label = document.createElement('label');
  label.innerHTML = itemNums + ". Item:";

  var name = document.createElement('input');
  name.id = "itemName" + itemNums;
  name.placeholder = "Name";
  name.className = "form-control new-item";
  name.type = "text";
  name.style.height = "25px";
  name.style.fontSize = "13px";
  name.style.marginLeft = "25px";
  name.style.width = "125px";

  var weightLabel = document.createElement('label');
  weightLabel.innerHTML = "Weight: ";
  weightLabel.style.marginLeft = "13px";

  var weight = document.createElement('input');
  weight.id = "weight" + itemNums;
  weight.placeholder = "Only number";
  weight.className = "form-control new-item";
  weight.type = "number";
  weight.style.width = "125px";
  weight.style.height = "25px";
  weight.style.fontSize = "13px";

  var gradeLabel = document.createElement('label');
  gradeLabel.innerHTML = "Grade: ";
  gradeLabel.style.marginLeft = "5px";

  var numerator = document.createElement('input');
  numerator.id = "numerator" + itemNums;
  numerator.className = "form-control new-item";
  numerator.type = "number";
  numerator.style.width = "60px";
  numerator.style.height = "25px";
  numerator.style.fontSize = "13px";
  numerator.style.paddingRight = "0";
  var divideLabel = document.createElement('label');
  divideLabel.innerHTML = "/";
  divideLabel.style.marginLeft = "5px";
  var denumerator = document.createElement('input');
  denumerator.id = "denumerator" + itemNums;
  denumerator.className = "form-control new-item";
  denumerator.type = "number";
  denumerator.style.width = "60px";
  denumerator.style.height = "25px";
  denumerator.style.fontSize = "13px";
  denumerator.style.paddingRight = "0";
  denumerator.style.marginLeft = "5px";

  div.append(label);
  div.append(name);
  div.append(document.createElement('br'));
  div.append(weightLabel);
  div.append(weight);
  div.append(gradeLabel);
  div.append(numerator);
  div.append(divideLabel);
  div.append(denumerator);
  div.append(document.createElement('br'));

  if (itemNums == 1)
  {
    document.getElementById('newClassButtonContainers').style.display = "block";
    document.getElementById('weightInfo').style.display = "block";
  }
}

// Submit the new class to the database
document.getElementById('submitNewClass').onclick = function ()
{
  // print warning if class name is empty
  if (document.getElementById('className').value == '')
  {
    document.getElementById('classNameWarning').style.display = "block";
    return;
  }
  else
    document.getElementById('classNameWarning').style.display = "none";

  // print warning if item name is empty
  for (var i = 1; i<=itemNums; i++)
  {
    if (document.getElementById('itemName' + i).value == '' || document.getElementById('weight' + i).value == ''
        || document.getElementById('numerator' + i).value == '' || document.getElementById('denumerator' + i).value == '')
    {
      document.getElementById('newClassWarning').style.display = "block";
      return;
    }
  }
  document.getElementById('newClassWarning').style.display = "none";

  // get data
  var data = [];
  for (var i = 1; i<=itemNums; i++)
  {
    var dict = {};
    dict[document.getElementById('itemName' + i).value] = {
      weight: document.getElementById('weight' + i).value,
      numerator: document.getElementById('numerator' + i).value,
      denumerator: document.getElementById('denumerator' + i).value
    };
    data.push(dict);
  }
  data['total_score'] = 0;

  var updatedData = {};
  updatedData[document.getElementById('className').value] = data;
  console.log(updatedData);
  db.collection("users").doc(uid).update(updatedData);
  resetView();
}

// Cancel add new class
document.getElementById('cancelNewClass').onclick = function ()
{
  resetView();
}

// User click on class
function classCLicked(key)
{
  for (var name in usersData)
  {
    document.getElementById(name).style.backgroundColor = "transparent";
    document.getElementById(name).style.color = "black";
  }
  document.getElementById(key).style.backgroundColor = "#727272";
  document.getElementById(key).style.color = "white";

  var table = document.getElementById('classsBodyContents');
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  for (var i in usersData[key])
  {
    var item = Object.keys(usersData[key][i])[0];
    if (item == "total_score")
      continue;
    var tr = document.createElement('tr');
    var thName = document.createElement('th');
    thName.innerHTML = item;
    var thWeight = document.createElement('th');
    thWeight.innerHTML = usersData[key][i][item]['weight'];
    var thGrade = document.createElement('th');
    thGrade.innerHTML = usersData[key][i][item]['numerator'] + " / " + usersData[key][i][item]['denumerator'];
    tr.append(thName);
    tr.append(thWeight);
    tr.append(thGrade);
    table.append(tr);
  }
}