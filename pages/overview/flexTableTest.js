import store from '../../core/store';
import {eALDocument} from '../../database-loader';

import s from './styles.css';

const React = require('react');



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
      numberOfRows : 0
    }
  }

  createRowData(emergencyCat, content)
  {
    return{
      emergencyLevel : emergencyCat,
      content: content,
    }
  }

  getColumnData(tableData, emergencyCat)
  {
    var columnData =
    <td className={s.overviewColumn}>
      {
        tableData.map((cellData, index) => {
          if(cellData.emergencyLevel === emergencyCat)
          {
            return (<tr className="mdl-data-table__cell--non-numeric">
              {cellData.content}
            </tr>);
          }
        })
      }
    </td>;
    return columnData;
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
        var criterionNumber = parseInt((rawData[i].criterions[y].name).replace( /(^.+\D)(\d+)(\D.+$)/i,'$2'));
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
    //Set the row number of the state for use later with the data table
    this.state.numberOfRows = numberOfRows;


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
          var criterionNumber = parseInt((emergencyCategories[y].criterions[z].name).replace( /(^.+\D)(\d+)(\D.+$)/i,'$2'));
          if(criterionNumber === i)
          {
            myTableData.push(this.createRowData(emergencyCategories[y].name, emergencyCategories[y].criterions[z].name + " - " + emergencyCategories[y].criterions[z].description.text));
            //myTableData.push(this.createRowData(emergencyCategories[y].name, emergencyCategories[y].criterions[z]));
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

    return myTableData;
  }

  render() {
    var tableData = this.getTableData();

    var table =
    <div>
      <div className="mdl-layout-spacer"></div>
      <div className="mdl-cell mdl-cell--4-col-tablet mdl-cell--4-col-desktop mdl-cell--stretch">
        <table className="mdl-data-table mdl-js-data-table">
          <thead>
            <tr>
              <th className="mdl-data-table__cell--non-numeric">General Emergency</th>
              <th className="mdl-data-table__cell--non-numeric">Site Area Emergency</th>
              <th className="mdl-data-table__cell--non-numeric">Alert</th>
              <th className="mdl-data-table__cell--non-numeric">Unusual Event</th>
            </tr>
          </thead>
          <tbody>
            {this.getColumnData(tableData, "General Emergency")}
            {this.getColumnData(tableData, "Site Area Emergency")}
            {this.getColumnData(tableData, "Alert")}
            {this.getColumnData(tableData, "Unusual Event")}
          </tbody>
        </table>;
      </div>
      <div className="mdl-layout-spacer"></div>
    </div>
    return(table);
  }
}

export default OverviewTable;
