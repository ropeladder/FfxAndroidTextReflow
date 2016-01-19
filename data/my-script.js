"use strict";

// arguments passed:
//     margin: prefs.margin,
//     wholeColumn: prefs.wholeColumn,
//     debugc: prefs.debugc,  debug to console
//     debugd: prefs.debugd,  debug using dump



// main entry point
function reflowWrapper(){

  var sideMargin = self.options.margin;  //cssPixels margins
  var wholeColumn = self.options.wholeColumn;
  var debugc=self.options.debugc;
  var debugd=self.options.debugd;
  var dclick=self.options.dclick;
  var rdclch=self.options.rdclch;
  var rcldef=self.options.rcldef;

  function mdump(arg){
    if (debugd) dump(arg);
    if (debugc) console.log(arg);
  }

  function mdumpln(arg){
    mdump(arg+"\n");
  }

  function doReflow(e){
    var win = window;

    // get device width in css pixels
    var winWidth=win.content.innerWidth;
    mdumpln("device width "+winWidth);
		
    // get nearest non-inline parent.
    var target = e.target;
    for(var i=e.target; i!=null; i = i.parentElement) {
      var icss = win.getComputedStyle(i);
      mdumpln(i.tagName + " "+icss['display']);
      target = i;
      if(icss['display']!='inline') break;
    }

    // get width/left values for target tag
    var bbox = target.getBoundingClientRect();
    var bwidth=bbox.width;

    mdumpln("bbox width:"+ bwidth+ " win width:"+ winWidth);

    // go parent ellt chain as far as possible - assuming every 
    // parent with same width belongs to same column
    if ( wholeColumn ) {
      for(var i=target; i!=null; i = i.parentElement ) {
	mdumpln("parent : "+i.tagName+" bbox width: "+i.getBoundingClientRect().width);
	if (i.getBoundingClientRect().width != bwidth) break;
	target=i;
      }
    }

    for (var i=target; i!=null; i=i.next) {
      if (bwidth != i.getBoundingClientRect().width) break;
      if (bwidth>winWidth) {
	var newWidth = winWidth - (2*sideMargin);
	mdumpln("resizing to "+newWidth);
	i.style.width = newWidth + "px";
	//win.document.documentElement.scrollLeft += bbox.left - sideMargin;
      } else 
	i.style.width = "";
      if (!wholeColumn) break;
    }
    if ((rdclch && e.type == "dblclick") ||
	(rcldef && e.type == "click") )
      e.preventDefault();
  } 

  window.addEventListener("click", doReflow);
  if (dclick)   
    window.addEventListener("dblclick", doReflow);
  mdumpln("done startup");
}

reflowWrapper();

