import store from '../../core/store';
import {eALDocument} from '../../database-loader';

import s from './styles.css';

import history from '../../core/history';

const React = require('react');

class Condition extends React.Component {
  render() {
    if(this.props.object.type === "Leaf") {
      var element =
      <div>
         {(this.props.index + 1) + '. '}
         <div dangerouslySetInnerHTML={{__html: this.props.object.description.text}}/>
      </div>;
      return element;
    }
    else {
      var element =
       <div>
         {
           this.props.object.children.map((ele, index) => {
             if(index != this.props.object.children.length - 1) {
               return <div key={index}>
                 <Condition object = {ele} index = {index}/>
                 {this.props.object.type}
               </div>;
             }
             return <div key={index}>
               <Condition object = {ele} index = {index}/>
             </div>;
           })
         }
      </div>;
      return element;
    }
  }
}

class Criterion extends React.Component {
  constructor() {
    super();
  }

  handleClick(criterion) {
    var action = {
      type : 'SETMODE',
      mode : store.getState().mode,
      category : store.getState().category,
      level : this.props.level,
      object: criterion
    }
    store.dispatch(action);
    history.push("/classifying");
  }

  render() {
    if(typeof(this.props.criterion.conditions) == "undefined" ||
        (Object.keys(this.props.criterion.conditions).length === 0 && this.props.criterion.conditions.constructor === Object)) {
      var condition = <div/>;
    }
    else {
      var condition = <Condition
          object = {this.props.criterion.conditions} index = {0}/>;
    }
    var element =
    <div className={s.box} onClick={() => this.handleClick(this.props.criterion)}>
      {this.props.criterion.name}
      <div>{this.props.criterion.description.text}</div>
      {condition}
    </div>;
    return element;
  }
}

class OverviewTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfRows : 0,
      lowestCriterionConditionNumber : 0,
      highestCriterionConditionNumber : 0
    }
  }

  createRowData(emergencyCat, content)
  {
    return{
      emergencyLevel : emergencyCat,
      content: content,
    }
  }

getRowsData2(tableData){
  var emergencyCatArray = ["General Emergency","Site Area Emergency","Alert","Unusual Event"];
  var conditionNumberArray = [];
  for(var i = this.state.lowestCriterionConditionNumber; i <= this.state.highestCriterionConditionNumber; i++)
  {
    conditionNumberArray.push(i);
  }

  //Add all the rows to this container div
  var rowsData = <div>
    {
      //Loop through the condition numbers
      conditionNumberArray.map((conditionNumber, conditionNumberIndex) => {
        //Add one row for each condition number
        var rowData = <div key={conditionNumberIndex} className={s.testRow}><div className="mdl-grid ">
        {
        //Loop through the emergency categories
        emergencyCatArray.map((emergencyCategory, emergencyCategoryIndex) => {
          var tableDataCell = tableData[conditionNumberIndex + emergencyCatArray.length * emergencyCategoryIndex];

          var cellContent;

          if(tableDataCell.content === "")
          {
            var emptyCell =
            <div key={emergencyCategoryIndex} className="mdl-cell mdl-cell--3-col"><div className={s.gridCell}>

            </div> </div>;

            return(emptyCell);
          }
          else {
            cellContent = <div key={emergencyCategoryIndex} className="mdl-cell mdl-cell--3-col"><div className={s.gridCell}>
              <Criterion criterion={tableDataCell.content}  key={emergencyCategoryIndex} level = {tableDataCell.name}/>
            </div> </div>;
          }

          return(cellContent);

          //Loop through all the cell data in the table map
          /*tableData.map((cellData, cellIndex) => {
            if(cellData.content != "")
            {
              var cellDataCriterionNumber = this.getCriterionConditionNumber(cellData.content.name);
              if(cellDataCriterionNumber === conditionNumber && cellData.emergencyLevel === emergencyCat)
              {
                var cellContent = <div key={cellIndex} className="mdl-cell mdl-cell--3-col"><div className={s.gridCell}>
                  <Criterion criterion = {cellData.content} key={index} level = {cellData.name}/>
                </div> </div>;
                hasData = true;
                return(cellContent);
              }
            }
          })*/
          //End of the table data map
      })
      //End of the emergency map
      } </div></div>;
      return (rowData);
      })
    }
  </div>;



{/*  else
    var emptyCell =
    <div key={index} className="mdl-cell mdl-cell--3-col"><div className={s.gridCell}>

    </div> </div>;

    return(emptyCell);
  } */}

  return rowsData;
}

