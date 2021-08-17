const form = document.querySelector("#add-cafe-form");

const cafeList = document.querySelector("#cafe-list");

//create elemnt n render cafe
function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "x";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);

  //deleting data
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("cafes").doc(id).delete();
  });
}

// getting data  //not realtime code begin

//db.collection('cafes').get().then((snapshot)=>{ // displays all entries in database

//comparing a query
// db.collection('cafes').where('city', '==', 'Kumasi').get().then((snapshot)=>{

//another way to query
// db.collection('cafes').where('city', '<', 'Kumasi').get().then((snapshot)=>{

// order by city
//db.collection('cafes')   .orderBy('name')   .get()   .then((snapshot) => {

// performing two comparison - where and
// this option will need to enable indexing -
//inspect page and click on error message page moves to the cloud and click on enable indexing

/*db.collection('cafes').where('city', '==', 'Kumasi').orderBy('name').get().then((snapshot) =>{ 
    snapshot.docs.forEach((doc) => {
      renderCafe(doc);
    });
  });
*/ //not realtime code end

// get realtime code - begin
db.collection("cafes")
  .orderBy("city")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") {
        renderCafe(change.doc);
      } else if (change.type == "removed") {
        let li = cafeList.querySelector("[data-id=" + change.doc.id + "]");
        cafeList.removeChild(li); //removes deleted record from DOM
      }
    });
  });

// getting data from both frontend and backend realtime code - end
//real time listener

// update records in console
//db.collection('cafes').doc('tvoaUL8SqSFp3u62S0ur'),update({name: 'China'})

//saving data
form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("cafes").add({
    name: form.name.value,
    city: form.city.value,
  });
  form.name.value = "";
  form.city.value = "";
});
