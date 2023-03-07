/* ==================================================
               Api data load
   ================================================== */
const apiLoadingData = async (dataLimit) => {
   const url = `https://openapi.programming-hero.com/api/ai/tools`;
   try {
      const res = await fetch(url);
      const data = await res.json();
      showDataDisplay(data.data.tools, dataLimit);
      sortDate(data.data.tools)
   } catch (err) {
      console.log(err);
   }
}
apiLoadingData(6);

/* ==================================================
              window Data load Spinner
   ================================================== */
window.addEventListener('load', function () {
   toggleSpinner(true);
})

/* ==================================================
             sort By Data filter
   ================================================== */
const sortDate = (dates) => {
   let sDate = dates;
   let sortDataResult = sDate.sort((a, b) => new Date(a.published_in) - new Date(b.published_in));
   sortByDateShow(sortDataResult);
}

const sortByDate = document.getElementById("sort-by-data");
const sortByDateShow = (sortByDateData) => {
   sortByDate.addEventListener("click", function () {
      showDataDisplay(sortByDateData);
   })
}

/* ==================================================
              show Data Display
   ================================================== */
const showDataDisplay = (apiData, dataLimit) => {
   const allDataContainer = document.getElementById("all-data-container");
   allDataContainer.innerHTML = "";

   // display 6 data
   const seeMore = document.getElementById("see-more");
   if (dataLimit && apiData.length > 6) {
      apiData = apiData.slice(0, 6);
      seeMore.classList.remove("d-none")
   } else {
      apiData = apiData;
      seeMore.classList.add("d-none")
   }

   // api data display
   apiData.forEach(singleData => {
      const { name, image, features, published_in, id } = singleData;
      const cardParent = document.createElement("div");
      cardParent.classList.add("col");

      cardParent.innerHTML = `
         <div class="card h-100 p-3">
            <img src="${image}" class="card-img-top h-50 object-fit-cover" alt="...">
            <div class="card-body">
               <h5 class="card-title text-black">Features</h5>
               <ol>
                  <li>${features[0] ? features[0] : "No data Found"}</li>
                  <li>${features[1] ? features[1] : "No data Found"}</li>
                  <li>${features[2] ? features[2] : "No data Found"}</li>
               </ol>
            </div>
            <div class="card-footer bg-white">
               <div class="d-flex align-items-center justify-content-between">
                  <div>
                     <h3>${name}</h3>
                     <p><i class="fa-regular fa-calendar-days"></i> <span class="date-info">${published_in}</span></p>
                  </div>
                  <div>
                     <button type="button" class="btn btn-danger rounded-5" 
                     data-bs-toggle="modal" data-bs-target="#exampleModal"
                     onclick="singleDataLoadingApi('${id}')">
                        <i class="fa-solid fa-arrow-right"></i>
                     </button>
                  </div>
               </div>
            </div>
         </div>
      `
      allDataContainer.appendChild(cardParent)
   })
   toggleSpinner(false)
}

/* ==================================================
               single Data Loading Api
   ================================================== */
const singleDataLoadingApi = async (id) => {
   const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
   try {
      const res = await fetch(url);
      const data = await res.json();
      showMoreDetailsModal(data.data);
   } catch (err) {
      console.log(err);
   }
}

/* ==================================================
             more details print modal Data 
   ================================================== */
const showMoreDetailsModal = (detailsData) => {
   // object data push into array
   let detailsModalData = detailsData;
   let modalConvert = [];
   modalConvert.push(detailsModalData);

   // modal data details print
   const modalBody = document.getElementById("modal-body");
   modalConvert.forEach(singleDetails => {
      console.log(singleDetails);
      const { description, pricing, image_link, features, integrations, accuracy, input_output_examples } = singleDetails;
      modalBody.innerHTML = `
      <div class="d-flex flex-column flex-lg-row align-content-center gap-5">
         <div class="cu-model-bg p-5 rounded-5 w-100 lg:w-75">
            <h2>${description}</h2>
            <div class="d-flex flex-column flex-md-row align-items-center gap-3">
               <div class="bg-white p-4 rounded-4 text-center">
                  <h3 class="text-success rounded-3">${pricing ? pricing[0].price : "Free of Cost/Basic"} ${pricing ? pricing[0].plan : ""} </h3>
               </div>
               <div class="bg-white p-4 rounded-4 text-center">
                  <h3 class="text-primary rounded-3">${pricing ? pricing[1].price : "Free Of Cost/Pro"} ${pricing ? pricing[1].plan : ""} </h3>
               </div>
               <div class="bg-white p-4 rounded-4 text-center">
                  <h3 class=" text-danger rounded-3">${pricing ? pricing[2].price : "Free of Cost /Enterprise"} ${pricing ? pricing[2].plan : ""} </h3>
               </div>
            </div>
            <div class="d-flex flex-column flex-md-row align-items-center justify-content-between mt-3">
               <div>
                  <h2>Features</h2>
                  <ul>
                     <li>${features[1].feature_name}</li>
                     <li>${features[2].feature_name}</li>
                     <li>${features[3].feature_name}</li>
                  </ul>
               </div>
               <div>
                  <h2>Integrations</h2>
                  <ul>
                     ${integrations ? integrations.map((integrationsItem) => `<li>${integrationsItem}</li>`) : "No data Found"}
                  </ul>
               </div>
            </div>
         </div>
         <div class="w-100 lg:w-25">
            <div class="position-relative">
               <img class="rounded-4" src="${image_link[0]}" alt="">
               <span class="badge px-4 py-3 text-bg-danger position-absolute top-0 end-0">${accuracy.score ? accuracy.score + " % accuracy" : ""}</span>
            </div>
            <h2 class="mt-4 text-center">${input_output_examples ? input_output_examples[0].input : "Can you give any example?"}</h2>
            <p class="text-center">${input_output_examples ? input_output_examples[0].output : "No! Not Yet! Take a break!!!"}</p>
         </div>
      </div>
   `
   })
}

/* ==================================================
           see All Data 
   ================================================== */
const showAll = document.getElementById("btn-show-all");
showAll.addEventListener("click", function () {
   toggleSpinner(true);
   apiLoadingData();
})

/* ==================================================
             toggle Spinner add
   ================================================== */
const loader = document.getElementById("loader");
const toggleSpinner = isLoading => {
   if (isLoading) {
      loader.classList.remove("d-none")
   } else {
      loader.classList.add("d-none")
   }
}
