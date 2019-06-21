// Allow users to edit class contents
document.getElementById('editClassButton').onclick = function()
{
  var key =  clickedClass;
  var size = usersData[key].length;
  setViewMode('edit-class-container');
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
    inputWeight.type = "number";
    inputWeight.style.textAlign = "center";
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

// save changes after editing
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

  clickedClass = document.getElementById('classNameChange').value;

  db.collection("users").doc(uid).update(deleteData);
  db.collection("users").doc(uid).update(updatedData);
}

// cancel edit class
document.getElementById('cancelChangesButton').onclick = function()
{
  resetView();
}