'use strict';

let update = document.getElementById('updateButton');
let form = document.getElementById('updateForm');

update.addEventListener('click', showForm);

form.style.display = 'none';

function showForm () {
  form.style.display = 'block';
}