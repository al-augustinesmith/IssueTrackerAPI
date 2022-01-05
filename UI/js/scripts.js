const all_liquors = document.querySelector(".gallery-grids");
const beer_title = document.querySelector(".products-info");
const beer_info = document.querySelector(".beer-info");
const other_beer = document.querySelector(".recent-beers");
const new_item = document.querySelector("#newItem");
const items_list = document.querySelector("#itemList");
const all_beers_list = document.querySelector("#all_beers_list");
// form input
let formLiquorName = document.querySelector("#lname");
let formPrice = document.querySelector("#price");
let formCategory = document.querySelector("#category");
let formButton = document.querySelector("#formBtn");
let formImage = document.querySelector("#image");
let formBtn=document.querySelector('#formBtn')
// email regex
emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;
const getAllBeers = async () => {
  let API = `/api/v1/kavata`
  fetch(API, {
    method: "GET",
    headers: {
      "Content-Type": "Application/JSON"
    }
  })
    .then(response => {
      response.json().then(results => {
        const { data } = results
        all_liquors.innerHTML = ''
        data.forEach(res => {
          if (res.liquor_name) {
            all_liquors.innerHTML += `<div class="col-md-3" id='liquor'>
          <div id='single-liquor' class="my-2 mx-auto p-relative bg-white shadow-1 blue-hover beer-card">
          ${res.image_url ? `<img src="${res.image_url}"   
            class="img-responsive zoom-img"
            alt="${res.liquor_name}" />` : ``}

  <div class="px-1 py-1">
    <p class="mb-0 font-weight-medium text-uppercase mb-1 text-muted lts-2px">
    ${res.category}
    </p>

    <h1 class="ff-serif font-weight-normal text-black card-heading mt-0 mb-0" style="line-height: 1.25;">
    ${res.liquor_name.length > 22 ? `${res.liquor_name.slice(0, 20)}...` : res.liquor_name}
    </h1>

    <p class="mb-0">
    ${res.price} RWF </p>

  </div>

  <a onclick='setOrderID(${res.id})' class="text-uppercase d-inline-block hvr-rectangle-in font-weight-medium lts-2px ml-1 mb-0 text-center styled-link">
    Order Now
  </a>
</div> </div>`
          }
        })
        all_liquors.innerHTML += `<div class="clearfix"> </div>`
      });
    })
    .catch(err => {
      alert("Sorry, something went wrong!");
      return;
    });
};
// add new beer
const addNewBeer = async (here) => {
  const token = await localStorage.getItem("token");
  // form input
formLiquorName = document.querySelector("#lname");
formPrice = document.querySelector("#price");
formCategory = document.querySelector("#category");
formImage = document.querySelector("#image");
  cleanError();
  if (!formLiquorName.value || !formPrice.value || !formCategory.value || !formImage.value) {
    document.querySelector(
      "#error"
    ).innerHTML = "All Fields Required";
    return;
  }
  here.value = "LOADING...";
  here.disabled = true;
  const data = {
    liquor_name: formLiquorName.value,
    price: formPrice.value,
    category: formCategory.value,
    about: formLiquorName.value,
    image_url: formImage.value
  };
  fetch("/api/v1/kavata/", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "Application/JSON",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      response.json().then(async results => {
        if (results.data) {
          document.querySelector('#error').style.color = '#10ac84';
          document.querySelector(
            "#error"
          ).innerHTML = results.message;
          formLiquorName.value = '';
          formPrice.value = '';
          formCategory.value = '';
          formImage.value = '';
          here.value = "ADD";
          here.disabled = false;
          return;
        }
        if (results.error) {
          here.value = "ADD";
          here.disabled = false;
          document.querySelector(
            "#error"
          ).innerHTML = results.error;
          return;
        }
      });
    })
    .catch(err => {
      document.querySelector(
        "#error"
      ).innerHTML = "Sorry, something went wrong!";
      here.value = "ADD";
      here.disabled = false;
      return;
    });
};
// filter
// Table filter
const beersFilter = () => {
  let input, filter, table, tr, td, cell;
  input = document.querySelector("#b_search");
  filter = input.value.toUpperCase();
  table = document.querySelector("#all_beers_list");
  tr = table.getElementsByTagName("tr");
  for (let i = 1; i < tr.length; i++) {
      // Hide the row initially.
      tr[i].style.display = "none";

      td = tr[i].getElementsByTagName("td");
      for (let j = 0; j < td.length; j++) {
          cell = tr[i].getElementsByTagName("td")[j];
          if (cell) {
              if (cell.innerHTML.toUpperCase().indexOf(filter) > -1) {
                  tr[i].style.display = "";
                  break;
              }
          }
      }
  }
}
const homeFilter = (e)=> {
  var input = document.querySelector("#hb_search");
  filter = input.value.toUpperCase();
  var list = document.querySelector("#liquor-card");
  var divs = list.querySelector("#liquor");
  for (var i = 0; i < divs.length; i++) {
    var a = divs[i].querySelector("#single-liquor")[0];
    if (a) {
      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
        divs[i].style.display = "";
      } else {
        divs[i].style.display = "none";
      }
    }
  }

}
// delete Beer
const deleteBeer=async(id)=>{
  const token = await localStorage.getItem("token");
  fetch(`/api/v1/kavata/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "Application/JSON",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      response.json().then(async results => {
        alert("Deleted");
        return window.location = await "/dashboard";
}).catch(err => {
  alert("Sorry, Failed to delete!");
  return;
});
})
}
// update beer
const updateBeer = async (here,id) => {
  const token = await localStorage.getItem("token");
  cleanError();
  // form input
formLiquorName = document.querySelector("#ulname");
formPrice = document.querySelector("#uprice");
formCategory = document.querySelector("#ucategory");
formButton = document.querySelector("#uformBtn");
formImage = document.querySelector("#uimage");
  if (!formLiquorName.value || !formPrice.value || !formCategory.value || !formImage.value) {
    document.querySelector(
      "#error"
    ).innerHTML = "All Fields Required";
    return;
  }
  here.value = "UPDATING...";
  here.disabled = true;
  const data = {
    liquor_name: formLiquorName.value,
    price: formPrice.value,
    category: formCategory.value,
    about: formLiquorName.value,
    image_url: formImage.value
  };
  fetch(`/api/v1/kavata/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "Application/JSON",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      response.json().then(async results => {
        if (results.data) {
          document.querySelector('#error').style.color = '#10ac84';
          document.querySelector(
            "#error"
          ).innerHTML = results.message;
          formLiquorName.value = '';
          formPrice.value = '';
          formCategory.value = '';
          formImage.value = '';
          here.value = "UPDATE";
          here.disabled = false;
          return window.location = await "/dashboard";
        }
        if (results.error) {
          here.value = "UPDATE";
          here.disabled = false;
          document.querySelector(
            "#error"
          ).innerHTML = results.error;
          return;
        }
      });
    })
    .catch(err => {
      document.querySelector(
        "#error"
      ).innerHTML = "Sorry, something went wrong!";
      here.value = "UPDATE";
      here.disabled = false;
      return;
    });
};
const placeOrder = async (here) => {
  var userMail = document.getElementById('email').value
  var userName = document.getElementById('names').value
  var location = document.getElementById('location').value
  var phone = document.getElementById('phone').value
  var beer = document.querySelector('#order-beer').innerHTML
  if (!userMail || !location || !phone || !beer) {
    here.parentElement.parentElement.querySelector(
      "#error"
    ).innerHTML = `All fields required!`
    return
  } else if (!emailExp.test(userMail)) {
    here.parentElement.parentElement.querySelector(
      "#error"
    ).innerHTML = `Bad Email format!`
    return
  }
  here.value = "SENDING...";
  here.disabled = true;
  var body = {
    "personalizations": [
      {
        "to": [
          {
            "email": "order@kavata.rw"
          }
        ],
        "subject": `Order ${beer}`
      }
    ],
    "from": {
      "name": userName,
      "email": userMail
    },
    "content": [
      {
        "type": "text/html",
        "value": `<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>
          <html xmlns='http://www.w3.org/1999/xhtml' style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;'>
          
          <head style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;'>
              <meta http-equiv='Content-Type' content='text/html; charset=utf-8'
                  style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;'>
              <meta name='viewport' content='width=device-width' style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;'>
              <style>
                  @import url('https://fonts.googleapis.com/css?family=Saira&display=swap');
          
                  * {
                      margin: 0;
                      padding: 0;
                      font-size: 100%;
                      font-family: 'Saira', sans-serif;
                      line-height: 1.65;
                  }
          
                  img {
                      max-width: 100%;
                      margin: auto;
                      display: block;
                  }
          
                  body {
                      width: 100% !important;
                      height: 100%;
                      background: #fff;
                      border-bottom: 2px solid #e67e22;
                  }
          
                  .body-wrap {
                      width: 100% !important;
                      height: 100%;
                      background: #fff;
                      
                  }
          
                  a {
                      color: #e67e22;
                      text-decoration: none;
                  }
          
                  a:hover {
                      text-decoration: underline;
                  }
          
                  .text-center {
                      text-align: center;
                  }
          
                  .text-right {
                      text-align: right;
                  }
          
                  .text-left {
                      text-align: left;
                  }
          
                  .button {
                      display: inline-block;
                      color: white;
                      background: #e67e22;
                      border: solid #e67e22;
                      border-width: 10px 20px 8px;
                      font-weight: bold;
                      border-radius: 4px;
                  }
          
                  .button:hover {
                      text-decoration: none;
                  }
          
                  h1,
                  h2,
                  h3,
                  h4,
                  h5,
                  h6 {
                      margin-bottom: 20px;
                      line-height: 1.25;
                  }
          
                  h1 {
                      font-size: 32px;
                  }
          
                  h2 {
                      font-size: 28px;
                  }
          
                  h3 {
                      font-size: 24px;
                  }
          
                  h4 {
                      font-size: 20px;
                  }
          
                  h5 {
                      font-size: 16px;
                  }
          
                  p,
                  ul,
                  ol {
                      font-size: 16px;
                      font-weight: normal;
                      margin-bottom: 20px;
                  }
          
                  .container {
                      display: block !important;
                      clear: both !important;
                      margin: 0 auto !important;
                      max-width: 580px !important;
                  }
          
                  .container table {
                      width: 100% !important;
                      border-collapse: collapse;
                  }
          
                  .container .masthead {
                      padding: 80px 0;
                      background: #e67e22;
                      color: #e67e22;
                  }
          
                  .container .masthead h1 {
                      margin: 0 auto !important;
                      max-width: 90%;
                      text-transform: uppercase;
                  }
          
                  .container .content {
                      background: white;
                      padding: 30px 35px;
                  }
          
                  .container .content.footer {
                      background: none;
                      
                  }
          
                  .container .content.footer p {
                      margin-bottom: 0;
                      color: #000;
                      text-align: center;
                      font-size: 14px;
                  }
          
                  .container .content.footer a {
                      color: #e67e22;
                      text-decoration: none;
                      font-weight: bold;
                  }
          
                  .container .content.footer a:hover {
                      text-decoration: underline;
          
                  }
              </style>
          </head>
          
          <body>
              <table class='body-wrap'>
                  <tr align='center' style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;'>
                      <td class='container'
                          style='margin: 0 2px !important;padding: 0;font-size: 100%;line-height: 1.65;display: block !important;clear: both !important;max-width: 580px !important;'>
          
                          <!-- Message start -->
                          <table
                              style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;border-collapse: collapse;width: 100% !important;'>
                              <tr style='margin: 0;padding: 0;'>
                                  <td style='margin: 0;padding:10% 5%;background: #e67e22;color: white;'>
                                      <h2>${userName}'s Order</h2>
                                  </td>
                              </tr>
                              <tr style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;'>
                                  <td class='content'
                                      style='margin: 0;padding: 30px 35px;font-size: 100%;line-height: 1.65;background: #f1f1f1;'>
          
                                      <h2 style='margin: 0;padding: 0;font-size: 28px;line-height: 1.25;margin-bottom: 20px;'>Dear
                                          Kavata
                                          Store,</h2>
                                      <p
                                          style='margin: 0;padding: 0;font-size: 16px;line-height: 1.65;font-weight: normal;margin-bottom: 20px;'>
                                          I am ${userName} from ${location} my phone: ${phone}.</p>
                                      <p
                                          style='margin: 0;padding: 0;font-size: 16px;line-height: 1.65;font-weight: normal;margin-bottom: 20px;'>
                                          I've ordered ${beer} from <a href='http://kavata.rw'
                                              style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;color: #e67e22;text-decoration: none;'>Rwanda's
                                              Best Online Liquor Store | KAVATA</a>.</p>
          
                                      <p
                                          style='margin: 0;padding: 0;font-size: 16px;line-height: 1.65;font-weight: normal;margin-bottom: 20px;'>
                                          <em style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;'>Regards,<br /><strong>${userName}
                                              </strong></em></p>
          
                                  </td>
                              </tr>
                          </table>
          
                      </td>
                  </tr>
                  <tr style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;'>
                      <td class='container'
                          style='margin: 0 auto !important;padding: 0;font-size: 100%;line-height: 1.65;display: block !important;clear: both !important;max-width: 580px !important;'>
          
                          <!-- Message start -->
                          <table
                              style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;border-collapse: collapse;width: 100% !important;background:#E2CFCF'>
                              <tr style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;'>
                                  <td class='content footer' align='center'
                                      style='margin: 0;padding: 30px 35px;font-size: 100%;line-height: 1.65;background: none;'>
                                      <p
                                          style='margin: 0;padding: 0;font-size: 14px;line-height: 1.65;font-weight: normal;margin-bottom: 0;color: #000;text-align: center;'>
                                          Proudly powered by <a href='http://kavata.rw'
                                              style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;color: #333;text-decoration: none;font-weight: bold;'>KAVATA
                                              Online Store</a></p>
                                      <p
                                          style='margin: 0;padding: 0;font-size: 14px;line-height: 1.65;font-weight: normal;margin-bottom: 0;color: #000;text-align: center;'>
                                          <a href='mailto:'
                                              style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;color: #333;text-decoration: none;font-weight: bold;'>order@kavata.rw</a>
                                          | <a href='http://kavata.rw'
                                              style='margin: 0;padding: 0;font-size: 100%;line-height: 1.65;color: #333;text-decoration: none;font-weight: bold;'>Order
                                              from Customer</a></p>
                                  </td>
                              </tr>
                          </table>
          
                      </td>
                  </tr>
              </table>
          </body>
          
          </html>`
      }]
  }
  var headers = new Headers();
  var proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = 'https://api.sendgrid.com/v3/mail/send';
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Authorization', `Bearer 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`);
  headers.append('Origin', 'https://api.sendgrid.com/v3/mail/send');

  fetch(proxyurl + url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  }).then(async (response) => {
    here.value = "SENT";
    here.disabled = true;
    return (window.location = await "/");
  }).catch(err => {
    here.parentElement.parentElement.querySelector(
      "#error"
    ).innerHTML = `Sorry, Something went wrong!`
    here.value = "SEND AGAIN";
    here.disabled = false;
  });
}
const getUser = async () => {
  items_list.style.display = 'block';
  const fullnames = JSON.parse(localStorage.getItem('user'))
  document.querySelector('#myname').innerHTML = fullnames;
  let API = `/api/v1/kavata`
  fetch(API, {
    method: "GET",
    headers: {
      "Content-Type": "Application/JSON"
    }
  })
    .then(response => {
      response.json().then(results => {
        const { data } = results
        all_beers_list.querySelector("#loading").style.display = 'none'
        var i = 1
        data.forEach(res => {
          if (res.id) {
            all_beers_list.innerHTML += `<tr>
            <td>${i}</td>
            <td>${res.liquor_name}
            <div class="action">
            <span class="icon-edit" onclick="editBeer(${res.id})">
                <img src="images/icons/edit.svg" alt="*" srcset="" title="Update ${res.liquor_name}"
                    class="lg-icon">
            </span>
            <span class="icon-delete" onclick="deleteBeer(${res.id})">
                <img src="images/icons/delete.svg" alt="*" srcset="" title="Delete ${res.liquor_name}"
                    class="lg-icon">
            </span>
        </div>
            </td>
            <td>${res.category}</td>
            <td>${res.type}</td>
            <td>${res.price} RWF </td>
        </tr>`
          }
          i = i + 1;
        })
      });
    })
    .catch(err => {
      alert("Sorry, something went wrong!");
      return;
    });
}
const userLogin = async () => {
  const user = await localStorage.getItem('token');
  if (!user) {
    return (window.location = await "/login");
  } else {
    window.location = await "/dashboard";
  }
}
const newBeer = () => {
  items_list.style.display = 'none';
  new_item.style.display = 'block';
  new_item.innerHTML=`<div class="col-md-12">
  <h4>ADD NEW BEER</h4>
  <label style='color: red' id='error'></label>
<input type="text" id='lname' placeholder="Beer name " required="">
</div>
<div class="col-md-6">
  <select id="category">
     <option value="">--Select category--</option>
      <option value="1">Whisky</option>
      <option value="2">Cognac</option>
      <option value="3">Vodka</option>
      <option value="4">Gin</option>
      <option value="5">Rum</option>
      <option value="6">Cream&Coffe</option>
      <option value="7">Tequila</option>
      <option value="8">Aperif liquor</option>
      <option value="9">Red wine</option>
      <option value="10">White Wine</option>
      <option value="11">Rose Wine</option>
      <option value="12">Sparking Wine</option>
      <option value="13">Sweet and Dessert Wine</option>
      <option value="14">Fanta</option>
      <option value="15">Juice</option>
      <option value="16">Water</option>
      <option value="17">Others</option>
  </select>
<input type="text" id='image' placeholder="image Url" required="">
</div>
<div class="col-md-6">
<input type="tel" id='price' placeholder="price" required="">

<input type="submit" onclick="addNewBeer(this)" id='formBtn' value="ADD">
</div>`
}
const allBeers = async () => {
  new_item.style.display = 'none';
  items_list.style.display = 'block';
  let API = `/api/v1/kavata`
  fetch(API, {
    method: "GET",
    headers: {
      "Content-Type": "Application/JSON"
    }
  })
    .then(response => {
      response.json().then(results => {
        const { data } = results
        all_beers_list.querySelector("#loading").style.display = 'none'
        var i = 1
        all_beers_list.innerHTML=''
        data.forEach(res => {
          if (res.id) {
            all_beers_list.innerHTML += `<tr>
            <td>${i}</td>
            <td>${res.liquor_name}
            <div class="action">
            <span class="icon-edit" onclick="editBeer(${res.id})">
                <img src="images/icons/edit.svg" alt="*" srcset="" title="Update ${res.liquor_name}"
                    class="lg-icon">
            </span>
            <span class="icon-delete" onclick="deleteBeer(${res.id})">
                <img src="images/icons/delete.svg" alt="*" srcset="" title="Delete ${res.liquor_name}"
                    class="lg-icon">
            </span>
        </div>
            </td>
            <td>${res.category}</td>
            <td>${res.type}</td>
            <td>${res.price} RWF </td>
        </tr>`
          }
          i = i + 1;
        })
      });
    })
    .catch(err => {
      alert("Sorry, something went wrong!");
      return;
    });
}
const editBeer = id => {
  items_list.style.display = 'none';
  new_item.style.display = 'block';
  let API = `/api/v1/kavata/liquor/${id}`
  fetch(API, {
    method: "GET",
    headers: {
      "Content-Type": "Application/JSON"
    }
  })
    .then(response => {
      response.json().then(results => {
        const { data } = results
        data.forEach(res => {
          new_item.style.display = 'block';
          new_item.innerHTML=`<div class="col-md-12">
          <h4>Update ${res.liquor_name}</h4>
          <label style='color: red' id='error'></label>
      <input type="text" id='ulname' value='${res.liquor_name}' placeholder="Beer name " required="">
      </div>
      <div class="col-md-6">
          <select id="ucategory">
             <option value="">--Select category--</option>
              <option value="1">Whisky</option>
              <option value="2">Cognac</option>
              <option value="3">Vodka</option>
              <option value="4">Gin</option>
              <option value="5">Rum</option>
              <option value="6">Cream&Coffe</option>
              <option value="7">Tequila</option>
              <option value="8">Aperif liquor</option>
              <option value="9">Red wine</option>
              <option value="10">White Wine</option>
              <option value="11">Rose Wine</option>
              <option value="12">Sparking Wine</option>
              <option value="13">Sweet and Dessert Wine</option>
              <option value="14">Fanta</option>
              <option value="15">Juice</option>
              <option value="16">Water</option>
              <option value="17">Others</option>
          </select>
      <input type="text" id='uimage' value='${res.image_url}' placeholder="image Url" required="">
  </div>
  <div class="col-md-6">
      <input type="tel" id='uprice' placeholder="price" value='${res.price}' required="">

      <input type="submit" onclick="updateBeer(this,${res.id})" id='formBtn' value="UPDATE">
  </div>`
        });
      });
    })
    .catch(err => {
      alert("Sorry, something went wrong!");
      return;
    });
}
const Logout = async () => {
  await localStorage.setItem("token", "");
  return (window.location = await "/");
}
const setBeerID = async (num) => {
  await localStorage.setItem("beerID", num);
  return (window.location = await "/beers");
}
const findBeer = async () => {
  const num = await localStorage.getItem("beerID");
  all_liquors.innerHTML = '';
  beer_title.innerHTML = `<h3>LOADING...</h3>`;
  let API = `/api/v1/kavata`
  if (num > 0) {
    API = `/api/v1/kavata/beers/${num}`
  }
  fetch(API, {
    method: "GET",
    headers: {
      "Content-Type": "Application/JSON"
    }
  })
    .then(response => {
      response.json().then(results => {
        const { data } = results
        if (!data) {
          beer_title.innerHTML = `<h3>Nothing Found!</h3>`;
        }
        data.forEach(res => {
          if (res.liquor_name) {
            beer_title.innerHTML = num > 0 ? `<h3>${res.type}-${res.category}</h3>` : `<h3>Featured Products</h3>`
            all_liquors.innerHTML += `<div class="col-md-3">
            <div class="my-2 mx-auto p-relative bg-white shadow-1 blue-hover beer-card">
            ${res.liquor_name ? `<img src="${res.image_url}"   
              class="img-responsive zoom-img"
              alt="${res.liquor_name}" />` : ``}
  
    <div class="px-1 py-1">
      <p class="mb-0 font-weight-medium text-uppercase mb-1 text-muted lts-2px">
      ${res.category}
      </p>
  
      <h1 class="ff-serif font-weight-normal text-black card-heading mt-0 mb-0" style="line-height: 1.25;">
      ${res.liquor_name.length > 22 ? `${res.liquor_name.slice(0, 20)}...` : res.liquor_name}
      </h1>
  
      <p class="mb-1">
      ${res.price} RWF </p>
  
    </div>
  
    <a onclick='setOrderID(${res.id})' class="text-uppercase d-inline-block hvr-rectangle-in font-weight-medium lts-2px ml-1 mb-0 text-center styled-link">
      Order Now
    </a>
  </div> </div>`
          }
        })
        all_liquors.innerHTML += `<div class="clearfix"> </div>`
      });
    })
    .catch(err => {
      alert("Sorry, something went wrong!");
      return;
    });
}
const setOrderID = async (num) => {
  await localStorage.setItem("beerID", num);
  if (num) {
    return (window.location = await "/order");
  }
}
const startOrder = async () => {
  const num = await localStorage.getItem("beerID");
  let API = `/api/v1/kavata/liquor/${num}`
  fetch(API, {
    method: "GET",
    headers: {
      "Content-Type": "Application/JSON"
    }
  })
    .then(response => {
      response.json().then(results => {
        const { data } = results
        beer_info.innerHTML = ``
        data.forEach(res => {
          beer_info.innerHTML = `<div class="beer-info-text">
						<div class="beer-img">
							<img src="${res.image_url}" alt="${res.liquor_name}" />
						</div>
						<h5 id='order-beer'>${res.liquor_name}</h5>
					</div>`
          OtherBeers(res.catid, res.id)
        })
      })
    })
}
const OtherBeers = async (category, current) => {
  other_beer.innerHTML = `<h4>LOADING...</h4>`
  let API = `/api/v1/kavata/beers/${category}`
  fetch(API, {
    method: "GET",
    headers: {
      "Content-Type": "Application/JSON"
    }
  })
    .then(response => {
      response.json().then(results => {
        other_beer.innerHTML = ``
        const { data } = results
        var i = 0
        data.forEach(res => {
          if (data.length > 1 && i == 0) {
            other_beer.innerHTML = `<h4>Other ${res.category}(S)</h4>`
          }
          i = i + 1;
          if (i <= 4 && res.id != current) {
            other_beer.innerHTML += `<div class="col-md-3">
						<div class="my-2 mx-auto p-relative bg-white shadow-1 blue-hover beer-card">
          ${res.image_url ? `<img src="${res.image_url}"   
            class="img-responsive zoom-img"
            alt="${res.liquor_name}" />` : ``}

  <div class="px-1 py-1">
    <p class="mb-0 font-weight-medium text-uppercase mb-1 text-muted lts-2px">
    ${res.category}
    </p>

    <h1 class="ff-serif font-weight-normal text-black card-heading mt-0 mb-0" style="line-height: 1.25;">
    ${res.liquor_name.length > 22 ? `${res.liquor_name.slice(0, 20)}...` : res.liquor_name}
    </h1>

    <p class="mb-0">
    ${res.price} RWF </p>

  </div>

  <a onclick='setOrderID(${res.id})' class="text-uppercase d-inline-block hvr-rectangle-in font-weight-medium lts-2px ml-1 mb-0 text-center styled-link">
    Order Now
  </a>
</div>
					</div>
					`
          }
        })
        other_beer.innerHTML += `<div class="clearfix"> </div>`
      })
    })
}
const Loggin = async (here) => {
  cleanError();
  const userMail = here.parentElement.querySelector("#login-email").value
  const password = here.parentElement.querySelector("#login-password").value
  if (!userMail || !password) {
    here.parentElement.querySelector(
      "#error"
    ).innerHTML = `All fields Required!`
    return
  } else if (!emailExp.test(userMail)) {
    here.parentElement.querySelector(
      "#error"
    ).innerHTML = `Bad Email format!`
    return
  }
  const data = {
    email: userMail,
    password
  }
  here.value = "LOADING...";
  here.disabled = true;
  fetch("/api/v1/auth/signin/", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(data)
  }).then(response => {
    response.json().then(async results => {
      if (results.error) {
        here.value = "LOGIN";
        here.disabled = false;
        here.parentElement.querySelector(
          "#error"
        ).innerHTML = results.error;
        return;
      }
      const { id, token, email, first_name, last_name, isadmin } = results.data;
      if (id && email) {
        await localStorage.setItem("token", token);
        await localStorage.setItem(
          "user",
          JSON.stringify(first_name + " " + last_name)
        );
        await localStorage.setItem(
          "email",
          JSON.stringify(email)
        );
        await localStorage.setItem("isAdmin", isadmin);
        return (window.location = await "/dashboard");
      }

    });
  })
    .catch(err => {
      here.value = "LOGIN";
      here.disabled = false;
      here.parentElement.querySelector(
        "#error"
      ).innerHTML = `Sorry, Something wrong!`
      return;
    });
}
const checkMatch = (pwd, pwdConfirm) => {
  return pwd === pwdConfirm;
};

const cleanError = () => {
  document.querySelector(
    "#error"
  ).innerHTML = ``;
};