// Allow users to add new Class contents
document.getElementById('addClassButton').onclick = function ()
{
  itemNums = 0;
  for (var name in usersData)
  {
    document.getElementById(name).style.backgroundColor = "transparent";
    document.getElementById(name).style.color = "black";
  }
  setViewMode('addNewClassContents');
  clearElement('addClassBodyContents');
  document.getElementById('classNameAdd').value = "";
  document.getElementById('targetScoreAdd').value = "";
  document.getElementById('classNameAddWarning').style.display = "none";
  document.getElementById('targetScoreAddWarning').style.display = "none";
  document.getElementById('newClassAddWarning').style.display = "none";
  addEmptyItemToTable('addClassBodyContents', "Add");
}

// Cancel add new class
document.getElementById('cancelNewClass').onclick = function ()
{
  resetView();
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
    if (row.style.display != "none")
    {
      data.push({
        name: document.getElementById('itemNameAdd' + i).value,
        weight: document.getElementById('weightAdd' + i).value,
        numerator: document.getElementById('numeratorAdd' + i).value,
        denumerator: document.getElementById('denumeratorAdd' + i).value
      });
    }
  }
  data.push({target_score: document.getElementById('targetScoreAdd').value});

  var updatedData = {};
  updatedData[document.getElementById('classNameAdd').value] = data;
  db.collection("users").doc(uid).update(updatedData);
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