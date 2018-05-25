var getDomNodePath = require('./getDomNodePath');

function getDomNodeProfile(el) {
  return {
    action: el.action,
    class: el.className,
    href: el.href,
    id: el.id,
    method: el.method,
    name: el.name,
    ng_click: el.attributes['ng-click'],
    ng_model: el.attributes['ng-model'],
    node_name: el.nodeName,
    selector: getDomNodePath(el),
    text: el.text,
    textContent: el.textContent ? el.textContent.substring(0, 1000) : null,
    title: el.title,
    type: el.type,
    x_position: el.offsetLeft || el.clientLeft || null,
    y_position: el.offsetTop || el.clientTop || null
  };
}

module.exports = getDomNodeProfile;
