// global variables
var uid, itemNums = 0;
var usersData, clickedClass;

window.onload = function() {
  initApp(); // in authentication.js file
};

/*
  This file mainly includes all the basic functionalities of the extension
*/

// User click on class
function classCLicked(key)
{
  clickedClass = key;
  for (var name in usersData)
  {
    var element = document.getElementById(name);
    element.style.backgroundColor = "transparent";
    element.style.color = "black";
    element.style.fontWeight = "normal";
  }
  document.getElementById(key).style.backgroundColor = "#727272";
  document.getElementById(key).style.color = "white";
  document.getElementById(key).style.fontWeight = "bold";

  clearElement('classBodyContents');
  var table = document.getElementById('classBodyContents');

  var size = usersData[key].length;
  var weightNeed = 0;
  var weightGot = 0;
  var targetScore = parseFloat(usersData[key][size-1]['target_score']);
  var sumScore = 0;
  for (var i=0; i< size-1; i++)
  {
    if (usersData[key][i]['numerator'] == '' || usersData[key][i]['denumerator'] == '')
    {
      weightNeed += parseFloat(usersData[key][i]['weight']);
    }
    else
    {
      weightGot += parseFloat(usersData[key][i]['weight']);
      sumScore += parseFloat(usersData[key][i]['numerator']) / parseFloat(usersData[key][i]['denumerator']) * parseFloat(usersData[key][i]['weight']);
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
    thWeight.style.textAlign = "center";
    var thGradeGot = document.createElement('td');
    thGradeGot.style.textAlign = "center";
    var thGradeNeed = document.createElement('td');
    thGradeNeed.style.textAlign = "center";
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

// delete a class
document.getElementById('deleteClassButton').onclick = function()
{
  var deleteData = {};
  deleteData[clickedClass] = firebase.firestore.FieldValue.delete();
  db.collection("users").doc(uid).update(deleteData);
}
