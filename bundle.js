(function () {
    'use strict';

    const format = d3.format(",d");
    const width = 1200;
    const radius = width / 6;

    const arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
            .padRadius(radius * 1.5)
            .innerRadius(d => d.y0 * radius)
            .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));
    
    const partition = data => {
        const root = d3.hierarchy(data)
                .sum(d => d.size)
                .sort((a, b) => b.value - a.value);
        return d3.partition()
                .size([2 * Math.PI, root.height + 1])
                (root);
    };


  

    //const {require} = new observablehq.Library;

    //require()('@observablehq/flare').then(data => {
        d3.json("dataUTZ5.json").then(data => {
        console.log(data);
        const root = partition(data);
        const color = d3.scaleOrdinal().range(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
        //console.log(data.children.length);
        console.log("_____________");

        root.each(d => d.current = d);

        const svg = d3.select('#partitionSVG')
                .style("width", "100%")
                .style("height", "auto")
                .style("font", "10px sans-serif");

        const g = svg.append("g")
                .attr("transform", `translate(${width/1.8},${width/2})`)
                .on("mouseleave",mouseleave)
                .on("keypress", function() {
                    if(d3.event.keyCode === 32 || d3.event.keyCode === 13){
                    console.log("Congrats, you pressed enter or space!")
                    }});

        const path = g.append("g")
                .selectAll("path")
                .data(root.descendants().slice(1))
                .join("path")
               // .attr("fill", d => {
                 //   while (d.depth > 1)
                   //     { d = d.parent; }
                    //return color(d.data.name);
               // })

                .style("fill", function(d) {
                 if (d.depth<2 && d.data.team[0].length < 2) {
                  console.log(d.data.team[0].length);
                  console.log(d.data);
                       return d.children[0].data.color;}
                if (d.depth <2 && d.data.team[0].length > 1) {
                 return "#797d7f" 
                }   
                  //console.log(d.depth) 
                  return d.data.color;
                })

                //.style("fill", function(d) {
                  //return color((d.children ? d : d.parent).name);
                //})

                .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
                .attr("d", d => arc(d.current))
                .on("mouseover",mouseover);


        path.on("mouseout", function () {                    
            GetId("key_line").style.visibility="hidden"; 
           ;    })
           // .on("mouseover",info)
         //  ;          
        

        path.filter(d => d.children)
                .style("cursor", mouse)
                .on("click", clicked)                              
              
                ;

                
        path.append("title")
                .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

        const label = g.append("g")
                .attr("pointer-events", "none")
                .attr("text-anchor", "middle")
                .style("user-select", "none")
                .selectAll("text")
                .data(root.descendants().slice(1))
                .join("text")
                .attr("dx","6")
                .attr("dy", ".35em")
               //.attr("visibility",function(d) { return d.dx > 0.00? "hidden":"visible"})
              //.attr("visibility", "visible")

                .attr("fill-opacity", d => +labelVisible(d.current))
                .attr("transform", d => labelTransform(d.current))
                .text(d => d.data.name.slice(0, 20)); //Selction des 20 premiers mots


        const percentage_text=g.append("text")
        .attr("id","title")
        .attr("x", (width/width))             
            .attr("y", (width)/width)
            .attr("text-anchor", "middle")  
            .style("font-size", "2.5em")
            .attr("pointer-events", "none")
            .style("user-select", "none");
            
        
        percentage_text.text("SUB PROCESS");
      

      

        
        const parent = g.append("circle")
                .datum(root)
                .style("cursor", "pointer")
                .attr("r", radius)
                .attr("fill", "none")
                .attr("pointer-events", "all")               
                .on("click", clicked);
              

              
           
      ///  
        
        //d3.select("button").on("click", function() {
      //      d3.selectAll("path").style("opacity", 0.3);   
    //        GetId("test").style.visibility="visible"; 
  //          GetId("test").innerHTML = document.getElementById("searchid").value;    
//        });


     //   d3.select("button").on("click", function() {
       //     d3.selectAll("path").each(function (d,i) {
             //   d3.select(d).style("opacity", 1);
               // if (d3.select(d).data.name == document.getElementById("searchid").value) {
                 //   d3.select(d).style("opacity", 1);
                    
               // } else {
                  //  d3.select(d).style("opacity", 0.1);
               // }
        //    })
        
      //  });

 
     // d3.select("#nRadius").on("input", function() {
       // update(+this.value);
      
        
      d3.select("#searchid").on("keypress", function() {
        if(d3.event.keyCode === 13){
            search();
       // console.log("Congrats, you pressed enter or space!")
        }});    
      d3.select("button").on("click", search)
      
      
    var arr=array();
    console.log(arr);
    
    function array() {
          var arr=[]
        d3.selectAll('path').each(function(d,i) { 
            if (d.depth<3) {
             // console.log(d.data.name);
              //console.log(d.depht);
                arr.push(d.data.name);}
                })    
        return arr;
    }


      
      function search() {
        d3.selectAll('path').each(function(d,i) { 
            if (d.data.name == document.getElementById("searchid").value && d.depth<3) {

                if (this.getAttribute("fill-opacity") !=0 ) {    
                    GetId("key_line").style.visibility="visible"; 
                    GetId("key_line").innerHTML = generateInfo(d);             
            }
            //document.getElementById("searchid").value
           
               //// d3.select(this).style("opacity", 1);
                
                var sequenceArray = d.ancestors().reverse();
                sequenceArray.shift();
                d3.selectAll("path")
                .filter(function(node) {
                        return (sequenceArray.indexOf(node) >= 0);
                      })
        .style("opacity", 1);
               

            // GetId("test").style.visibility="visible"; 
                //GetId("test").innerHTML = document.getElementById("searchid").value;    
                console.log(document.getElementById("searchid").value);
                console.log(i); 
                console.log(d.data.name);
                console.log(d.depth); 
            
                console.log(d.parent.data.name); 
              //  stop();
                //var padre=d.parent.data.name
                //while (padre!=undefined){
                  //  d3.selectAll('path').each(function(d,i) { 
                    ///        if (d.data.name == padre) {
                       //             d3.select(this).style("opacity", 1);
                         //           padre=d.parent.data.name ;}
                            
                  //}  )                                        }                       
               //
             } 
                
                else {
                    d3.select(this).style("opacity", 0.1);
                }


        
            
        });
      }


        //parent.append("div")
     //   .attr('id', "key_line")
               
    //    ;

        function mouse (p){
            var mouse =""
            if (this.getAttribute("fill-opacity") !=0 ) {
                mouse ="pointer"; }

            
              return  mouse ; }


//mouse over

function mouseover(d){
 
    if (this.getAttribute("fill-opacity") !=0 ) {    
        GetId("key_line").style.visibility="visible"; 
        GetId("key_line").innerHTML = generateInfo(d);             

  var sequenceArray = d.ancestors().reverse();
  sequenceArray.shift(); // remove root node from the array
  // Fade all the segments.
  d3.selectAll("path")
      .style("opacity", 0.3);

  // Then highlight only those that are an ancestor of the current segment.
  g.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1);
}

}
 //mouse leave
  // Restore everything to full opacity when moving off the visualization.
  function mouseleave(d) {

    // Deactivate all segments during transition.
    //d3.selectAll("path").on("mouseover", null);

    // Transition each segment to full opacity and then reactivate it.
    d3.selectAll("path")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .on("end", function() {
                d3.select(this).on("mouseover", mouseover);
              });

   // percentage_text.text("");
  }





    function GetId(id)
    {
    return document.getElementById(id);
    }

    function info(d){
        console.log(this.getAttribute("fill-opacity")); // voir si l'element est visible ou pas 
        console.log(this);
        console.log(d);
        if (this.getAttribute("fill-opacity") !=0 ) {    
            GetId("key_line").style.visibility="visible"; 
            GetId("key_line").innerHTML = generateInfo(d);             
    }

    }
    function generateInfo(d){
       
        if (d.parent.data.name!="SUBPROCESS" ){
            var info = '<b> Task: </b> '+ d.data.name + ' <br /><b>Team : </b> '+ d.data.team + '  <br /><b>Output :</b>'+ d.data.output + '<br /> </b><b> Sub-Process :</b> '+ d.parent.data.name  ;
        }

        else{
            var info = '<b> Sub-Process : </b> '+ d.data.name + ' <br /><b> Team : </b> '+ d.data.team;
        }
   
   // console.log(this);
        // .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
   // console.log(d);
    return info;    
//}
    }

    function move(e) {
     //   if(i) {  // Si la bulle est visible, on calcul en temps reel sa position ideale
          if (navigator.appName!="Microsoft Internet Explorer") { // Si on est pas sous IE
          GetId("key_line").style.left=e.pageX + 5+"px";
          GetId("key_line").style.top=e.pageY + 10+"px";
          }
        //  else { // Modif proposé par TeDeum, merci à  lui
          if(document.documentElement.clientWidth>0) {
      GetId("key_line").style.left=20+event.x+document.documentElement.scrollLeft+"px";
      GetId("key_line").style.top=10+event.y+document.documentElement.scrollTop+"px";
          } else {
      GetId("key_line").style.left=20+event.x+document.body.scrollLeft+"px";
      GetId("key_line").style.top=10+event.y+document.body.scrollTop+"px";
             //  }
        //  }
        }
      }

    //document.onmousemove=move;




        function clicked(p) {
           console.log(this.getAttribute("fill")); // voir si l'element est visible ou pas 
           if (this.getAttribute("fill-opacity") !=0 ) {       
                if (p.data.name!=null && p.data.name!=undefined){
                  
            var name=p.data.name.slice(0, 20)
            percentage_text.text(name);
           // parent.attr("fill", this.getAttribute("fill"));
            parent.style("fill", p.data.color);
            parent.attr("fill-opacity", this.getAttribute("fill-opacity"));
            if (p.data.name=="SUB PROCESS"){
                parent.attr("fill", "none");
            }
        }


            parent.datum(p.parent || root);

            root.each(d => d.target = {
                    x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                    x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                    y0: Math.max(0, d.y0 - p.depth),
                    y1: Math.max(0, d.y1 - p.depth)
                });

            const t = g.transition().duration(750);

            // Transition the data on all arcs, even the ones that aren’t visible,
            // so that if this transition is interrupted, entering arcs will start
            // the next transition from the desired position.
            path.transition(t)
                    .tween("data", d => {
                        const i = d3.interpolate(d.current, d.target);
                        return t => d.current = i(t);
                    })
                    .filter(function (d) {
                        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
                    })
                    .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
                    .attrTween("d", d => () => arc(d.current));

            label.filter(function (d) {
                return +this.getAttribute("fill-opacity") || labelVisible(d.target);
            }).transition(t)
                    .attr("fill-opacity", d => +labelVisible(d.target))
                    .attrTween("transform", d => () => labelTransform(d.current));

                }
        }

        function arcVisible(d) {
            return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
        }

        function labelVisible(d) {
            return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.01;
        }

        function labelTransform(d) {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2 * radius;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        }



        function autocomplete(inp, arr) {
            /*the autocomplete function takes two arguments,
            the text field element and an array of possible autocompleted values:*/
            var currentFocus;
            /*execute a function when someone writes in the text field:*/
            inp.addEventListener("input", function(e) {
                var a, b, i, val = this.value;
                
                /*close any already open lists of autocompleted values*/
                closeAllLists();
                if (!val) { return false;}
                currentFocus = -1;
                /*create a DIV element that will contain the items (values):*/
                a = document.createElement("DIV");
                a.setAttribute("id", this.id + "autocomplete-list");
                a.setAttribute("class", "autocomplete-items");
                /*append the DIV element as a child of the autocomplete container:*/
                this.parentNode.appendChild(a);
                /*for each item in the array...*/

                
                for (i = 0; (i < arr.length); i++) {
                  /*check if the item starts with the same letters as the text field value:*/
                  if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                  
                    b = document.createElement("DIV");
                    //*make the matching letters bold:*/
           
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                     b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                
                
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                  }
                }
            });
            /*execute a function presses a key on the keyboard:*/
            inp.addEventListener("keydown", function(e) {
                var x = document.getElementById(this.id + "autocomplete-list");
                if (x) x = x.getElementsByTagName("div");
                if (e.keyCode == 40) {
                  /*If the arrow DOWN key is pressed,
                  increase the currentFocus variable:*/
                  currentFocus++;
                  /*and and make the current item more visible:*/
                  addActive(x);
                } else if (e.keyCode == 38) { //up
                  /*If the arrow UP key is pressed,
                  decrease the currentFocus variable:*/
                  currentFocus--;
                  /*and and make the current item more visible:*/
                  addActive(x);
                } else if (e.keyCode == 13) {
                  /*If the ENTER key is pressed, prevent the form from being submitted,*/
                  e.preventDefault();
                  if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                  }
                }
            });
            function addActive(x) {
              /*a function to classify an item as "active":*/
              if (!x) return false;
              /*start by removing the "active" class on all items:*/
              removeActive(x);
              if (currentFocus >= x.length) currentFocus = 0;
              if (currentFocus < 0) currentFocus = (x.length - 1);
              /*add class "autocomplete-active":*/
              x[currentFocus].classList.add("autocomplete-active");
            }
            function removeActive(x) {
              /*a function to remove the "active" class from all autocomplete items:*/
              for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
              }
            }
            function closeAllLists(elmnt) {
              /*close all autocomplete lists in the document,
              except the one passed as an argument:*/
              var x = document.getElementsByClassName("autocomplete-items");
              for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                  x[i].parentNode.removeChild(x[i]);
                }
              }
            }
            /*execute a function when someone clicks in the document:*/
            document.addEventListener("click", function (e) {
                closeAllLists(e.target);
            });
          }
          
          /*An array containing all the country names in the world:*/
          //var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
          
          /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
         autocomplete(document.getElementById("searchid"), arr);
         console.log(document.getElementById("searchid"));























    });

}());

