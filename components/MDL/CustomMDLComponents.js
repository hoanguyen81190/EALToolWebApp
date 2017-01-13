import React, { PropTypes } from 'react';

/**
*  Displays a MDL Chip element with the provided props. Takes optional props
*   that can be used to set the classnames of the different parts of the chip for css styling.
*
*  Required props:
*     color: the mdl color to use for the small circle E.G. "mdl-color--green-300"
*     chipText: the content to display inside the small circle
*     chipContent: the content to display next to the small circle.
*     noCircle: if true then no circle will be rendered.
*   Optional props:
*     chipStyling: the css classname for the TreeChip container
*     chipTextStyling: the css classname for the chip text
*     chipContentStyling: the css classname to style the content of the chip
*/
export class TreeChip extends React.Component{

  static defaultProps = {
        chipContent: "Content",
        color: "mdl-color-green-300",
        chipText: "T"
    };

  render(){
    var circle;
    if(this.props.noCircle){
      circle = "";
    }
    else{
      circle = <span className={`mdl-chip__contact ${this.props.chipColor} mdl-color-text--white ${this.props.chipTextStyling}`}>{this.props.chipText}</span>;
    }

    return <span className={`mdl-chip mdl-chip--contact ${this.props.color} ${this.props.chipStyling}`} >
      {circle}
      <span className={`mdl-chip__text ${this.props.chipContentStyling}`}>{this.props.chipContent}</span>
    </span>;
  }
}

/**
*  Displays a MDL Card element with the provided props. Takes optional props
*   that can be used to set the classnames of the different parts of the chip for css styling.
*
*  Required props:
*     color: the mdl color to use for the small circle E.G. "mdl-color--green-300"
*     chipText: the content to display inside the small circle
*     chipContent: the content to display next to the small circle.
*     cardContent: the content to display on the TreeCard.
*     noChip: if true then no chip is rendered in the TreeCard
*   Optional props:
*     chipStyling: the css classname for the TreeChip container
*     chipTextStyling: the css classname for the chip text
*     chipContentStyling: the css classname to style the content of the TreeChip
*     cardContentStyling: the css classname to style the content of the TreeCard
*     treeCardStyling: the css classname to style the entire TreeCard
*     callback: optional callback function for when the tree card is clicked.
*/
export class TreeCard extends React.Component{
  static defaultProps = {
        cardContent: "Content goes here",
        callback: ""
    };

  render(){
    var chip = "";
    if(!this.props.noChip){
      chip = <div className={`mdl-card__title ${this.props.color}`}><TreeChip color={this.props.color} chipText={this.props.chipText} chipContent={this.props.chipContent}
        chipStyling={this.props.chipStyling} chipTextStyling={this.props.chipTextStyling} chipContentStyling={this.props.chipContentStyling} noCircle={this.props.noCircle}
        chipColor={this.props.chipColor}/></div>;
    }

    var content = "";
    if(!this.props.noContent){
      content = <div className={`mdl-card__supporting-text ${this.props.cardContentStyling}`}>
        {this.props.cardContent}
      </div>;
    }

    var treeCard =
    <div className={`mdl-card ${this.props.treeCardStyling}`} onClick={this.props.callback}>
        {chip}
        {content}
   </div>;

    return treeCard;
  }
}
