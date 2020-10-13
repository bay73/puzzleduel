function restoreAccordionPanel(storageKey, accordionId) {
  var activeItem = localStorage.getItem(storageKey);
  if (activeItem) {
    //remove default collapse settings
    $(accordionId + " .collapse").removeClass('show');
    //show the account_last visible group
    $("#" + activeItem).addClass("show");
  }
}

function saveActiveAccordionPanel(storageKey, e) {
  localStorage.setItem(storageKey, e.target.id);
}