getRowsData(tableData){
  //Work around to get a map
  var conditionNumbersArray = [];
  for(var i = this.state.lowestCriterionConditionNumber; i <= this.state.highestCriterionConditionNumber; i++)
  {
    conditionNumbersArray.push(i);
  }

  var emergencyCategoriesArray = ["General Emergency", "Site Area Emergency", "Alert", "Unusual Event"];

  //Add all the rows to this container div
  var rowsData = <div>
    {
      //Loop through the emergency categories
      emergencyCategoriesArray.map((emergencyCat, emerIndex) => {
      {
        //Used to pass the value from the inner map to the outer map
        var rowData =
        //Loop through all the condition numbers
        conditionNumbersArray.map((conditionNumber, outerIndex) => {

          var hasData = false;
          //Add a row data to this container div
          var rowData = <div key={outerIndex} className={s.testRow}><div className="mdl-grid ">
            {
              //Loop through all the cell data in the table map

              tableData.map((cellData, index) => {
                if(cellData.content != "")
                {
                  var cellDataCriterionNumber = this.getCriterionConditionNumber(cellData.content.name);
                  if(cellDataCriterionNumber === conditionNumber && cellData.emergencyLevel === emergencyCat)
                  {
                    var cellContent = <div key={index} className="mdl-cell mdl-cell--3-col"><div className={s.gridCell}>
                      <Criterion criterion = {cellData.content} key={index} level = {cellData.name}/>
                    </div> </div>;
                    hasData = true;
                    return(cellContent);
                  }
                }
              })
              //End of the table data map
            }
          </div></div>;
          return (rowData);
        })
        //End of conditionNumber map
      }
      return rowData;
    })
    //End of the emergency category map
  }
  </div>;



{/*  else
    var emptyCell =
    <div key={index} className="mdl-cell mdl-cell--3-col"><div className={s.gridCell}>

    </div> </div>;

    return(emptyCell);
  } */}

  return rowsData;
}

  /**
  * Extracts the condition number from the criterion header name
  * @param {String} criterionName
  * @return {Number} conditionNumber
  */
  getCriterionConditionNumber(criterionName)
  {
    var conditionNumber = parseInt(criterionName.replace( /(^.+\D)(\d+)(\D.+$)/i,'$2'));
    return conditionNumber;
  }

  getTableData()
  {
    //Find the required number of rows
    var rawData = eALDocument.getRecognitionCategoryData(store.getState().category).emergency_categories;
    var lowestCriterionConditionNumber = 10; //E.G the number of the criterion after the letter category: H-2
    var highestCriterionConditionNumber = 0;
    var numberOfRows = 0; //The number of rows the table should have
    for(var i = 0; i < rawData.length; i++)
    {
      for(var y = 0; y < rawData[i].criterions.length; y++)
      {
        //Find the first occurence of a number inside a string. The first number is the criterion condition number
        var criterionNumber = this.getCriterionConditionNumber(rawData[i].criterions[y].name);
        if(criterionNumber > highestCriterionConditionNumber)
        {
          highestCriterionConditionNumber = criterionNumber;
        }

        if(criterionNumber < lowestCriterionConditionNumber)
        {
          lowestCriterionConditionNumber = criterionNumber;
        }
      }
    }

    //Calculate the number of rows that are needed in the table
    numberOfRows = highestCriterionConditionNumber - lowestCriterionConditionNumber + 1; //Add one for the header TODO might have to add one more, if the table does not start at Zero.
    //Store the calculated values for use in the table later
    this.state.numberOfRows = numberOfRows;
    this.state.lowestCriterionConditionNumber = lowestCriterionConditionNumber;
    this.state.highestCriterionConditionNumber = highestCriterionConditionNumber;

    //Get the emergency criterion data of the selected emergency category
    var emergencyCategories = eALDocument.getRecognitionCategoryData(store.getState().category).emergency_categories;

    //Fill the table data and add in empty elements if a emergency category does not have the current criterion condition number
    var myTableData = [];

    //Go through every emergency category
    for(var y = 0; y < emergencyCategories.length; y++)
    {
      //Check if the current emergency category has all the criterions between the lowest and highest found criterions.
      for(var i = lowestCriterionConditionNumber; i <= highestCriterionConditionNumber; i++)
      {
        var categoryHasCriterion = false;
        for(var z = 0; z < emergencyCategories[y].criterions.length; z++)
        {
          //Find the first occurence of a number inside a string. The first number is the criterion condition number
          var criterionNumber = this.getCriterionConditionNumber(emergencyCategories[y].criterions[z].name);
          if(criterionNumber === i)
          {
            //myTableData.push(this.createRowData(emergencyCategories[y].name, emergencyCategories[y].criterions[z].name
              //+ " - " + emergencyCategories[y].criterions[z].description.text));
            myTableData.push(this.createRowData(emergencyCategories[y].name, emergencyCategories[y].criterions[z]));
            categoryHasCriterion = true;
            break;
          }
        }

        //If the emergency category did not have the criterion we add an empty object to fill the gap in the overview table.
        if(categoryHasCriterion === false)
        {
          myTableData.push(this.createRowData(emergencyCategories[y].name, ""));
        }
      }
    }
    console.table(myTableData);
    return myTableData;
  }

  render() {
    var tableData = this.getTableData();

    var table =
    <div>
      <div className={s.gridHeader}><div className="mdl-grid ">
        <div className="mdl-cell mdl-cell--3-col"><div className={s.gridCell}> General Emergency </div> </div>
        <div className="mdl-cell mdl-cell--3-col"><div className={s.gridCell}> Site Area Emergency </div> </div>
        <div className="mdl-cell mdl-cell--3-col"><div className={s.gridCell}> Alert </div> </div>
        <div className="mdl-cell mdl-cell--3-col"><div className={s.gridCell}> Unusual Event </div> </div>
      </div></div>
      {this.getRowsData2(tableData)}
    </div>
    return(table);
  }
}

export default OverviewTable;
