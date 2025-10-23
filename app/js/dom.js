const DOM = {
  getById: id => document.getElementById(id),
  create: element => document.createElement(element),
  update: {
    text: (id, value) => DOM.getById(id).textContent = value,
    background: (id, color) => DOM.getById(id).style.backgroundColor = color,
    value: (id, value) => DOM.getById(id).value = value
  }
};
