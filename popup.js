var uid, itemNums = 0;
var usersData, clickedClass;

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
              clearElement('listClassMenu');
              for (var key in usersData)
              {
                var li = document.createElement('li');
                var button = document.createElement('button');
                button.innerHTML = key;
                button.className = "classButton";
                button.id = key;
                button.onclick = (function(key){
                  return function(){
                    setContents('classContents');
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
          db.collection("users").doc(uid).set({});
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

// clear all child elements in block
function clearElement(element)
{
  var block = document.getElementById(element);
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
}

document.getElementById('logoutButton').onclick = function ()
{
  firebase.auth().signOut();
}

function setContents(content)
{
  document.getElementById('addNewClassContents').style.display = "none";
  document.getElementById('classContents').style.display = "none";
  document.getElementById('edit-class-container').style.display = "none";
  document.getElementById(content).style.display = "block";
}

// reset view
function resetView()
{
  if (Object.keys(usersData).length === 0 && usersData.constructor === Object)
  {
    setContents('addNewClassContents');
    return;
  }

  setContents('classContents');

  var first_element = Object.keys(usersData)[0];
  document.getElementById(first_element).style.backgroundColor = "#727272";
  document.getElementById(first_element).style.color = "white";
  classCLicked(first_element);
  clickedClass = first_element;
}

function addEmptyItemToTable(tableName, choice)
{
  var table = document.getElementById(tableName);
  var i = table.rows.length;
  var tr = document.createElement('tr');
  tr.id = "row" + choice + i;
  tr.style.lineHeight = "0";
  var thName = document.createElement('td');
  var inputName = document.createElement('input');
  inputName.value = "";
  inputName.id = "itemName" + choice + i;
  inputName.className = "form-control tableInput";
  inputName.type = "text";
  thName.append(inputName);

  var thWeight = document.createElement('td');
  var inputWeight = document.createElement('input');
  inputWeight.value = "";
  inputWeight.id = "weight" + choice + i;
  inputWeight.className = "form-control tableInput";
  inputWeight.type = "text";
  thWeight.append(inputWeight);

  var thGradeGot = document.createElement('td');
  var numerator = document.createElement('input');
  numerator.value = "";
  numerator.id = "numerator" + choice + i;
  numerator.className = "form-control numberTableInput";
  numerator.style.width = "30px";
  numerator.type = "number";
  var divideLabel = document.createElement('p');
  divideLabel.innerHTML = "/";
  divideLabel.style.display = "inline-block";
  var denumerator = document.createElement('input');
  denumerator.value = "";
  denumerator.id = "denumerator" + choice + i;
  denumerator.className = "form-control numberTableInput";
  denumerator.style.width = "30px";;
  denumerator.style.padding = "0";
  denumerator.type = "number";
  thGradeGot.append(numerator);
  thGradeGot.append(divideLabel);
  thGradeGot.append(denumerator);

  var thGradeNeed = document.createElement('td');
  thGradeNeed.style.textAlign = "center";
  var img = document.createElement('img');
  img.src = "images/delete.svg";
  img.className = "deleteImg";
  img.onclick = (function(i) {
    return function(){
      document.getElementById('row' + choice + i).style.display = "none";
    }
  })(i);
  thGradeNeed.append(img);

  tr.append(thName);
  tr.append(thWeight);
  tr.append(thGradeGot);
  tr.append(thGradeNeed);
  table.append(tr);
}

// Allow users to add new Class contents
document.getElementById('addClassButton').onclick = function ()
{
  itemNums = 0;
  for (var name in usersData)
  {
    document.getElementById(name).style.backgroundColor = "transparent";
    document.getElementById(name).style.color = "black";
  }
  setContents('addNewClassContents');
  clearElement('addClassBodyContents');
  document.getElementById('classNameAdd').value = "";
  document.getElementById('targetScoreAdd').value = "";
  document.getElementById('classNameAddWarning').style.display = "none";
  document.getElementById('targetScoreAddWarning').style.display = "none";
  document.getElementById('newClassAddWarning').style.display = "none";
  addEmptyItemToTable('addClassBodyContents', "Add");
}

// Submit the new class to the database
document.getElementById('submitNewClass').onclick = function ()
{
  // print warning if class name is empty
  if (document.getElementById('classNameAdd').value == '')
  {
    document.getElementById('classNameAddWarning').style.display = "block";
    return;
  }
  else
    document.getElementById('classNameAddWarning').style.display = "none";

  if (document.getElementById('targetScoreAdd').value == '')
  {
    document.getElementById('targetScoreAddWarning').style.display = "block";
    return;
  }
  else
    document.getElementById('targetScoreAddWarning').style.display = "none";

  // print warning if some fields are empty
  var table = document.getElementById('addClassBodyContents');
  for (var i = 0, row; row = table.rows[i]; i++)
  {
    if (row.style.display != "none")
    {
      if (document.getElementById('itemNameAdd' + i).value == "" || document.getElementById('weightAdd' + i).value == "")
      {
        document.getElementById('newClassAddWarning').style.display = "block";
        return;
      }
    }
  }
  document.getElementById('newClassAddWarning').style.display = "none";

  // get data
  var data = [];
  for (var i = 0, row; row = table.rows[i]; i++)
  {
    data.push({
      name: document.getElementById('itemNameAdd' + i).value,
      weight: document.getElementById('weightAdd' + i).value,
      numerator: document.getElementById('numeratorAdd' + i).value,
      denumerator: document.getElementById('denumeratorAdd' + i).value
    });
  }
  data.push({target_score: document.getElementById('targetScoreAdd').value});

  var updatedData = {};
  updatedData[document.getElementById('classNameAdd').value] = data;
  console.log(updatedData)
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
  clickedClass = key;
  for (var name in usersData)
  {
    document.getElementById(name).style.backgroundColor = "transparent";
    document.getElementById(name).style.color = "black";
  }
  document.getElementById(key).style.backgroundColor = "#727272";
  document.getElementById(key).style.color = "white";

  clearElement('classBodyContents');
  var table = document.getElementById('classBodyContents');

  var size = usersData[key].length;
  var weightNeed = 0;
  var weightGot = 0;
  var targetScore = parseInt(usersData[key][size-1]['target_score']);
  var sumScore = 0;
  for (var i=0; i< size-1; i++)
  {
    if (usersData[key][i]['numerator'] == '' || usersData[key][i]['denumerator'] == '')
    {
      weightNeed += parseInt(usersData[key][i]['weight']);
    }
    else
    {
      weightGot += parseInt(usersData[key][i]['weight']);
      sumScore += parseInt(usersData[key][i]['numerator']) / parseInt(usersData[key][i]['denumerator']) * parseInt(usersData[key][i]['weight']);
    }
  }
  targetScore = (weightGot + weightNeed) / 100 * targetScore;
  targetScore = (targetScore - sumScore) / weightNeed;

  for (var i=0; i< size-1; i++)
  {
    var tr = document.createElement('tr');
    var thName = document.createElement('td');
    thName.innerHTML = usersData[key][i]['name'];
    var thWeight = document.createElement('td');
    thWeight.innerHTML = usersData[key][i]['weight'];
    var thGradeGot = document.createElement('td');
    var thGradeNeed = document.createElement('td');
    if (usersData[key][i]['numerator'] == '' || usersData[key][i]['denumerator'] == '')
    {
      thGradeGot.innerHTML = "";
      thGradeNeed.innerHTML = (targetScore * 100).toFixed(2) + "%";
    }
    else
    {
      thGradeGot.innerHTML = usersData[key][i]['numerator'] + " / " + usersData[key][i]['denumerator'];
      thGradeNeed.innerHTML = "";
    }
    tr.append(thName);
    tr.append(thWeight);
    tr.append(thGradeGot);
    tr.append(thGradeNeed);
    table.append(tr);
  }

  document.getElementById('targetScoreText').innerHTML = usersData[key][size-1]['target_score'] + "%";
  document.getElementById('currentScore').innerHTML = (sumScore / weightGot * 100).toFixed(2) + "%";
}

// Allow users to edit class contents
document.getElementById('editClassButton').onclick = function()
{
  var key =  clickedClass;
  var size = usersData[key].length;
  setContents('edit-class-container');
  document.getElementById('classNameChange').value = key;
  document.getElementById('targetScoreChange').value = usersData[key][size-1]['target_score'];

  clearElement('editClassContents');
  var table = document.getElementById('editClassContents');

  for (var i=0; i< size-1; i++)
  {
    var tr = document.createElement('tr');
    tr.id = "rowChange" + i;
    tr.style.lineHeight = "0";
    var thName = document.createElement('td');
    var inputName = document.createElement('input');
    inputName.value = usersData[key][i]['name'];
    inputName.id = "itemNameChange" + i;
    inputName.className = "form-control tableInput";
    inputName.type = "text";
    thName.append(inputName);

    var thWeight = document.createElement('td');
    var inputWeight = document.createElement('input');
    inputWeight.value = usersData[key][i]['weight'];
    inputWeight.id = "weightChange" + i;
    inputWeight.className = "form-control tableInput";
    inputWeight.type = "text";
    thWeight.append(inputWeight);

    var thGradeGot = document.createElement('td');
    var numerator = document.createElement('input');
    numerator.value = usersData[key][i]['numerator'];
    numerator.id = "numeratorChange" + i;
    numerator.className = "form-control numberTableInput";
    numerator.style.width = "30px";
    numerator.type = "number";
    var divideLabel = document.createElement('p');
    divideLabel.innerHTML = "/";
    divideLabel.style.display = "inline-block";
    var denumerator = document.createElement('input');
    denumerator.value = usersData[key][i]['denumerator'];
    denumerator.id = "denumeratorChange" + i;
    denumerator.className = "form-control numberTableInput";
    denumerator.style.width = "30px";;
    denumerator.style.padding = "0";
    denumerator.type = "number";
    thGradeGot.append(numerator);
    thGradeGot.append(divideLabel);
    thGradeGot.append(denumerator);

    var thGradeNeed = document.createElement('td');
    thGradeNeed.style.textAlign = "center";
    var img = document.createElement('img');
    img.src = "images/delete.svg";
    img.className = "deleteImg";
    img.onclick = (function(i) {
      return function(){
        document.getElementById('rowChange' + i).style.display = "none";
      }
    })(i);
    thGradeNeed.append(img);

    tr.append(thName);
    tr.append(thWeight);
    tr.append(thGradeGot);
    tr.append(thGradeNeed);
    table.append(tr);
  }
}

// delete a class
document.getElementById('deleteClassButton').onclick = function()
{
  var deleteData = {};
  deleteData[clickedClass] = firebase.firestore.FieldValue.delete();
  db.collection("users").doc(uid).update(deleteData);
}

// save changes for editing
document.getElementById('saveChangesButton').onclick = function()
{
  var key = clickedClass;
  var table = document.getElementById('editClassContents');
  var data = [];

  for (var i = 0, row; row = table.rows[i]; i++)
  {
    if (row.style.display != "none")
    {
      data.push({
        name: document.getElementById('itemNameChange' + i).value,
        weight: document.getElementById('weightChange' + i).value,
        numerator: document.getElementById('numeratorChange' + i).value,
        denumerator: document.getElementById('denumeratorChange' + i).value
      });
    }
  }
  data.push({target_score: document.getElementById('targetScoreChange').value});
  var updatedData = {};
  updatedData[document.getElementById('classNameChange').value] = data;
  var deleteData = {};
  deleteData[key] = firebase.firestore.FieldValue.delete();

  db.collection("users").doc(uid).update(deleteData);
  db.collection("users").doc(uid).update(updatedData);
}

// cancel edit class
document.getElementById('cancelChangesButton').onclick = function()
{
  resetView();
}

// add new item to edit class table
document.getElementById('addItemChanges').onclick = function()
{
  addEmptyItemToTable('editClassContents', "Change");
}

document.getElementById('addItemAddClass').onclick = function()
{
  addEmptyItemToTable('addClassBodyContents', "Add");
}

