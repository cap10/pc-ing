
/********* modal common js *********/
// openModal
var modalTrigger = document.querySelectorAll('[data-tw-toggle="modal"]');
var isModalShow = false;
Array.from(modalTrigger).forEach(function (item) {
  item.addEventListener("click", function () {
    var target = this.getAttribute('data-tw-target').substr(1);
    var modalWindow = document.getElementById(target);    

    if (modalWindow.classList.contains("hidden")) {
      modalWindow.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    } else {
      modalWindow.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
    isModalShow = false;

    if (item.getAttribute('data-tw-backdrop') == 'static') {
      isModalShow = true;
    }
  });
});

// closeButton
var closeButton = document.querySelectorAll('[data-tw-dismiss="modal"]');
Array.from(closeButton).forEach(function (subElem) {
  subElem.addEventListener("click", function () {
    
    var modalWindow = subElem.closest(".modal");
    if (modalWindow.classList.contains("hidden")) {
      modalWindow.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    } else {
      modalWindow.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  });
});

// closeModal
var modalElem = document.querySelectorAll('.modal');
Array.from(modalElem).forEach(function (elem) {

  // modalOverlay
  var modalOverlay = elem.querySelectorAll('.modal-overlay');
  Array.from(modalOverlay).forEach(function (subItem) {
    subItem.addEventListener("click", function () {
      if (!isModalShow) {
        if (elem.classList.contains("hidden")) {
          elem.classList.remove('hidden');
          document.body.classList.add('overflow-hidden');
        } else {
          elem.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
        }
      }
    });
  });

  // Escape
  document.addEventListener("keydown", function (event) {
    var key = event.key;
    if (!isModalShow) {
      if (key == "Escape") {
        elem.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }
  });
});