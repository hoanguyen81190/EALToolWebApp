import React from 'react';
import ReactDOM from 'react-dom';
import PDF from 'pdfjs-dist/build/pdf.combined.js';

import s from './styles.css';

export default class SimplePDF extends React.Component {

  constructor(props) {
    super(props);

    // bind
    this.loadPDF = this.loadPDF.bind(this);

  }

  loadPDF() {

    // get node for this react component
    try {

    var node = ReactDOM.findDOMNode(this).getElementsByClassName("S-PDF-ID")[0];
    //var node = ReactDOM.findDOMNode(this).getElementsByClassName("SimplePDF")[0];

    // clean for update
    node.innerHTML = "";

    // set styles
  //  node.style.width = "200%";
  //  node.style.height = "25%";
  //  node.style.overflowX = "hidden";
  //  node.style.overflowY = "scroll";
    node.style.padding = '0px';
    var startPage = this.props.startPage;
    var endPage = this.props.endPage;

    PDF.getDocument(this.props.file).then(function(pdf) {

    for (var id=1,i=startPage; i<=endPage; i++) {
        pdf.getPage(i).then(function(page) {

          // calculate scale according to the box size
          var boxWidth = node.clientWidth;
          var pdfWidth = page.getViewport(1).width;
          var scale = boxWidth / pdfWidth;
          var viewport = page.getViewport(scale);
          // set canvas for page
          var canvas = document.createElement('canvas');
          canvas.id  = "page-"+id; id++;
          canvas.width  = viewport.width;
          canvas.height = viewport.height;
          node.appendChild(canvas);

          // get context and render page
          var context = canvas.getContext('2d');
          var renderContext = {
            canvasContext : context,
            viewport      : viewport
          };
          page.render(renderContext);
        });
      }


    });
  } catch (e) {
    console.log(e);
  } finally {

  }
  }

  updateDimensions() {
    this.loadPDF();
  }

  render() {
    return (
      <div className="SimplePDF" id="documentDiv">
        <div className={`S-PDF-ID ${s.pdfViewer}`} id="pdfViewer"></div>
      </div>
    );
  }

  componentDidMount() {
    this.loadPDF();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentDidUpdate() {
    this.loadPDF();
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }
}

module.exports = { SimplePDF: SimplePDF };
