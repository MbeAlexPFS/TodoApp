//Variable
let addPage = document.querySelector("#add")
let aboutPage = document.querySelector("#about")
let editPage = document.querySelector("#edit")
let listPage = document.querySelector("#list")
let historyPage = document.querySelector("#history")
let savePage = document.querySelector("#save")
let loadPage = document.querySelector("#load")

let pages = [addPage,aboutPage,editPage,historyPage,savePage,loadPage]

let ids = 0 //id global
let aid = 0 //id utilisé pour les traitements
let actual_date = (new Date).toISOString().split("T")[0].split("-").reverse().join("-") // jj-mm-aaaa

let act = [
  // ajout de ... ,
]

let task = [
  /*Exemple de données tache{
    "id" : 0
    "name" : "exemple",
    "desc" : "exemple de tache",
    "date" : "11-10-2024",
    "created_at" : "05-09-2024",
    "updated_at" : "08-09-2024",
    "completed_at" : "13-10-2024"
  }*/
]

let filtered_task = [
  //même que task mais trié et ordonné
]

//init
updateList()
updateHistory()
filterTask()

//Fonction
function downloadObjectAsJson(exportObj, exportName){ //basé sur un code javascript importé pour telecharger une base json
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
function Date1SubDate2(d1,d2) { //date1 - date2 pour comparer
  return (parseInt(d1.split("-")[0]) + parseInt(d1.split("-")[1]) + parseInt(d1.split("-")[2])) - (parseInt(d2.split("-")[0]) + parseInt(d2.split("-")[1]) + parseInt(d2.split("-")[2]))
}

function show(id) { //montre une page popup et cache les autres
  for (const page of pages) {
    if (page.getAttribute("id") == id) {
      page.style.display = "block"  
    }else {
       page.style.display = "none"
    }
  }
}

function filterTask() {
  let name = document.querySelector("#search_task").value
  filtered_task = []
  if (name.trim() != "") { //filtre le nom
    for (const tsk of task) {
      if (tsk.name.includes(name)) {
        filtered_task.push(tsk)
      }
    }
  }else {
    filtered_task = task
  }
  updateList()
}

function saveTask() {
  let name = document.querySelector("#save_task").value
  if (name.trim() == "") {
    alert("Veuillez remplir le champ")
  }else{
    act.push("Sauvegarde de la base de tache "+ name +" le " + actual_date + " .")
    updateHistory()
    downloadObjectAsJson({name,task,act,ids},name)
  }
}

document.getElementById('load_task').addEventListener('change', function(event) { //basé sur un code javascript importé pour charger une base
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          try {
              const jsonContent = JSON.parse(e.target.result);
              if (jsonContent.ids == undefined || jsonContent.task == undefined || jsonContent.act == undefined) {
                alert("Le fichier choisi n'est pas compatible .")
              }else {
                ids = jsonContent.ids
                task = jsonContent.task
                act = jsonContent.act
                act.push("Chargement de la base de tache "+jsonContent.name+" le " + actual_date + " .")
                updateHistory()
                updateList()
                filterTask()
              }
              // You can now work with the JSON content
          } catch (error) {
              console.error('Error parsing JSON:', error);
          }
      };
      reader.readAsText(file);
  } else {
      console.error('No file selected');
  }
});
  

function updateHistory() { //mettre à jour la page historique
  let ListHistory = document.querySelector("#ul")
  ListHistory.innerHTML = ``
  if (act.length > 0) {
    for (const htr of act) {
      ListHistory.innerHTML += `<li>${htr}</li>`
    }
  }else {
      ListHistory.innerHTML += `<li>Auncun évenement n'a été reporter .</li>`
  }
 
}

