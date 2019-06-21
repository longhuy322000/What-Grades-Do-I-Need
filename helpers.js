/*
    This javascript file serves the authenticated process
*/

// get all data from the database
function getUserData()
{
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
            setViewMode('classContents');
            classCLicked(key);
          }
        })(key);
        li.append(button);
        classList.append(li);
      }
    resetView();
    });
}

// clear all children elements in block
function clearElement(element)
{
  var block = document.getElementById(element);
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
}

// set view mode 
function setViewMode(content)
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
    setViewMode('addNewClassContents');
    clearElement('addClassBodyContents');
    addEmptyItemToTable('addClassBodyContents', "Add");
    return;
  }
  setViewMode('classContents');

  var first_element = Object.keys(usersData)[0];
  document.getElementById(first_element).style.backgroundColor = "#727272";
  document.getElementById(first_element).style.color = "white";
  
  if (!clickedClass)
    clickedClass = first_element;
  
  classCLicked(clickedClass);
}

// Add empty item to table
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
  inputWeight.type = "number";
  inputWeight.style.textAlign = "center";
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