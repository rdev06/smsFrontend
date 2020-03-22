const umsApi = 'https://ums.mafset.com';
const userRoute = '/api/user/';
const umsApiKey = 'roshanKey';
let userData = {};

const smsApi = 'https://sms.mafset.com';
const smsUserRoute = '/api/user/';
const smsHeaders = {
  authorization: `Bearer ${localStorage.getItem('token')}`
};

function loginUser(d) {
  localStorage.setItem('token', d.token);
  localStorage.setItem('name', d.user.name);
  userData = d.user;
  $.mobile.navigate('#page3');
}

$('#registerForm').submit(function(e) {
  e.preventDefault();
  let data = {};
  $(this)
    .serializeArray()
    .forEach(e => {
      data[e.name] = e.value;
    });
  if (data.password == data.rpassword) {
    fetch(umsApi + userRoute + 'register', {
      method: 'POST',
      headers: {
        apikey: umsApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(d => {
        if (d.msg == 'logged in') {
          loginUser(d);
        } else {
          alert('Some Error Persist Please try again after some time ....');
        }
      })
      .catch(err => console.log(err));
  } else {
    alert('password did not match');
  }
});

function checkUser(data) {
  fetch(umsApi + userRoute + 'checkUsername?username=' + data.value, {
    method: 'GET',
    headers: {
      apikey: umsApiKey
    }
  })
    .then(res => res.json())
    .then(d => {
      if (d.result) {
        $('#checkUser').text(d.msg);
        $('#registerBtn').removeAttr('disabled');
      } else {
        $('#checkUser').text('NOT' + d.msg);
      }
    })
    .catch(err => console.log(err));
}

$('#loginForm').submit(function(e) {
  e.preventDefault();
  let data = {};
  $(this)
    .serializeArray()
    .forEach(e => {
      data[e.name] = e.value;
    });
  fetch(umsApi + userRoute + 'login', {
    method: 'POST',
    headers: {
      apikey: umsApiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(d => {
      if (d.msg == 'logged in') {
        loginUser(d);
      } else {
        alert(d.msg);
      }
    })
    .catch(err => console.log(err));
});

function fillSmsData(data) {
  $(`#smsApi .smsToken`).text(data.smsToken);
  $(`#smsApi .emailToken`).text(data.emailToken);
  $(`#smsApi .nS`).text(data.nS);
  $(`#smsApi .nE`).text(data.nE);
  $(`#smsApi .createdAt`).text(data.createdAt);
  $(`#smsApi .updatedAt`).text(data.updatedAt);
  $('#smsApi').show();
}

$(document).on('pagebeforeshow', '#page3', function() {
  $('#enrollSms').hide();
  $('#smsApi').hide();
  if (localStorage.getItem('token')) {
    $('#page3 #name').text(localStorage.getItem('name'));
    fetch(smsApi + smsUserRoute, {
      method: 'GET',
      headers: smsHeaders
    })
      .then(res => res.json())
      .then(d => {
        if (d) {
          fillSmsData(d);
        } else {
          $('#enrollSms').show();
        }
      })
      .catch(err => console.log(err));
  } else {
    $.mobile.navigate('#page1');
  }
});

function enrollSms() {
  fetch(smsApi + smsUserRoute + 'adduser', {
    method: 'POST',
    headers: smsHeaders
  })
    .then(res => res.json(res))
    .then(d => {
      console.log(d);
      $('#enrollSms').hide();
      fillSmsData(d);
    })
    .catch(err => console.log(err));
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  $.mobile.navigate('#page1');
}

$(document).ready(() => {
  if (localStorage.getItem('token')) {
    $.mobile.navigate('#page3');
  }
});