function addTask() { //ajoute une tache dans la pseudo base
  let name = addPage.querySelector("#add_name").value
  let desc = addPage.querySelector("#add_desc").value
  let date = addPage.querySelector("#add_date").value.split("-").reverse().join("-") //jj-mm-aaaa
  if (name.trim() == "" || desc.trim() == "" || date.trim() == "") { //Champ verification
    alert("Veuillez remplir tout les champ")
  }else if (Date1SubDate2(date,actual_date) <= 0) {
    alert("Veuillez entrer une date supérieur à la date actuelle")
  }else{
    ids += 1
    act.push("Ajout de la tache " + name + " le " + actual_date + " .")
    task.push({
      "id" : ids,
      "name" : name,
      "desc" : desc,
      "date" : date,
      "created_at" : actual_date,
      "updated_at" : "",
      "completed_at" : ""
    })
    updateList()
    updateHistory()
    addPage.querySelector("#add_name").value = ""
    addPage.querySelector("#add_desc").value = ""
    addPage.querySelector("#add_date").value = ""
  }
}

function editTaskForm(id) { //init et montre la page d'edition en popup
  aid = id
  for (const tsk of task) {
    if (tsk.id == aid) { 
      editPage.querySelector("#edit_name").value = tsk.name
      editPage.querySelector("#edit_desc").value = tsk.desc
      editPage.querySelector("#edit_date").value = tsk.date.split("-").reverse().join("-") //aaaa-mm-jj
    }
  }
  show("edit")
}

function editTask() { //édite une tache
  for (const tsk of task) {
    if (tsk.id == aid) {
      let name = editPage.querySelector("#edit_name").value
      let desc = editPage.querySelector("#edit_desc").value
      let date = editPage.querySelector("#edit_date").value.split("-").reverse().join("-") //jj-mm-aaaa
      if (name.trim() == "" || desc.trim() == "" || date.trim() == "") { //Champ verification
        alert("Veuillez remplir tout les champ")
      }else if (Date1SubDate2(date,actual_date) <= 0) {
        alert("Veuillez entrer une date supérieur à la date actuelle")
      }else{
        act.push("Edition de la tache " + name + " le " + actual_date + " .")
        tsk.name = name
        tsk.desc = desc
        tsk.date = date
        tsk.updated_at = actual_date
        updateList()
        updateHistory()
      }
    }
  }
}

function endTask(id) { //complète une tache
  for (const tsk of task) {
    if (tsk.id == id) {
      act.push("La tache " + tsk.name + " a été realisée le " + actual_date + " .")
      tsk.completed_at = actual_date
    }
  }
  updateList()
  updateHistory()
}

function deleteTask(id) { //complète une tache
  let index = 0
  for (const tsk of task) {
    if (tsk.id == id) {
      act.push("La tache " + tsk.name + " a été supprimé le " + actual_date + " .")
      task.splice(index,1)
    }
    index ++
  }
  updateList()
  updateHistory()
}

function updateList() {
  listPage.innerHTML = `` //reset
  if (task.length > 0) {
    for (const tsk of filtered_task) {
      let statut = ""
      let disabled = ""
      if (tsk.completed_at == "") {
        if (Date1SubDate2(tsk.date,actual_date) <= 0) {
          statut = "Passé"
        }else if (Date1SubDate2(tsk.date,actual_date) == 0) {
          statut = "En cours"
        }else {
          statut = "A venir"
        }
      }else {
        statut = "complèté"
        disabled = "disabled"
      }
      listPage.innerHTML += 
      `<div>
        <h2>${ statut }</h2>
        <h3>${ tsk.name }</h3>
        <p>${ tsk.desc }</p>
        <h4>${ tsk.date }</h4>
        <p>${ tsk.created_at }</p>
        <button onclick="editTaskForm(${tsk.id})" ${disabled}>Editer</button>
        <button onclick="endTask(${tsk.id})" ${disabled}>Accomplir</button>
        <button onclick="deleteTask(${tsk.id})">Enlever</button>
      <div>`
    }
  }else {
    listPage.innerHTML += `<div><h2>Aucune tache n'a été planifiée</h2></div>`  
  }
  
}



