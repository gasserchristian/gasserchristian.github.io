// icon
const myCustomColour = '#583470'
const icon = L.divIcon({
  className: "custom",
  iconAnchor: [ 10,10 ],
  // iconAnchor: [15, 30],
  labelAnchor: [ -6,0 ],
  popupAnchor: [ 0,-36 ],
  html: `<span></span>`
})
// carte
var carte = L.map('viewer').setView([46.9484, 7.4437], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 30,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
  	'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  	'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1
}).addTo(carte)
// button control
var control = d3.select('.controls')
var body = d3.select('body'), modules = d3.select('.modules')
control.select('.add').on('click',x=>{
  body.classed('add',x=>body.classed('add')?false:true)
  body.classed('delete',false)
  body.classed('edit',false)
})
control.select('.delete').on('click',x=>{
  body.classed('delete',x=>body.classed('delete')?false:true)
  body.classed('add',false)
  body.classed('edit',false)
})
control.select('.edit').on('click',x=>{
  body.classed('edit',x=>body.classed('edit')?false:true)
  body.classed('add',false)
  body.classed('delete',false)
})
control.select('.attach').on('click',x=>{
  body.classed('attached',true)
  d3.csv('./js/coordinates.csv').then(data=>{
    d3.selectAll('.nothing').data(data).enter().each((d,i)=>{
      var a = {
        latlng: {lat: d.latitude,lng:d.longitude},
        comment:d.commentaire
      }
      addMarker(a)
    })
  })
})
control.select('.bookmark').on('click',x=>{
  body.classed('openExport',true)
  d3.select('.export').transition().style('opacity',1)
})
body.select('.export .cross').on('click',function(){
  d3.select('.export').transition().duration(1000)
    .style('opacity',0)
    .on('end',function(){
      body.classed('openExport',false)
    })
})
control.select('i.help').on('click',function(){
  console.log(body.select('img.help'))
  body.select('img.help').style('display','block')
      .on('click',function(){
        d3.select(this).style('display','none')
      })

})
// map event
carte.on('click',function(a){
  if(body.classed('add')) {
    a.comment = 'default'
    addMarker(a)
  }
})
var counter = 1
function addMarker(a) {
  counter++
  let item = document.createElement('div')
  item = d3.select(item).classed('item',true)
  item
    .append('div').classed('number',true).classed('y_centered_absolute',true)
    .append('div').text(counter).classed('centered_absolute',true)
  let description = item
    .append('div').classed('description',true)
    .text(a.comment).classed('y_centered_absolute',true)
  let marker = L.marker(a.latlng,{icon:icon}).addTo(carte)

// L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);


  marker.on('click',function() {
    if(body.classed('delete')) {
      this.remove()
    } else {
      item.remove()
      modules.node().prepend(item.node())
    }
  })
  let line = d3.select('.export .content')
    .append('div')
    .text(a.latlng.lat+', '+a.latlng.lng+', '+a.comment)
  description.attr('contenteditable',true)
  description.on('input',function(){
    var value = d3.select(this).text()
    var t = line.text().split(', ')
    line.text(a.latlng.lat+', '+a.latlng.lng+', '+value+'')
  })
}
